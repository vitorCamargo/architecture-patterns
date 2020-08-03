import * as cookie from './cookie';
import getConfig from './getConfig';

const updateCartQuantity = () => {
    const cartId = cookie.get('cart.id');
    fetch(`${getConfig('api.cart')}${cartId}`)
      .then(response => response.json())
      .then(data => {
          const quantity = !data.lines 
            ? 0 
            : data.lines.reduce(
              (total, line) => total + (getConfig('minicart.sumQuantity') ? (line.quantity || 1) : 1),
              0
            );
            cookie.set('cart.quantity', quantity || 0);
            console.log('Carrinho atualizado.', quantity);
      });
      
}

export default updateCartQuantity;