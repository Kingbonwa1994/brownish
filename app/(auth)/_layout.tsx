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
    <SafeAreaView>
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
          <View >
            <View >
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

