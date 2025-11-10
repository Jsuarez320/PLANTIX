import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase'
import PlantDetailsModal from './PlantDetailsModal'

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
  const [modalVisible, setModalVisible] = useState(false)

  const primaryPlantName = useMemo(() => {
    const id = selectedPlants[0]
    const found = plants.find(p => p.id === id)
    return found?.name
  }, [selectedPlants])

  const handleModalConfirm = async (payload: { quantity: number; description?: string }) => {
    if (!primaryPlantName) {
      setModalVisible(false)
      return
    }

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id
    if (!userId) {
      console.warn('No hay usuario autenticado')
      setModalVisible(false)
      return
    }

    const { error } = await supabase
      .from('plantings')
      .insert({
        user_id: userId,
        plant_name: primaryPlantName,
        quantity: payload.quantity,
        description: payload.description ?? null,
      })

    if (error) {
      console.error('Error guardando siembra:', error.message)
    } else {
      // Limpio selección y cierro modal
      setSelectedPlants([])
    }

    setModalVisible(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Agregar Plantas</Text>
          <Text style={styles.subtitle}>Escoge tus cultivos favoritos, agrégalos y empieza a ver crecer tu progreso. Una vez añadidos, podrás consultarlos siempre en tu Huerto</Text>
        </View>

        <View style={styles.plantsGrid}>
          {plants.map((plant) => (
            <TouchableOpacity
              key={plant.id}
              style={styles.plantCard}
              activeOpacity={0.85}
              onPress={() => {
                setSelectedPlants([plant.id])
                setModalVisible(true)
              }}
            >
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
                onPress={() => {
                  // Seleccionar esta planta y abrir el modal
                  setSelectedPlants([plant.id])
                  setModalVisible(true)
                }}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
      <PlantDetailsModal
        visible={modalVisible}
        plantName={primaryPlantName}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleModalConfirm}
      />
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
    marginTop: 18,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
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
  }  
});