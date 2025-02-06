import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, View, Button, FlatList } from 'react-native';
import { useMeal } from '../context/MealContext';

export default function Page() {
  const { meals } = useMeal();
  const router = useRouter();

  return (
    <View>
      <SignedIn>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Mes repas</Text>

        {meals.length === 0 ? (
          <Text>Aucun repas trouvé</Text>
        ) : (
          <FlatList
            data={meals}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <Text>{item.name} - {item.date} {item.time}</Text>
                <Text>Aliments: {item.foods.join(', ')}</Text>
              </View>
            )}
          />
        )}

        <Button title="Ajouter un repas" onPress={() => router.push('/add-meal')} />
        <Button title="Mon profil" onPress={() => router.push('/profile')} />
      </SignedIn>

      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  );
}
