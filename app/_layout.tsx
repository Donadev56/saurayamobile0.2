import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Désactive le header natif pour tous les écrans
      }}
    />
  );
}
