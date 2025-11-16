import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Trash } from 'lucide-react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import HarvestRegisterModal from './modal/HarvestRegisterModal';
import { supabase } from '../../lib/supabase';

type HarvestItem = {
  id: string;
  name: string;
  quantityKg: number;
  dateISO: string;
  image: any;
};

type Planting = { id: string; plant_name: string };

// Datos de ejemplo eliminados; el listado inicia vacío

const cropImages: Record<string, any> = {
  'lechuga': require('../../assets/img/addPlant/lettuce.png'),
  'zanahoria': require('../../assets/img/addPlant/carrot.png'),
  'fresas': require('../../assets/img/addPlant/strawberry.png'),
  'acelga': require('../../assets/img/addPlant/spinach.png'),
  'pimientos pequeños': require('../../assets/img/addPlant/smallPeppers.png'),
  'menta': require('../../assets/img/addPlant/mint.png'),
}

const getCropImage = (name?: string) => {
  const key = (name || '').toLowerCase().trim()
  return cropImages[key] ?? require('../../assets/img/plant.png')
}

const monthNamesEs = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
const formatEsDate = (iso: string) => {
  const d = new Date(iso)
  const day = d.getDate()
  const month = monthNamesEs[d.getMonth()]
  const year = d.getFullYear()
  return `${day} de ${month} de ${year}`
}

const sumByCrop = (items: HarvestItem[]) => {
  const map: Record<string, number> = {}
  items.forEach(i => { map[i.name] = (map[i.name] ?? 0) + i.quantityKg })
  return map
}

export default function HarvestScreen() {
  const insets = useSafeAreaInsets()
  const [harvests, setHarvests] = useState<HarvestItem[]>([])
  const [registerVisible, setRegisterVisible] = useState(false)
  const [plantings, setPlantings] = useState<Planting[]>([])
  const [cropOptions, setCropOptions] = useState<string[]>([])
  const [initialCrop, setInitialCrop] = useState<string | null>(null)
  const [maxAvailable, setMaxAvailable] = useState<number | null>(null)
  const [initialPlantingId, setInitialPlantingId] = useState<string | null>(null)

  // Cargar cosechas del usuario
  const loadHarvests = async () => {
    const { data, error } = await supabase
      .from('harvests')
      .select('id, plant_name, weight_kg, harvested_at')
      .order('harvested_at', { ascending: false })

    if (error) {
      console.warn('Error cargando cosechas', error.message)
      return
    }

    const items: HarvestItem[] = (data || []).map((h: any) => {
      const id = String(h.id)
      const name = h.plant_name as string
      const quantityKg = Number(h.weight_kg) || 0
      const dateISO = new Date(h.harvested_at as string).toISOString().slice(0, 10)
      const image = getCropImage(name)
      return { id, name, quantityKg, dateISO, image }
    })

    setHarvests(items)
  }

  // Cargar siembras del usuario y preparar opciones de cultivos
  useEffect(() => {
    const loadPlantings = async () => {
      const { data, error } = await supabase
        .from('plantings')
        .select('id, plant_name')
        .order('planted_at', { ascending: false })

      if (error) {
        console.warn('Error cargando siembras', error.message)
        return
      }

      setPlantings(data || [])
      setCropOptions((data || []).map(p => p.plant_name))
    }

    loadPlantings()
    loadHarvests()
  }, [])

  const totalsByCrop = sumByCrop(harvests)
  const totalHarvested = Object.values(totalsByCrop).reduce((a,b)=>a+b,0)
  const mostProductiveEntry = Object.entries(totalsByCrop).sort((a,b)=>b[1]-a[1])[0]
  const mostProductiveCrop = mostProductiveEntry ? mostProductiveEntry[0] : '-'

  const handleRegisterNewHarvest = () => {
    setRegisterVisible(true)
  }

  React.useEffect(() => {
    const payload = (globalThis as any).__openHarvestRegister as { plantingId?: string; cropName?: string; maxPlantsAvailable?: number } | undefined
    if (payload?.cropName) {
      setInitialCrop(payload.cropName)
      if (typeof payload.maxPlantsAvailable === 'number') setMaxAvailable(payload.maxPlantsAvailable)
      if (payload.plantingId) setInitialPlantingId(payload.plantingId)
      setRegisterVisible(true)
      ;(globalThis as any).__openHarvestRegister = undefined
    }
  })

  const handleDeleteHarvest = (harvestId: string, name: string) => {
    Alert.alert(
      'Eliminar cosecha',
      `¿Seguro que deseas eliminar la cosecha de ${name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('harvests')
              .delete()
              .eq('id', harvestId)
            if (error) {
              Alert.alert('Error', error.message)
              return
            }
            setHarvests(prev => prev.filter(h => h.id !== harvestId))
          },
        },
      ]
    )
  }

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
          <Text style={styles.title}>Registro de Cosecha</Text>
          <Text style={styles.subtitle}>Visualiza y analiza los resultados de tus cosechas.</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Cosechado</Text>
            <Text style={styles.statValue}>{totalHarvested} <Text style={styles.statUnit}>kg</Text></Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Más productivo</Text>
            <Text style={styles.statValue}>{mostProductiveCrop || '-'}</Text>
          </View>
        </View>

        {/* Recent Harvests */}
        <Text style={styles.sectionTitle}>Cosechas Recientes</Text>
        <View>
          {harvests.map((h) => (
            <View key={h.id} style={styles.harvestItem}>
              <View style={styles.harvestLeft}>
                <Image source={h.image} style={styles.harvestImage} />
                <View>
                  <Text style={styles.harvestName}>{h.name}</Text>
                  <Text style={styles.harvestDate}>{formatEsDate(h.dateISO)}</Text>
                </View>
              </View>
              <View style={styles.harvestRight}>
                <Text style={styles.harvestQty}>{h.quantityKg} kg</Text>
                <TouchableOpacity style={styles.harvestDelete} activeOpacity={0.7} onPress={() => handleDeleteHarvest(h.id, h.name)}>
                  <Trash size={18} color="#111827" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        </ScrollView>
        <HarvestRegisterModal
          visible={registerVisible}
          initialCrop={initialCrop ?? undefined}
          maxPlantsAvailable={maxAvailable ?? undefined}
          cropOptions={cropOptions}
          onClose={() => setRegisterVisible(false)}
        onSave={async ({ name, quantityKg, quantityPlants, dateISO }) => {
          const byId = initialPlantingId ? plantings.find(p => p.id === initialPlantingId) : undefined
          const planting = byId ?? plantings.find(p => p.plant_name === name)
          if (!planting) {
            console.warn('No se encontró una siembra para', name)
            return
          }

          // Preparar fecha (medianoche UTC del día)
          const harvestedAt = `${dateISO}T00:00:00Z`

          // Insertar cosecha en BD
          const { error } = await supabase
            .from('harvests')
            .insert({
              planting_id: planting.id,
              plant_name: name,
              quantity_plants: Math.max(1, Math.floor(quantityPlants)),
              weight_kg: quantityKg,
              harvested_at: harvestedAt,
            })

          if (error) {
            console.warn('Error guardando cosecha', error.message)
            return
          }

          // Eliminar siembra (las cosechas permanecen por ON DELETE SET NULL)
          const { error: delError } = await supabase
            .from('plantings')
            .delete()
            .eq('id', planting.id)

          if (delError) {
            console.warn('Error eliminando siembra', delError.message)
          } else {
            setPlantings(prev => prev.filter(p => p.id !== planting.id))
          }

          // Refrescar listado desde BD para garantizar persistencia
          await loadHarvests()
          setRegisterVisible(false)
        }}
      />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' 
  },
  scrollView: { 
    flex: 1, 
    paddingHorizontal: 20 
  },
  header: { 
    marginTop: 20, 
    marginBottom: 30 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#1F2937', 
    marginBottom: 8 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#6B7280', 
    lineHeight: 24 
  },
  statsRow: { 
    flexDirection: 'row', 
    gap: 16, 
    marginBottom: 16 
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statLabel: { 
    fontSize: 14, 
    color: '#6B7280', 
    marginBottom: 8 
  },    
  statValue: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1F2937' 
  },
  statUnit: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#6B7280' 
  },
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#1F2937', 
    marginBottom: 16 
  },
  harvestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  harvestLeft: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 12 
  },
  harvestImage: { 
    width: 56, 
    height: 56, 
    borderRadius: 8 
  },
  harvestName: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#1F2937' 
  },
  harvestDate: { 
    fontSize: 12, 
    color: '#6B7280', 
    marginTop: 4 
  },
  harvestRight: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  harvestQty: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#10B981' 
  },
  harvestDelete: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
})