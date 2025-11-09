import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Plant {
  id: string;
  name: string;
  image: any;
}

const plants: Plant[] = [
  {
    id: '1',
    name: 'Lechuga',
    image: require('../../assets/img/addPlant/lettuce.png'),
  },
  {
    id: '2',
    name: 'Zanahoria',
    image: require('../../assets/img/addPlant/carrot.png'),
  },
  {
    id: '3',
    name: 'Fresas',
    image: require('../../assets/img/addPlant/strawberry.png'),
  },
  {
    id: '4',
    name: 'Acelga',
    image: require('../../assets/img/addPlant/spinach.png'),
  },
  {
    id: '5',
    name: 'Pimientos Pequeños',
    image: require('../../assets/img/addPlant/smallPeppers.png'),
  },
  {
    id: '6',
    name: 'Menta',
    image: require('../../assets/img/addPlant/mint.png'),
  }
];

export default function AddPlantScreen() {
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);

  const togglePlantSelection = (plantId: string) => {
    setSelectedPlants(prev => 
      prev.includes(plantId) 
        ? prev.filter(id => id !== plantId)
        : [...prev, plantId]
    );
  };

  const handleConfirmSelection = () => {
    console.log('Selected plants:', selectedPlants);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Agregar Plantas</Text>
          <Text style={styles.subtitle}>Escoge el cultivo que deseas agregar.</Text>
        </View>

        <View style={styles.plantsGrid}>
          {plants.map((plant) => (
            <View key={plant.id} style={styles.plantCard}>
              <View style={styles.imageContainer}>
                <Image source={plant.image} style={styles.plantImage} />
              </View>
              
              <View style={styles.plantNameContainer}>
                <Text style={styles.plantName} numberOfLines={2}>{plant.name}</Text>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.addButton,
                  selectedPlants.includes(plant.id) && styles.addButtonSelected
                ]}
                onPress={() => togglePlantSelection(plant.id)}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            Escoge tus cultivos favoritos, agrégalos y empieza a ver crecer tu progreso. Una vez añadidos, podrás consultarlos siempre en tu historial.
          </Text>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              selectedPlants.length === 0 && styles.confirmButtonDisabled
            ]}
            onPress={handleConfirmSelection}
            disabled={selectedPlants.length === 0}
          >
            <Text style={styles.confirmButtonText}>
              Confirmar Selección ({selectedPlants.length})
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 12,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  plantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  plantCard: {
    width: '48%',
    height: 225,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  plantImage: {
    width: 80,
    height: 80,
    borderRadius: 30,
  },
  plantNameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 50,
    maxHeight: 50,
    marginVertical: 8,
  },
  plantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonSelected: {
    backgroundColor: '#059669',
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  descriptionContainer: {
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'center',
  },
  bottomContainer: {
    paddingBottom: 30,
    marginTop: 8,
  },
  confirmButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});