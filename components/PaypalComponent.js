import React from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import PayPal from "expo-paypal";

const PaymentScreen = ({ amount }) => {
  
  const sendPayment = async (startProcess) => {
    if (amount === null || amount === 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    startProcess();
  };

  return (
    <View style={styles.container}>
      <PayPal
        popupContainerStyle={{ height: 400 }}
        onPress={(startProcess) => sendPayment(startProcess)}
        title="Submit"
        buttonStyles={styles.button}
        btnTextStyles={styles.buttonText}
        amount={amount}
        success={(a) => {
          console.log("Payment Success:", a);
          Alert.alert("Success", "Payment was successful!");
        }}
        failed={(a) => {
          console.log("Payment Failed:", a);
          Alert.alert("Failed", "Payment failed. Please try again.");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  button: {
    backgroundColor: '#0072ff',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;