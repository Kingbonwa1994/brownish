import { Slot, Stack, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthLayout() {
  return (
    <Stack >
      <Stack.Screen name='signIn' options={{headerShown: false}}/>
      <Stack.Screen name='signUp' options={{headerShown: false}}/>
    </Stack>
  );
}

