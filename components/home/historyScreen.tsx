import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { Trash } from 'lucide-react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase'
// Edit UI removida

type PlantingRecord = {
  id: string
  plant_name: string
  quantity: number
  description?: string | null
  planted_at: string
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets()
  const [records, setRecords] = useState<PlantingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  // Estado de edición removido

  // Actualiza el "día del sistema" para recalcular progreso de cosecha
  const [nowMidnightMs, setNowMidnightMs] = useState<number>(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d.getTime()
  })

  // Mapa de nombres de plantas a imágenes locales
  const plantImages: Record<string, any> = {
    'lechuga': require('../../assets/img/addPlant/lettuce.png'),
    'zanahoria': require('../../assets/img/addPlant/carrot.png'),
    'fresas': require('../../assets/img/addPlant/strawberry.png'),
    'acelga': require('../../assets/img/addPlant/spinach.png'),
    'pimientos pequeños': require('../../assets/img/addPlant/smallPeppers.png'),
    'menta': require('../../assets/img/addPlant/mint.png'),
  }

  // Días de cosecha por planta (valores aproximados)
  const harvestDaysByPlant: Record<string, number> = {
    'lechuga': 45,
    'zanahoria': 75,
    'fresas': 90,
    'acelga': 50,
    'pimientos pequeños': 80,
    'menta': 30,
  }

  const getPlantImage = (name?: string) => {
    const key = (name || '').toLowerCase().trim()
    return plantImages[key] ?? require('../../assets/img/plant.png')
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setErrorMsg(null)
      // Usa getSession y maneja errores de refresh token inválido
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        // Si el refresh token es inválido, cierra sesión para limpiar estado
        if (sessionError.message?.toLowerCase().includes('refresh token')) {
          await supabase.auth.signOut()
        }
      }
      const userId = sessionData?.session?.user?.id
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

  // Mantén sincronizado el estado ante cambios de autenticación
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      // Si el usuario cambia (login/logout), recarga o limpia registros
      if (!session?.user) {
        setRecords([])
      }
    })
    return () => {
      listener.subscription?.unsubscribe?.()
    }
  }, [])

  // Ticker: re-evalúa el día actual (a medianoche cambia automáticamente)
  useEffect(() => {
    const updateNow = () => {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      setNowMidnightMs(d.getTime())
    }
    updateNow()
    // cada hora es suficiente; al pasar la medianoche, se actualizará
    const id = setInterval(updateNow, 60 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  // Handler de edición removido

  const handleDelete = (plantId: string) => {
    const rec = records.find(r => r.id === plantId)
    const plantName = rec?.plant_name ?? 'esta siembra'
    Alert.alert(
      'Eliminar siembra',
      `¿Seguro que deseas eliminar ${plantName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('plantings')
              .delete()
              .eq('id', plantId)
            if (error) {
              Alert.alert('Error', error.message)
              return
            }
            setRecords(prev => prev.filter(r => r.id !== plantId))
          },
        },
      ]
    )
  }

  // Confirmación de edición removida (RLS no permite UPDATE)

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

  const readyRecords = records.filter((rec) => {
    const plantedAt = new Date(rec.planted_at)
    const key = (rec.plant_name || '').toLowerCase().trim()
    const harvestDays = harvestDaysByPlant[key] ?? 60
    const msPerDay = 24 * 60 * 60 * 1000
    const plantedMidnight = new Date(plantedAt)
    plantedMidnight.setHours(0, 0, 0, 0)
    const elapsedDays = Math.max(0, Math.floor((nowMidnightMs - plantedMidnight.getTime()) / msPerDay))
    return elapsedDays >= harvestDays
  })

  const ongoingRecords = records.filter((rec) => !readyRecords.some(r => r.id === rec.id))

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 12) + 64 + 24 }}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tu Huerto</Text>
          <Text style={styles.subtitle}>
            Sigue el progreso de siembra y cosecha de tus plantas.
          </Text>
        </View>

        {readyRecords.length > 0 && (
          <View style={styles.readySection}>
            <Text style={styles.readyTitle}>Listo para Cosechar</Text>
            {readyRecords.slice(0, 5).map((r) => (
              <View key={r.id} style={styles.readyCard}>
                <View style={styles.readyAccent} />
                <Image source={getPlantImage(r.plant_name)} style={styles.readyImage} />
                <View style={styles.readyInfo}>
                  <Text style={styles.readyName}>{r.plant_name}</Text>
                  <Text style={styles.readyQty}>Cantidad: <Text style={styles.readyQtyValue}>{r.quantity}</Text></Text>
                  <Text style={styles.readyStatus}>¡Cosecha lista!</Text>
                </View>
                <TouchableOpacity
                  style={styles.readyButton}
                  onPress={() => {
                    ;(globalThis as any).__openHarvestRegister = { plantingId: r.id, cropName: r.plant_name, maxPlantsAvailable: r.quantity }
                    const setTab = (globalThis as any).__setBottomTab as ((k: any) => void) | undefined
                    setTab?.('harvest')
                  }}
                >
                  <Text style={styles.readyButtonText}>Registrar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {ongoingRecords.length > 0 && (
          <Text style={styles.progressTitle}>En Progreso</Text>
        )}

        {loading && (
          <Text style={{ color: '#6B7280', textAlign: 'center' }}>Cargando...</Text>
        )}
        {!loading && records.length === 0 && (
          <Text style={{ color: '#6B7280', textAlign: 'center' }}>No, tienes plantas en tu huerto.</Text>
        )}

        <View style={styles.plantsList}>
          {ongoingRecords.map((rec) => {
            const plantedAt = new Date(rec.planted_at)
            const key = (rec.plant_name || '').toLowerCase().trim()
            const harvestDays = harvestDaysByPlant[key] ?? 60
            const msPerDay = 24 * 60 * 60 * 1000
            const plantedMidnight = new Date(plantedAt)
            plantedMidnight.setHours(0, 0, 0, 0)
            const estimatedHarvest = new Date(plantedMidnight.getTime() + harvestDays * msPerDay)
            const elapsedDays = Math.max(0, Math.floor((nowMidnightMs - plantedMidnight.getTime()) / msPerDay))
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
                
                {/* Botones de acción: solo eliminar */}
                <View style={styles.actionButtons}>
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
    </TouchableWithoutFeedback>
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
  progressTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 10,
    marginBottom: 12,
  },
  readySection: {
    marginBottom: 16,
  },
  readyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  readyCard: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  readyAccent: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 6,
    backgroundColor: '#10B981',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  readyImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  readyInfo: {
    flex: 1,
  },
  readyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  readyQty: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  readyQtyValue: {
    color: '#111827',
    fontWeight: '600',
  },
  readyStatus: {
    marginTop: 6,
    fontSize: 14,
    color: '#10B981',
    fontWeight: '700',
  },
  readyButton: {
    backgroundColor: '#10B981',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  readyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
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