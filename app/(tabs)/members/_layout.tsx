import { Stack } from 'expo-router'
import React from 'react'

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Members' }} />
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