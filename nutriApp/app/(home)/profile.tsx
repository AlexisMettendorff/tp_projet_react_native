import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace('/sign-in'); // Redirige vers la page de connexion
  };

  return (
    <View>
      <Text>Profil</Text>
      {user ? (
        <>
          <Text>Email : {user.primaryEmailAddress?.emailAddress}</Text>
          <Button title="Se déconnecter" onPress={handleLogout} />
        </>
      ) : (
        <Text>Chargement...</Text>
      )}
    </View>
  );
}
