import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface PaystackViewProps {
    amount: number;
    onSuccess: (transactionData: any) => void;
    onCancel: () => void;
}

const PaystackView = ({ amount, onSuccess, onCancel }: PaystackViewProps) => {
    const handlePayment = () => {
        // Simulate payment processing
        console.log("Processing payment of amount:", amount);
        setTimeout(() => {
            // Simulate a successful payment transaction
            onSuccess({ status: "success", amount });
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Paystack Payment</Text>
            <Text style={styles.amountText}>Amount: ${amount}</Text>
            <TouchableOpacity style={styles.button} onPress={handlePayment}>
                <Text style={styles.buttonText}>Pay Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>Cancel Payment</Text>
            </TouchableOpacity>
        </View>
    );
};

export default PaystackView;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    amountText: {
        fontSize: 18,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#673ab7",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: "#d32f2f",
        padding: 10,
        borderRadius: 8,
    },
    cancelButtonText: {
        color: "#fff",
        fontSize: 16,
    },
}); 