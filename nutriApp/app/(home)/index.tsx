import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useMeal } from "../context/MealContext";

export default function Page() {
  const { meals } = useMeal();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SignedIn>
        <Text style={styles.title}>Mes repas</Text>

        {meals.length === 0 ? (
          <Text style={styles.noMealsText}>Aucun repas trouvé</Text>
        ) : (
          <FlatList
            data={meals}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.mealCard}>
                <Text style={styles.mealName}>{item.name}</Text>
                <Text style={styles.mealDetails}>
                  {item.date} à {item.time}
                </Text>
                <Text style={styles.mealFoods}>
                  Aliments: {item.foods.join(", ")}
                </Text>
                <Text style={styles.mealFoods}>
                  Calories: {item.calories} Kcal
                </Text>
                <TouchableOpacity onPress={() => router.push(`/${item.id}`)}>
                  <Text style={styles.viewDetailsText}>Voir les détails</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/add-meal")}
        >
          <Text style={styles.addButtonText}>Ajouter un repas</Text>
        </TouchableOpacity>        

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.profileButtonText}>Mon profil</Text>
        </TouchableOpacity>
      </SignedIn>

      <SignedOut>
        <Link href="/(auth)/sign-in" style={styles.authLink}>
          <Text style={styles.authLinkText}>Se connecter</Text>
        </Link>
        <Link href="/(auth)/sign-up" style={styles.authLink}>
          <Text style={styles.authLinkText}>S'inscrire</Text>
        </Link>
      </SignedOut>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  noMealsText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
  },
  mealCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  mealName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  mealDetails: {
    fontSize: 14,
    color: "#555",
  },
  mealFoods: {
    fontSize: 14,
    color: "#777",
    marginVertical: 5,
  },
  viewDetailsText: {
    color: "#6200ea",
    marginTop: 5,
    textDecorationLine: "underline",
  },
  addButton: {
    backgroundColor: "#6200ea",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },  
  profileButton: {
    backgroundColor: "#018786",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  profileButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  authLink: {
    marginTop: 20,
    alignItems: "center",
  },
  authLinkText: {
    fontSize: 18,
    color: "#6200ea",
    fontWeight: "bold",
  },
});
