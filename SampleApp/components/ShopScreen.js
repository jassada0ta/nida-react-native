import React from 'react';
import { View, Button, Text, Image, StyleSheet } from 'react-native';

const ProductItem = ({ product, onAdd }) => (
    <View>
        <Image source={product.image} />
        <Text>{product.name}</Text>
        <Button title="Add" onPress={() => onAdd(product.id)} />
    </View>
);

const ShopScreen = ({ products, onCheckout }) => (
    <View>
        {products.map(x => <ProductItem key={x.id} product={x} onAdd={onAddProductToCart} />)}
        <Button title="Checkout" onPress={onCheckout} />
    </View>
);

export default ShopScreen;