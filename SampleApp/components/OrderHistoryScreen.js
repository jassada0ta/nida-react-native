import React from 'react';
import { View, Button, ScrollView, Text, Image, StyleSheet } from 'react-native';
import globalStyles from '../global-styles';

const SaleOrderComponent = ({ purchaseOrder }) => {
    let sum = purchaseOrder.lineItems.reduce((prev, cur) => {
        return prev + (cur.qty * cur.price);
    }, 0);
    return (
        <View style={styles.orderContainer}>
            <Text>Order#:{purchaseOrder.id}</Text>
            <Text>OrderDate:{purchaseOrder.orderDate} Total:{sum}</Text>
        </View>
    );
};

const OrderHistoryScreen = ({ orders, onBack }) => (
    <View style={globalStyles.container}>
        <View style={globalStyles.screenTitleContainer}>
            <Text style={globalStyles.screenTitleText}>History</Text>
        </View>
        <ScrollView style={styles.container}>
            {orders.map(x => (<SaleOrderComponent key={x.id} purchaseOrder={x} />))}
        </ScrollView>
        <View style={globalStyles.commandButtonsContainer}>
            <Button title="Back" onPress={onBack} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "stretch",
        backgroundColor: '#F5F5DD',
    },
    orderContainer: {
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5,
        margin: 5,
        padding: 5,
    },
});

export default OrderHistoryScreen;