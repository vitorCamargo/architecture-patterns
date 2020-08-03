// period between requests of order statuses (30s)
const PERIOD_STATUS_POLL_MS = 30 * 1000;

// timeout to stop poll requests (3h)
const TIMEOUT_STATUS_POLL_MS = 3 * 60 * 60 * 1000;

// order statuses that stops poll requests
const STATUS_STOP_POLL = ['CANCELLED', 'CONCLUDED'];

// tag to identify notification
const TAG_NOTIF_ORDER_STATUS = 'ORDER_STATUS';

// messages to show according to status
const STATUS_MESSAGE = new Map([
  ['CONFIRMED', 'Seu pedido no restaurante {{restaurantName}} foi confirmado'],
  ['DISPATCHED', 'Seu pedido no restaurante {{restaurantName}} saiu para entrega'],
  [
    'CANCELLED',
    'Pedido #{{orderNumber}}: Pedimos desculpas, seu pedido no restaurante {{restaurantName}} foi cancelado. Por favor, tente de novo',
  ],
  ['ARRIVED', 'Seu pedido no restaurante {{restaurantName}} chegou'],
  ['CONCLUDED', 'Seu pedido no restaurante {{restaurantName}} foi finalizado'],
]);

function getMessage(status, options = {}) {
  let message = STATUS_MESSAGE.get(status);
  if (message) {
    Object.keys(options).forEach(key => {
      message = message.replace(`{{${key}}}`, String(options[key]));
    });
  }
  return message;
}

// id that identifies poll interval
let intervalId;

// orders to follow statuses
const orders = new Map();

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'ORDER_STATUS') {
    followOrder(e.data.payload);
  }
});

self.addEventListener('notificationclick', event => {
  if (event.notification.tag === TAG_NOTIF_ORDER_STATUS) {
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then(clientList => {
        const client = clientList.find(c => c.url.endsWith('/pedidos/acompanhar') && typeof c.focus === 'function');
        if (client) {
          client.focus();
        } else if (self.clients.openWindow) {
          self.clients.openWindow('/pedidos/acompanhar');
          event.notification.close();
        }
      })
    );
  }
});

async function checkOrderStatus(order) {
  try {
    const [lastStatus] = await fetchOrderStatus(order.uuid);
    if (lastStatus.date !== order.status.date) {
      followOrder(Object.assign({}, order, { status: lastStatus }));
      const message = getMessage(lastStatus.code, {
        orderNumber: order.value.number % 10000,
        restaurantName: order.value.restaurantOrder[0].restaurant.name,
      });
      if (message && self.Notification.permission === 'granted') {
        self.registration.showNotification('iFood', {
          body: message,
          badge: 'https://static-images.ifood.com.br/webapp/badge-smile.png',
          icon: 'https://static-images.ifood.com.br/webapp/logo-smile-192x192.png',
          tag: TAG_NOTIF_ORDER_STATUS,
          requireInteraction: true,
        });
      }
    }
    const delta = new Date() - new Date(lastStatus.date);
    if (STATUS_STOP_POLL.includes(lastStatus.code) || delta > TIMEOUT_STATUS_POLL_MS) {
      unfollowOrder(order.uuid);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`Could not recover status from order ${order.uuid}`, e);
  }
}

function checkOrderList() {
  Array.from(orders.values()).forEach(checkOrderStatus);
}

function followOrder(order) {
  orders.set(order.uuid, order);
  updateInterval();
}

function unfollowOrder(uuid) {
  orders.delete(uuid);
  updateInterval();
}

function updateInterval() {
  if (!intervalId && orders.size > 0) {
    // starts interval
    intervalId = setInterval(checkOrderList, PERIOD_STATUS_POLL_MS);
  } else if (intervalId && orders.size === 0) {
    // stops interval
    clearInterval(intervalId);
    intervalId = undefined;
  }
}

async function fetchOrderStatus(uuid) {
  const response = await fetch(`${self.env.MARKETPLACE_URL}/v1/customers/me/orders/${uuid}/statuses`, {
    headers: { 'Cache-Control': 'no-cache, no-store' },
  });
  if (!response.ok) {
    throw response;
  }
  return response.json();
}
