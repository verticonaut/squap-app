import { Stack } from 'expo-router'
import React from 'react'

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Member List' }} />
      <Stack.Screen name="[id]" options={{ title: 'Member Details' }} />
    </Stack>
  )
}

export default Layout