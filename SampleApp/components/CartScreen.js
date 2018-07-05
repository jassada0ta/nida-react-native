import React from 'react';
import { View, Button, Text, Image, StyleSheet, ScrollView } from 'react-native';
import services from '../shop-service';
import globalStyles from '../global-styles';

const CartItem = ({ cartItem, onRemove, onQtyChange, products }) => {
    const product = services.getProductById(products, cartItem.productId);
    return (
        <View style={styles.cartItemContainer}>
            <Image source={product.image} />
            <Text>{product.name}</Text>
            <View style={styles.qtyContainer}>
                <Text>Qty:{cartItem.qty}</Text>
                <Button title="-" onPress={() => onQtyChange(cartItem.productId, cartItem.qty - 1)} />
                <Button title="+" onPress={() => onQtyChange(cartItem.productId, cartItem.qty + 1)} />
            </View>
            <Button title="X" onPress={() => onRemove(cartItem.productId)} />
        </View>
    );
};

const CartScreen = ({
    cart,
    onRemoveItemFromCart,
    onItemQtyChange,
    onCommitOrder,
    onBack,
    products,
}) => (
        <View style={globalStyles.container}>
            <View style={globalStyles.screenTitleContainer}>
                <Text style={globalStyles.screenTitleText}>Cart</Text>
            </View>
            <ScrollView style={styles.container}>
                <View stlye={styles.itemsContainer}>
                    {cart.map(x =>
                        <CartItem key={x.id} cartItem={x}
                            products={products}
                            onRemove={onRemoveItemFromCart}
                            onQtyChange={onItemQtyChange} />)}
                </View>
            </ScrollView>
            <View style={globalStyles.commandButtonsContainer}>
                <Button title="Back" onPress={onBack} />
                <Button title="Confirm Order" onPress={onCommitOrder} />
            </View>
        </View>
    );

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "stretch",
        backgroundColor: '#F5FCFF',
    },
    qtyContainer: {
        flexDirection: "row",
    },
    cartItemContainer: {
        borderWidth: 1,
        borderColor: "black",
        margin: 5,
        borderRadius: 5,
    },
});
export default CartScreen;