import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Meal = {
  id: string;
  name: 'Petit-déjeuner' | 'Déjeuner' | 'Goûter' | 'Souper' | 'Collation';
  date: string;
  time: string;
  foods: string[];
  calories: number;
};

type MealContextType = {
  meals: Meal[];
  addMeal: (meal: Meal) => void;
  deleteMeal: (id: string) => void; 
};

const STORAGE_KEY = 'meals_data';

const MealContext = createContext<MealContextType | undefined>(undefined);

export const MealProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const storedMeals = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedMeals) {
          setMeals(JSON.parse(storedMeals));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des repas');
      }
    };
    loadMeals();
  }, []);

  const addMeal = async (meal: Meal) => {
    try {
      const updatedMeals = [...meals, meal];
      setMeals(updatedMeals);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMeals));
    } catch (error) {
      console.error('Erreur lors de l’ajout du repas');
    }
  };

  const deleteMeal = (id: string) => {
    setMeals((prevMeals) => {
      const updatedMeals = prevMeals.filter((meal) => meal.id !== id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMeals)); 
      return updatedMeals;
    });
  };

  return (
    <MealContext.Provider value={{ meals, addMeal, deleteMeal }}> 
      {children}
    </MealContext.Provider>
  );
};

export const useMeal = () => {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error('useMeal must be used within a MealProvider');
  }
  return context;
};

export default MealProvider;

