import { Stack } from 'expo-router'
import React from 'react'

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Members',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: '',
          headerBackTitle: 'Members',
        }}
      />
    </Stack>
  );
}

export default Layout