import React from 'react';
import { View, Button, Text, Image, StyleSheet } from 'react-native';

const CartItem = ({ cartItem, onRemove, onQtyChange, products }) => (
    <View>
        <Image source={product.image} />
        <Text>{product.name}</Text>
        <Button title="X" onPress={() => onRemove(cartItem.id)} />
    </View>
);

const CartScreen = ({ cart, onRemoveItemFromCart, onItemQtyChange }) => (
    <View>
        {cart.map(x => <CartItem key={x.id} cartItem={x} onRemove={onRemoveItemFromCart} onQtyChange={onItemQtyChange} />)}
        <Button title="Confirm Order" onPress={onConfirmOrder} />
    </View>
);

export default CartScreen;