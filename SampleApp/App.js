import React, { Component } from 'react';
import { createStore } from 'redux';
import uuid from 'uuid/v4';
import { Provider, connect } from 'react-redux';
import ShopScreen from './components/ShopScreen';
import CartScreen from './components/CartScreen';
import OrderHistoryScreen from './components/OrderHistoryScreen';
import globalStyles from './global-styles';
import moment from 'moment';
import {
  View
} from 'react-native';

import services from './shop-service';

const actionTypes = {
  AddProductToCart: "AddProductToCart",
  RemoveProductFromCart: "RemoveProductFromCart",
  ChangeQtyInCart: "ChangeQtyInCart",
  Checkout: "Checkout",
  CommitOrder: "CommitOrder",
  BackToShop: "BackToShop",
};

const screens = {
  Shop: "SHOP",
  Cart: "CART",
  OrderHistory: "ORDER_HISTORY",
};

const shopInitState = {
  currentScreen: screens.Shop,
  products: [
    { id: 1, name: "Product 01", image: require("./contents/book1.jpg"), price: 111 },
    { id: 2, name: "Product 02", image: require("./contents/book2.jpg"), price: 121 },
    { id: 3, name: "Product 03", image: require("./contents/book3.jpg"), price: 131 },
    { id: 4, name: "Product 04", image: require("./contents/book4.jpg"), price: 141 },
    { id: 5, name: "Product 05", image: require("./contents/book5.jpg"), price: 151 },
    { id: 6, name: "Product 06", image: require("./contents/book6.jpg"), price: 161 },
    { id: 7, name: "Product 07", image: require("./contents/book7.jpg"), price: 171 },
    { id: 8, name: "Product 08", image: require("./contents/book8.jpg"), price: 181 },
  ],
  cart: [
    //{ id: 1, productId: 2, qty: 3, },

  ],
  purchaseOrders: [
    // {
    //   id: 1,
    //   orderDate: "15 JUN 2018 15:15:33",
    //   lineItems: [
    //     { productId: 1, qty: 1, price: 111 },
    //     { productId: 2, qty: 1, price: 121 },
    //     { productId: 3, qty: 1, price: 131 },
    //   ],
    // }
  ],

};

class ShopActionCreator {
  checkout() {
    return {
      type: actionTypes.Checkout,
    };
  }

  backToShop() {
    return {
      type: actionTypes.BackToShop,
    };
  }

  addProductToCart(product) {
    return {
      type: actionTypes.AddProductToCart,
      product,
    };
  }

  itemQtyChange(productId, newQty) {
    return {
      type: actionTypes.ChangeQtyInCart,
      qty: newQty,
      productId,
    };
  }

  removeItemFromCart(productId) {
    return {
      type: actionTypes.RemoveProductFromCart,
      productId,
    };
  }

  commitOrder() {
    return {
      type: actionTypes.CommitOrder,
    };
  }
}

class ShopReducer {

  constructor(services) {
    this.services = services;
  }

  _cloneState(state) {
    return {
      currentScreen: state.currentScreen,
      products: [...state.products],
      cart: state.cart.map(x => ({ ...x })),
      purchaseOrders: state.purchaseOrders.map(x => ({
        ...x,
        lineItems: x.lineItems.map(x => ({ ...x })),
      })),
    };
  }

  _getCartItemByProductId(state, productId) {
    return state.cart.filter(x => x.productId === productId).pop();
  }

  addProductToCart(state, action) {
    let newState = this._cloneState(state);
    let cartItem = this._getCartItemByProductId(newState, action.product.id);

    if (!cartItem) {
      cartItem = {
        id: uuid(),
        productId: action.product.id,
        qty: 1,
      };
      newState.cart.push(cartItem);
    }
    else {
      cartItem.qty += 1;
    }
    return newState;
  }

  removeProductFromCart(state, action) {
    let newState = this._cloneState(state);
    let cartItem = this._getCartItemByProductId(newState, action.productId);
    newState.cart = newState.cart.filter(x => x.id !== cartItem.id);
    return newState;
  }

  changeQtyInCart(state, action) {
    let newState = this._cloneState(state);
    let cartItem = this._getCartItemByProductId(newState, action.productId);
    debugger;
    if (action.qty >= 0) {
      cartItem.qty = action.qty;
    }
    else {
      cartItem.qty = 0;
    }
    return newState;
  }

  checkout(state, action) {
    let newState = this._cloneState(state);
    newState.currentScreen = screens.Cart;
    return newState;
  }

  commitOrder(state, action) {
    let newState = this._cloneState(state);
    newState.currentScreen = screens.OrderHistory;

    newState.purchaseOrders.push({
      id: uuid(),
      orderDate: moment().format("DD/MMM/YYYY HH:mm:ss"),
      lineItems: state.cart.map(x => ({
        ...x,
        price: this.services.getProductById(state.products, x.productId).price
      })),
    });
    newState.cart = [];
    return newState;
  }

  backToShop(state, action) {
    let newState = this._cloneState(state);
    newState.currentScreen = screens.Shop;
    return newState;
  }

  reduce(state = shopInitState, action) {
    switch (action.type) {
      case actionTypes.AddProductToCart:
        return this.addProductToCart(state, action);
      case actionTypes.RemoveProductFromCart:
        return this.removeProductFromCart(state, action);
      case actionTypes.ChangeQtyInCart:
        return this.changeQtyInCart(state, action);
      case actionTypes.Checkout:
        return this.checkout(state, action);
      case actionTypes.CommitOrder:
        return this.commitOrder(state, action);
      case actionTypes.BackToShop:
        return this.backToShop(state, action);
      default: return state;
    }
  }
}

const reducer = (state, action) => {
  let obj = new ShopReducer(services);
  return obj.reduce(state, action);
}

const actionCreator = new ShopActionCreator();
const store = createStore(reducer);


const ConnectedShopScreen = connect((state) => {
  return {
    products: state.products,
  };
}, (dispatch) => {
  return {
    onCheckout: () => {
      dispatch(actionCreator.checkout());
    },
    onAddProductToCart: (product) => {
      dispatch(actionCreator.addProductToCart(product));
    },
  }
})(ShopScreen);

const ConnectedCartScreen = connect((state) => {
  return {
    cart: state.cart,
    products: state.products,
  }
}, (dispatch) => {
  return {
    onRemoveItemFromCart: (productId) => {
      dispatch(actionCreator.removeItemFromCart(productId));
    },
    onItemQtyChange: (productId, newQty) => {
      dispatch(actionCreator.itemQtyChange(productId, newQty));
    },
    onCommitOrder: () => {
      dispatch(actionCreator.commitOrder());
    },
    onBack: () => {
      dispatch(actionCreator.backToShop());
    },
  };
})(CartScreen);

const ConnectedOrderHistoryScreen = connect((state) => {
  return {
    orders: state.purchaseOrders,
  };
}, (dispatch) => {
  return {
    onBack: () => {
      dispatch(actionCreator.backToShop());
    },
  }
})(OrderHistoryScreen);

class RootAppBase extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { currentScreen } = this.props;
    if (currentScreen === screens.Shop) {
      return (<ConnectedShopScreen />);
    }
    else if (currentScreen === screens.Cart) {
      return (<ConnectedCartScreen />);
    }
    else if (currentScreen === screens.OrderHistory) {
      return (<ConnectedOrderHistoryScreen />);
    }
    else {
      return (
        <View style={globalStyles.container}>
          <Text>You should not see this.</Text>
        </View>);
    }
  }
}

const RootApp = connect((state) => {
  return {
    currentScreen: state.currentScreen,
  };
})(RootAppBase);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <RootApp />
      </Provider>
    );
  }
}

