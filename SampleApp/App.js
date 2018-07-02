import React, { Component } from 'react';
import { createStore } from 'redux';
import uuid from 'uuid/v4';
import { Provider, connect } from 'react-redux';
import ShopScreen from './components/ShopScreen';
import CartScreen from './'
import {
  StyleSheet,
  View
} from 'react-native';

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

class ShopReducer {

  _cloneState(state) {
    return {
      currentScreen: state.currentScreen,
      products: [...state.products],
      cart: state.cart.map(x => ({ ...x })),
      purchaseOrders: state.purchaseOrders.map(x => ({
        id: x.id,
        lineItems: x.lineItems.map(x => ({ ...x })),
      })),
    };
  }

  _findProductById(state, productId) {
    return state.products.filter(x => x.id === productId).pop();
  }

  _getCartItemByProductId(state, productId) {
    return state.cart.filter(x => x.productId === productId).pop();
  }

  addProductToCart(state, action) {
    let newState = this._cloneState(state);
    let cartItem = this._getCartItemByProductId(state, action.productId);
    if (!cartItem) {
      cartItem = {
        id: uuid(),
        productId: action.productId,
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
    let cartItem = this._getCartItemByProductId(state, action.productId);
    newState.cart = newState.cart.filter(x => x.id !== cartItem.id);
    return newState;
  }

  changeQtyInCart(state, action) {
    let newState = this._cloneState(state);
    let cartItem = this._getCartItemByProductId(state, action.productId);
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
        price: this._findProductById(state, x.productId).price
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
        return addProductToCart(state, action);
      case actionTypes.RemoveProductFromCart:
        return removeProductFromCart(state, action);
      case actionTypes.ChangeQtyInCart:
        return changeQtyInCart(state, action);
      case actionTypes.Checkout:
        return checkout(state, action);
      case actionTypes.CommitOrder:
        return commitOrder(state, action);
      case actionTypes.BackToShop:
        return backToShop(state, action);
      default: return state;
    }
  }
}

const reducer = (state, action) => {
  let obj = new ShopReducer();
  return obj.reduce(state, action);
}

const store = createStore(reducer);

class RootAppBase extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { currentScreen } = this.props;
    if (currentScreen === screens.Shop) {
      return (<ShopScreen />);
    }
    else if (currentScreen === screens.Cart) {
      return (<CartScreen />);
    }
    else if (currentScreen === screens.OrderHistory) {
      return (<OrderHistoryScreen />);
    }
    else {
      return (
        <View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
