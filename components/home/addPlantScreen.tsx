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
    image: require('../../assets/img/plant.png'),
  },
  {
    id: '2',
    name: 'Frijol',
    image: require('../../assets/img/plant.png'),
  },
  {
    id: '3',
    name: 'Tomate',
    image: require('../../assets/img/plant.png'),
  },
  {
    id: '4',
    name: 'Zanahoria',
    image: require('../../assets/img/plant.png'),
  },
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Agregar Plantas</Text>
          <Text style={styles.subtitle}>Escoge el cultivo que deseas agregar.</Text>
        </View>

        <View style={styles.plantsGrid}>
          {plants.map((plant, index) => (
            <View key={plant.id} style={styles.plantCard}>
              {index === 0 && (
                <View style={styles.imageContainer}>
                  <Image source={plant.image} style={styles.plantImage} />
                </View>
              )}
              
              <Text style={styles.plantName}>{plant.name}</Text>
              
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
      </ScrollView>

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
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
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
    marginBottom: 16,
    overflow: 'hidden',
  },
  plantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  plantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
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
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'center',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#F9FAFB',
  },
  confirmButton: {
    backgroundColor: '#9CA3AF',
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