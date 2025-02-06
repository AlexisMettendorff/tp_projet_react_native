import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList, TouchableOpacity } from 'react-native';
import { useMeal } from '../context/MealContext';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';

const EDAMAM_APP_ID = '176ba379';
const EDAMAM_APP_KEY = '23446993d5ad17d69b640410997c86c3';

export default function AddMealScreen() {
  const { addMeal } = useMeal();
  const router = useRouter();

  const [name, setName] = useState<'Petit-déjeuner' | 'Déjeuner' | 'Goûter' | 'Souper' | 'Collation'>('Petit-déjeuner');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
  const [time, setTime] = useState(new Date().toISOString().slice(11, 16)); // HH:MM
  const [searchQuery, setSearchQuery] = useState('');
  const [foodResults, setFoodResults] = useState<string[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);

  const searchFood = async () => {
    if (!searchQuery) return;

    try {
      const response = await fetch(
        `https://api.edamam.com/api/food-database/v2/parser?ingr=${searchQuery}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`
      );
      const data = await response.json();
      setFoodResults(data.hints.map((item: any) => item.food.label));
    } catch (error) {
      console.error('Erreur lors de la récupération des aliments:', error);
    }
  };

  const addFood = (food: string) => {
    setSelectedFoods([...selectedFoods, food]);
    setFoodResults([]); 
    setSearchQuery(''); 
  };

  const handleAddMeal = () => {
    if (!name || selectedFoods.length === 0) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    const newMeal = {
      id: uuidv4(),
      name,
      date,
      time,
      foods: selectedFoods,
    };

    addMeal(newMeal);
    Alert.alert('Succès', 'Repas ajouté avec succès !');
    router.replace('/');
  };

  return (
    <View>
      <Text>Nom du repas</Text>
      <Picker selectedValue={name} onValueChange={(itemValue) => setName(itemValue)}>
        <Picker.Item label="Petit-déjeuner" value="Petit-déjeuner" />
        <Picker.Item label="Déjeuner" value="Déjeuner" />
        <Picker.Item label="Goûter" value="Goûter" />
        <Picker.Item label="Souper" value="Souper" />
        <Picker.Item label="Collation" value="Collation" />
      </Picker>

      <Text>Date</Text>
      <TextInput value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />

      <Text>Heure</Text>
      <TextInput value={time} onChangeText={setTime} placeholder="HH:MM" />

      <Text>Rechercher un aliment</Text>
      <TextInput value={searchQuery} onChangeText={setSearchQuery} placeholder="Ex: Pomme, Poulet, Riz" />
      <Button title="Rechercher" onPress={searchFood} />

      <FlatList
        data={foodResults}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => addFood(item)}>
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <Text>Aliments sélectionnés :</Text>
      {selectedFoods.map((food, index) => (
        <Text key={index}>{food}</Text>
      ))}

      <Button title="Ajouter" onPress={handleAddMeal} />
    </View>
  );
}
