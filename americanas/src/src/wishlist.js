import Module from './../utils/module';
class wishlist extends Module{
  constructor(){
    super('wishlist');
  }
}

let mod = new wishlist();
mod.init();

export default mod;
