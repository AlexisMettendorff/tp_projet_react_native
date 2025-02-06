import React, { useState,useEffect  } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useMeal } from '../context/MealContext';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useLocalSearchParams  } from 'expo-router';
import uuid from 'react-native-uuid';
import DateTimePicker from "@react-native-community/datetimepicker";
const EDAMAM_APP_ID = '176ba379';
const EDAMAM_APP_KEY = '23446993d5ad17d69b640410997c86c3';

export default function AddMealScreen() {
  const { addMeal } = useMeal();
  const router = useRouter();

  const [name, setName] = useState<'Petit-déjeuner' | 'Déjeuner' | 'Goûter' | 'Souper' | 'Collation'>('Petit-déjeuner');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); 
  const [time, setTime] = useState(new Date().toISOString().slice(11, 16)); 
  const [searchQuery, setSearchQuery] = useState('');
  const [foodResults, setFoodResults] = useState<string[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { barcode } = useLocalSearchParams();

  useEffect(() => {
    if (barcode && typeof barcode === "string") {
      fetchFoodByBarcode(barcode);
    }
  }, [barcode]);

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

  const fetchFoodByBarcode = async (barcode: string) => {
    try {
      const response = await fetch(
        `https://api.edamam.com/api/food-database/v2/parser?upc=${barcode}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`
      );
      const data = await response.json();

      if (data.hints.length > 0) {
        const foodLabel = data.hints[0].food.label;
        setSelectedFoods([...selectedFoods, foodLabel]);
      } else {
        Alert.alert("Aucun aliment trouvé", "Le code-barres n'a pas été reconnu.");
      }
    } catch (error) {
      console.error("Erreur lors de la recherche du code-barres:", error);
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
      id: uuid.v4(),
      name,
      date,
      time,
      foods: selectedFoods,
    };

    addMeal(newMeal);
    Alert.alert('Succès', 'Repas ajouté avec succès !');
    router.replace('/');
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    setDate(currentDate.toISOString().slice(0, 10));
    setShowDatePicker(false);
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un repas</Text>

      <Text style={styles.label}>Nom du repas</Text>
      <Picker
        selectedValue={name}
        onValueChange={(itemValue) => setName(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Petit-déjeuner" value="Petit-déjeuner" />
        <Picker.Item label="Déjeuner" value="Déjeuner" />
        <Picker.Item label="Goûter" value="Goûter" />
        <Picker.Item label="Souper" value="Souper" />
        <Picker.Item label="Collation" value="Collation" />
      </Picker>

      <Text style={styles.label}>Date</Text>
      <TextInput
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
        style={styles.input}
      />

      <Text style={styles.label}>Heure</Text>
      <TextInput
        value={time}
        onChangeText={setTime}
        placeholder="HH:MM"
        style={styles.input}
      />

      <Text style={styles.label}>Rechercher un aliment</Text>
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Ex: Pomme, Poulet, Riz"
        style={styles.input}
      />
      <Button title="Rechercher" onPress={searchFood} color="#6200ea" />

      {foodResults.length > 0 && (
        <FlatList
          data={foodResults}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.foodItem} onPress={() => addFood(item)}>
              <Text style={styles.foodText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
                style={styles.scanButton}
                onPress={() => router.push("/camera")}
              >
                <Text style={styles.scanButtonText}>Scanner un code-barre</Text>
              </TouchableOpacity>

      <Text style={styles.label}>Aliments sélectionnés :</Text>
      {selectedFoods.map((food, index) => (
        <Text key={index} style={styles.selectedFood}>{food}</Text>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddMeal}>
        <Text style={styles.addButtonText}>Ajouter le repas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  picker: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  foodItem: {
    padding: 10,
    backgroundColor: '#e1e1e1',
    borderRadius: 8,
    marginBottom: 10,
  },
  foodText: {
    fontSize: 16,
    color: '#333',
  },
  selectedFood: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  scanButton: {
    backgroundColor: "#03dac6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
