import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useMeal } from '../context/MealContext';

const fetchFoodDetails = async (foodName: string) => {
  const appId = '176ba379'; 
  const apiKey = '23446993d5ad17d69b640410997c86c3'; 
  const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${appId}&app_key=${apiKey}&ingr=${foodName}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.hints && data.hints.length > 0) {
      const foodDetails = data.hints[0].food.nutrients;
      return foodDetails; 
    }
  } catch (error) {
    console.error('Erreur de récupération des détails de l\'aliment:', error);
  }
  return null;
};

export default function MealDetailScreen({ route }: any) {
  const { meals, addMeal, deleteMeal } = useMeal();
  const router = useRouter();
  const { id } = route.params;

  const [meal, setMeal] = useState<any | null>(null);
  const [foodDetails, setFoodDetails] = useState<any[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    const currentMeal = meals.find((meal) => meal.id === id);
    if (currentMeal) {
      setMeal(currentMeal);
      fetchFoodDetailsForMeal(currentMeal.foods);
    }
  }, [id, meals]);

  const fetchFoodDetailsForMeal = async (foodList: string[]) => {
    const details: any[] = [];
    let totalCal = 0;
    for (let food of foodList) {
      const foodDetail = await fetchFoodDetails(food);
      if (foodDetail) {
        details.push({ food, ...foodDetail });
        totalCal += foodDetail.ENERC_KCAL || 0; 
      }
    }
    setFoodDetails(details);
    setTotalCalories(totalCal);
  };

  const handleDeleteMeal = () => {
    Alert.alert('Confirmation', 'Voulez-vous vraiment supprimer ce repas ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        onPress: () => {
          deleteMeal(meal.id); 
          Alert.alert('Succès', 'Repas supprimé avec succès');
          router.replace('/'); 
        },
      },
    ]);
  };

  if (!meal) {
    return <Text>Repas introuvable</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mealName}>{meal.name}</Text>
      <Text style={styles.mealDate}>{meal.date} {meal.time}</Text>
      
      <Text style={styles.sectionTitle}>Aliments :</Text>
      {foodDetails.length > 0 ? (
        foodDetails.map((item, index) => (
          <View key={index} style={styles.foodItem}>
            <Text style={styles.foodName}>{item.food}</Text>
            <Text>Calories: {item.ENERC_KCAL} kcal</Text>
            <Text>Glucides: {item.CHOCDF} g</Text>
            <Text>Protéines: {item.PROCNT} g</Text>
            <Text>Lipides: {item.FAT} g</Text>
          </View>
        ))
      ) : (
        <Text style={styles.text}>Aucun aliment trouvé</Text>
      )}

      <Text style={styles.totalCalories}>Total de calories du repas : {totalCalories} kcal</Text>

      <View style={styles.buttons}>
        <Button title="Supprimer le repas" color="#e74c3c" onPress={handleDeleteMeal} />
        <Button title="Retour" onPress={() => router.push('/')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f7f7',
    flex: 1,
  },
  mealName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  mealDate: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2980b9',
    marginBottom: 10,
  },
  foodItem: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495e',
  },
  totalCalories: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e67e22',
    marginTop: 20,
  },
  buttons: {
    marginTop: 30,
  },
  text: {
    fontSize: 16,
    color: '#7f8c8d',
  },
});