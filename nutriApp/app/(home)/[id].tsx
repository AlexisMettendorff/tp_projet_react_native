import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
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
    <View>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{meal.name}</Text>
      <Text>{meal.date} {meal.time}</Text>
      
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Aliments :</Text>
      {foodDetails.length > 0 ? (
        foodDetails.map((item, index) => (
          <View key={index}>
            <Text>{item.food}</Text>
            <Text>Calories: {item.ENERC_KCAL} kcal</Text>
            <Text>Glucides: {item.CHOCDF} g</Text>
            <Text>Protéines: {item.PROCNT} g</Text>
            <Text>Lipides: {item.FAT} g</Text>
          </View>
        ))
      ) : (
        <Text>Aucun aliment trouvé</Text>
      )}

      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Total de calories du repas : {totalCalories} kcal</Text>

      <Button title="Supprimer le repas" onPress={handleDeleteMeal} />
      <Button title="Retour" onPress={() => router.push('/')} />
    </View>
  );
}
