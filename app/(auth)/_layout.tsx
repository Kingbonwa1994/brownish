import { Stack } from 'expo-router'
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack >
      <Stack.Screen name='signIn' options={{headerShown: false}}/>
      <Stack.Screen name='signUp' options={{headerShown: false}}/>
    </Stack>
  );
}

