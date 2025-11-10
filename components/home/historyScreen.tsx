import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Pencil, Trash } from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase'

type PlantingRecord = {
  id: string
  plant_name: string
  quantity: number
  description?: string | null
  planted_at: string
}

export default function HistoryScreen() {
  const [records, setRecords] = useState<PlantingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Mapa de nombres de plantas a imágenes locales
  const plantImages: Record<string, any> = {
    'lechuga': require('../../assets/img/addPlant/lettuce.png'),
    'zanahoria': require('../../assets/img/addPlant/carrot.png'),
    'fresas': require('../../assets/img/addPlant/strawberry.png'),
    'acelga': require('../../assets/img/addPlant/spinach.png'),
    'pimientos pequeños': require('../../assets/img/addPlant/smallPeppers.png'),
    'menta': require('../../assets/img/addPlant/mint.png'),
  }

  const getPlantImage = (name?: string) => {
    const key = (name || '').toLowerCase().trim()
    return plantImages[key] ?? require('../../assets/img/plant.png')
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setErrorMsg(null)
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData.user?.id
      if (!userId) {
        setErrorMsg('No hay usuario autenticado')
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('plantings')
        .select('*')
        .eq('user_id', userId)
        .order('planted_at', { ascending: false })
      if (error) {
        setErrorMsg(error.message)
      } else {
        setRecords(data || [])
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleEdit = (plantId: string) => {
    console.log('Edit plant:', plantId);
  };

  const handleDelete = (plantId: string) => {
    console.log('Delete plant:', plantId);
  };

  const renderProgressBar = (progress: number) => {
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>Siembra</Text>
          <Text style={styles.progressLabel}>Cosecha</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Historial de Cultivo</Text>
          <Text style={styles.subtitle}>
            Sigue el progreso de siembra y cosecha de tus plantas.
          </Text>
        </View>

        {loading && (
          <Text style={{ color: '#6B7280', textAlign: 'center' }}>Cargando...</Text>
        )}
        {errorMsg && (
          <Text style={{ color: '#6B7280', textAlign: 'center' }}>No, tienes plantas en tu huerto.</Text>
        )}

        {/* Plants List */}
        <View style={styles.plantsList}>
          {records.map((rec) => {
            const plantedAt = new Date(rec.planted_at)
            const harvestDays = 60
            const estimatedHarvest = new Date(plantedAt.getTime() + harvestDays * 24 * 60 * 60 * 1000)
            const now = new Date()
            const elapsedDays = Math.max(0, Math.floor((now.getTime() - plantedAt.getTime()) / (24 * 60 * 60 * 1000)))
            const progress = Math.min(1, elapsedDays / harvestDays)
            const formatDate = (d: Date) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
            const plant = {
              id: rec.id,
              name: rec.plant_name,
              image: getPlantImage(rec.plant_name),
              harvestDays,
              progress,
              plantDate: formatDate(plantedAt),
              estimatedHarvestDate: formatDate(estimatedHarvest),
              quantity: rec.quantity,
            }

            return (
            <View key={plant.id} style={styles.plantCard}>
              {/* Plant Header */}
              <View style={styles.plantHeader}>
                <View style={styles.plantInfo}>
                  <Image source={plant.image} style={styles.plantImage} />
                  <View style={styles.plantDetails}>
                    <Text style={styles.plantName}>{plant.name}</Text>
                    <Text style={styles.harvestInfo}>Cantidad: <Text style={styles.harvestDays}>{plant.quantity}</Text></Text>
                    <Text style={styles.harvestInfo}>Cosecha en <Text style={styles.harvestDays}>{plant.harvestDays} días</Text></Text>
                  </View>
                </View>
                
                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEdit(plant.id)}
                  >
                  <Pencil size={18} color="#111827" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(plant.id)}
                  >
                  <Trash size={18} color="#111827" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Progress Bar */}
              {renderProgressBar(plant.progress)}

              {/* Dates */}
              <View style={styles.datesContainer}>
                <View style={styles.dateItem}>
                  <Text style={styles.dateLabel}>Fecha de Siembra</Text>
                  <Text style={styles.dateValue}>{plant.plantDate}</Text>
                </View>
                <View style={styles.dateItem}>
                  <Text style={styles.dateLabel}>Cosecha Estimada</Text>
                  <Text style={styles.dateValue}>{plant.estimatedHarvestDate}</Text>
                </View>
              </View>
            </View>
          )})}
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
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 18,
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
  plantsList: {
    marginBottom: 20,
  },
  plantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  plantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  plantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  plantImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  plantDetails: {
    flex: 1,
  },
  plantName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  harvestInfo: {
    fontSize: 14,
    color: '#6B7280',
  },
  harvestDays: {
    color: '#10B981',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  }
});