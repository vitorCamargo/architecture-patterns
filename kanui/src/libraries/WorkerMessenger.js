import { InvalidArgumentError, InvalidArgumentReason } from '../errors/InvalidArgumentError';
import SdkEnvironment from '../managers/SdkEnvironment';
import { ServiceWorkerActiveState } from '../helpers/ServiceWorkerHelper';
import { WindowEnvironmentKind } from '../models/WindowEnvironmentKind';
import Environment from '../Environment';
import Log from './Log';
/**
 * NOTE: This file contains a mix of code that runs in ServiceWorker and Page contexts
*/
export var WorkerMessengerCommand;
(function (WorkerMessengerCommand) {
    WorkerMessengerCommand["WorkerVersion"] = "GetWorkerVersion";
    WorkerMessengerCommand["Subscribe"] = "Subscribe";
    WorkerMessengerCommand["SubscribeNew"] = "SubscribeNew";
    WorkerMessengerCommand["AmpSubscriptionState"] = "amp-web-push-subscription-state";
    WorkerMessengerCommand["AmpSubscribe"] = "amp-web-push-subscribe";
    WorkerMessengerCommand["AmpUnsubscribe"] = "amp-web-push-unsubscribe";
    WorkerMessengerCommand["NotificationDisplayed"] = "notification.displayed";
    WorkerMessengerCommand["NotificationClicked"] = "notification.clicked";
    WorkerMessengerCommand["NotificationDismissed"] = "notification.dismissed";
    WorkerMessengerCommand["RedirectPage"] = "command.redirect";
    WorkerMessengerCommand["SessionUpsert"] = "os.session.upsert";
    WorkerMessengerCommand["SessionDeactivate"] = "os.session.deactivate";
    WorkerMessengerCommand["AreYouVisible"] = "os.page_focused_request";
    WorkerMessengerCommand["AreYouVisibleResponse"] = "os.page_focused_response";
    WorkerMessengerCommand["SetLogging"] = "os.set_sw_logging";
})(WorkerMessengerCommand || (WorkerMessengerCommand = {}));
export class WorkerMessengerReplyBuffer {
    constructor() {
        this.replies = {};
    }
    addListener(command, callback, onceListenerOnly) {
        const record = { callback, onceListenerOnly };
        const replies = this.replies[command.toString()];
        if (replies)
            replies.push(record);
        else
            this.replies[command.toString()] = [record];
    }
    findListenersForMessage(command) {
        return this.replies[command.toString()] || [];
    }
    deleteListenerRecords(command) {
        this.replies[command.toString()] = null;
    }
    deleteAllListenerRecords() {
        this.replies = {};
    }
    deleteListenerRecord(command, targetRecord) {
        const listenersForCommand = this.replies[command.toString()];
        if (listenersForCommand == null)
            return;
        for (let listenerRecordIndex = listenersForCommand.length - 1; listenerRecordIndex >= 0; listenerRecordIndex--) {
            const listenerRecord = listenersForCommand[listenerRecordIndex];
            if (listenerRecord === targetRecord) {
                listenersForCommand.splice(listenerRecordIndex, 1);
            }
        }
    }
}
/**
* A Promise-based PostMessage helper to ease back-and-forth replies between
* service workers and window frames.
*/
export class WorkerMessenger {
    constructor(context, replies = new WorkerMessengerReplyBuffer()) {
        this.context = context;
        this.replies = replies;
    }
    /**
     * Broadcasts a message from a service worker to all clients, including uncontrolled clients.
     */
    async broadcast(command, payload) {
        if (SdkEnvironment.getWindowEnv() !== WindowEnvironmentKind.ServiceWorker)
            return;
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        for (const client of clients) {
            Log.debug(`[Worker Messenger] [SW -> Page] Broadcasting '${command.toString()}' to window client ${client.url}.`);
            client.postMessage({
                command: command,
                payload: payload
            });
        }
    }
    /*
      For pages:
  
        Sends a postMessage() to the service worker controlling the page.
  
        Waits until the service worker is controlling the page before sending the
        message.
     */
    async unicast(command, payload, windowClient) {
        const env = SdkEnvironment.getWindowEnv();
        if (env === WindowEnvironmentKind.ServiceWorker) {
            if (!windowClient) {
                throw new InvalidArgumentError('windowClient', InvalidArgumentReason.Empty);
            }
            else {
                Log.debug(`[Worker Messenger] [SW -> Page] Unicasting '${command.toString()}' to window client ${windowClient.url}.`);
                windowClient.postMessage({
                    command: command,
                    payload: payload
                });
            }
        }
        else {
            if (!(await this.isWorkerControllingPage())) {
                Log.debug("[Worker Messenger] The page is not controlled by the service worker yet. Waiting...", self.registration);
            }
            await this.waitUntilWorkerControlsPage();
            Log.debug(`[Worker Messenger] [Page -> SW] Unicasting '${command.toString()}' to service worker.`);
            this.directPostMessageToSW(command, payload);
        }
    }
    directPostMessageToSW(command, payload) {
        Log.debug(`[Worker Messenger] [Page -> SW] Direct command '${command.toString()}' to service worker.`);
        navigator.serviceWorker.controller.postMessage({
            command: command,
            payload: payload
        });
    }
    /**
     * Due to https://github.com/w3c/ServiceWorker/issues/1156, listen() must
     * synchronously add self.addEventListener('message') if we are running in the
     * service worker.
     *
     * @param listenIfPageUncontrolled If true, begins listening for service
     * worker messages even if the service worker does not control this page. This
     * parameter is set to true on HTTPS iframes expecting service worker messages
     * that live under an HTTP page.
     */
    async listen(listenIfPageUncontrolled) {
        if (!Environment.supportsServiceWorkers())
            return;
        const env = SdkEnvironment.getWindowEnv();
        if (env === WindowEnvironmentKind.ServiceWorker) {
            self.addEventListener('message', this.onWorkerMessageReceivedFromPage.bind(this));
            Log.debug('[Worker Messenger] Service worker is now listening for messages.');
        }
        else
            await this.listenForPage(listenIfPageUncontrolled);
    }
    /**
     * Listens for messages for the service worker.
     *
     * Waits until the service worker is controlling the page before listening for
     * messages.
     */
    async listenForPage(listenIfPageUncontrolled) {
        if (!listenIfPageUncontrolled) {
            if (!(await this.isWorkerControllingPage())) {
                Log.debug(`(${location.origin}) [Worker Messenger] The page is not controlled by the service worker yet. Waiting...`, self.registration);
            }
            await this.waitUntilWorkerControlsPage();
            Log.debug(`(${location.origin}) [Worker Messenger] The page is now controlled by the service worker.`);
        }
        navigator.serviceWorker.addEventListener('message', this.onPageMessageReceivedFromServiceWorker.bind(this));
        Log.debug(`(${location.origin}) [Worker Messenger] Page is now listening for messages.`);
    }
    onWorkerMessageReceivedFromPage(event) {
        const data = event.data;
        /* If this message doesn't contain our expected fields, discard the message */
        /* The payload may be null. AMP web push sends commands to our service worker in the format:
    
           { command: "amp-web-push-subscription-state", payload: null }
           { command: "amp-web-push-unsubscribe", payload: null }
           { command: "amp-web-push-subscribe", payload: null }
    
        */
        if (!data || !data.command) {
            return;
        }
        const listenerRecords = this.replies.findListenersForMessage(data.command);
        const listenersToRemove = [];
        const listenersToCall = [];
        Log.debug(`[Worker Messenger] Service worker received message:`, event.data);
        for (let listenerRecord of listenerRecords) {
            if (listenerRecord.onceListenerOnly) {
                listenersToRemove.push(listenerRecord);
            }
            listenersToCall.push(listenerRecord);
        }
        for (let i = listenersToRemove.length - 1; i >= 0; i--) {
            const listenerRecord = listenersToRemove[i];
            this.replies.deleteListenerRecord(data.command, listenerRecord);
        }
        for (let listenerRecord of listenersToCall) {
            listenerRecord.callback.apply(null, [data.payload]);
        }
    }
    /*
    Occurs when the page receives a message from the service worker.
  
    A map of callbacks is checked to see if anyone is listening to the specific
    message topic. If no one is listening to the message, it is discarded;
    otherwise, the listener callback is executed.
    */
    onPageMessageReceivedFromServiceWorker(event) {
        const data = event.data;
        /* If this message doesn't contain our expected fields, discard the message */
        if (!data || !data.command) {
            return;
        }
        const listenerRecords = this.replies.findListenersForMessage(data.command);
        const listenersToRemove = [];
        const listenersToCall = [];
        Log.debug(`[Worker Messenger] Page received message:`, event.data);
        for (let listenerRecord of listenerRecords) {
            if (listenerRecord.onceListenerOnly) {
                listenersToRemove.push(listenerRecord);
            }
            listenersToCall.push(listenerRecord);
        }
        for (let i = listenersToRemove.length - 1; i >= 0; i--) {
            const listenerRecord = listenersToRemove[i];
            this.replies.deleteListenerRecord(data.command, listenerRecord);
        }
        for (let listenerRecord of listenersToCall) {
            listenerRecord.callback.apply(null, [data.payload]);
        }
    }
    /*
      Subscribes a callback to be notified every time a service worker sends a
      message to the window frame with the specific command.
     */
    on(command, callback) {
        this.replies.addListener(command, callback, false);
    }
    /*
    Subscribes a callback to be notified the next time a service worker sends a
    message to the window frame with the specific command.
  
    The callback is executed once at most.
    */
    once(command, callback) {
        this.replies.addListener(command, callback, true);
    }
    /**
      Unsubscribe a callback from being notified about service worker messages
      with the specified command.
     */
    off(command) {
        if (command) {
            this.replies.deleteListenerRecords(command);
        }
        else {
            this.replies.deleteAllListenerRecords();
        }
    }
    /*
      Service worker postMessage() communication relies on the property
      navigator.serviceWorker.controller to be non-null. The controller property
      references the active service worker controlling the page. Without this
      property, there is no service worker to message.
  
      The controller property is set when a service worker has successfully
      registered, installed, and activated a worker, and when a page isn't loaded
      in a hard refresh mode bypassing the cache.
  
      It's possible for a service worker to take a second page load to be fully
      activated.
     */
    async isWorkerControllingPage() {
        const env = SdkEnvironment.getWindowEnv();
        if (env === WindowEnvironmentKind.ServiceWorker)
            return !!self.registration.active;
        else {
            const workerState = await this.context.serviceWorkerManager.getActiveState();
            return workerState === ServiceWorkerActiveState.WorkerA ||
                workerState === ServiceWorkerActiveState.WorkerB;
        }
    }
    /**
     * For pages, waits until one of our workers is activated.
     *
     * For service workers, waits until the registration is active.
     */
    async waitUntilWorkerControlsPage() {
        return new Promise(async (resolve) => {
            if (await this.isWorkerControllingPage())
                resolve();
            else {
                const env = SdkEnvironment.getWindowEnv();
                if (env === WindowEnvironmentKind.ServiceWorker) {
                    self.addEventListener('activate', async (_e) => {
                        if (await this.isWorkerControllingPage())
                            resolve();
                    });
                }
                else {
                    navigator.serviceWorker.addEventListener('controllerchange', async (_e) => {
                        if (await this.isWorkerControllingPage())
                            resolve();
                    });
                }
            }
        });
    }
}
//# sourceMappingURL=WorkerMessenger.js.map