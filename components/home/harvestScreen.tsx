import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import HarvestRegisterModal from './modal/HarvestRegisterModal';
import { supabase } from '../../lib/supabase';

type HarvestItem = {
  name: string;
  quantityKg: number;
  dateISO: string; // YYYY-MM-DD
  image: any;
};

type Planting = { id: string; plant_name: string };

// Datos de ejemplo eliminados; el listado inicia vacío

const cropImages: Record<string, any> = {
  Tomate: require('../../assets/img/plant.png'),
  Lechuga: require('../../assets/img/addPlant/lettuce.png'),
  Frijol: require('../../assets/img/plant.png'),
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

  // Cargar cosechas del usuario
  const loadHarvests = async () => {
    const { data, error } = await supabase
      .from('harvests')
      .select('plant_name, weight_kg, harvested_at')
      .order('harvested_at', { ascending: false })

    if (error) {
      console.warn('Error cargando cosechas', error.message)
      return
    }

    const items: HarvestItem[] = (data || []).map((h: any) => {
      const name = h.plant_name as string
      const quantityKg = Number(h.weight_kg) || 0
      const dateISO = new Date(h.harvested_at as string).toISOString().slice(0, 10)
      const image = cropImages[name] || require('../../assets/img/plant.png')
      return { name, quantityKg, dateISO, image }
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

        {/* CTA Button */}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegisterNewHarvest}>
          <Text style={styles.registerButtonText}>+ Registrar Nueva Cosecha</Text>
        </TouchableOpacity>

        {/* Recent Harvests */}
        <Text style={styles.sectionTitle}>Cosechas Recientes</Text>
        <View>
          {harvests.map((h, idx) => (
            <View key={idx} style={styles.harvestItem}>
              <View style={styles.harvestLeft}>
                <Image source={h.image} style={styles.harvestImage} />
                <View>
                  <Text style={styles.harvestName}>{h.name}</Text>
                  <Text style={styles.harvestDate}>{formatEsDate(h.dateISO)}</Text>
                </View>
              </View>
              <Text style={styles.harvestQty}>{h.quantityKg} kg</Text>
            </View>
          ))}
        </View>
        </ScrollView>
        <HarvestRegisterModal
        visible={registerVisible}
        cropOptions={cropOptions}
        onClose={() => setRegisterVisible(false)}
        onSave={async ({ name, quantityKg, quantityPlants, dateISO }) => {
          // Buscar la siembra correspondiente por nombre (más reciente)
          const planting = plantings.find(p => p.plant_name === name)
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
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  header: { marginTop: 20, marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', lineHeight: 24 },

  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
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
  statLabel: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  statUnit: { fontSize: 16, fontWeight: '600', color: '#6B7280' },

  registerButton: {
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  registerButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },

  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#1F2937', marginBottom: 16 },

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
  harvestLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  harvestImage: { width: 56, height: 56, borderRadius: 8 },
  harvestName: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  harvestDate: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  harvestQty: { fontSize: 16, fontWeight: '700', color: '#10B981' },
})