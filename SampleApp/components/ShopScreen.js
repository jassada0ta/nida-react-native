import React from 'react';
import globalStyles from '../global-styles';
import { View, ScrollView, Button, Text, Image, StyleSheet } from 'react-native';

const ProductItem = ({ product, onAdd }) => (
    <View style={styles.shopItemContainer}>
        <View style={styles.shopItemHeaderContainer}>
            <Text stlye={styles.productNameText}>{product.name}</Text>
            <Button title="Add" onPress={() => onAdd(product)}></Button>
        </View>
        <Image source={product.image} />
    </View>
);

const ShopScreen = ({
    products,
    onCheckout,
    onAddProductToCart
}) => (
        <View style={globalStyles.container}>
            <View style={globalStyles.screenTitleContainer}>
                <Text style={globalStyles.screenTitleText}>Shop</Text>
            </View>
            <ScrollView style={styles.container}>
                <View stlye={styles.itemsContainer}>
                    {products.map(x => <ProductItem key={x.id} product={x} onAdd={onAddProductToCart} />)}
                </View>
            </ScrollView>
            <View style={globalStyles.commandButtonsContainer}>
                <Button title="Checkout" onPress={onCheckout} />
            </View>
        </View>
    );


const styles = StyleSheet.create({
    shopItemHeaderContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    itemsContainer: {
        flexDirection: "row",
        flex: 1,
    },
    productNameText: {
        fontSize: 14,
        color: "black",
        marginRight: 5,
    },
    shopItemContainer: {
        alignItems: "center",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5,
        margin: 5,
        padding: 5,
    },
    container: {
        flex: 1,
        alignSelf: "stretch",
        backgroundColor: '#F5FCFF',
    },
});
export default ShopScreen;