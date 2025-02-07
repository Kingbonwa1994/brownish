import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import React, { useState, useEffect } from 'react';
import { Modal, View, SafeAreaView, StyleSheet } from 'react-native';

export default function AuthLayout() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(true);

  useEffect(() => {
    if (user) {
      setIsAuthModalVisible(false);
      router.replace('/(tabs)');
    }
  }, [user, router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {!user && (
        <Modal
          visible={isAuthModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            if (!user) {
              return;
            }
            setIsAuthModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Stack>
                <Stack.Screen name="SignIn" options={{ headerShown: false }} />
                <Stack.Screen name="signUp" options={{ headerShown: false }} />
              </Stack>
            </View>
          </View>
        </Modal>
      )}
      {user && <Stack />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#121212', // Your app's background color
    borderRadius: 8,
    padding: 20,
    width: '80%', // Or a specific width
    maxWidth: 400, // Optional max width
  },
});