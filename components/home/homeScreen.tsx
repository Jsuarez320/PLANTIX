import React from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { supabase } from '../../lib/supabase'

type Props = {
  email?: string | null
}

export default function HomeScreen({ email }: Props) {
  const [displayName, setDisplayName] = React.useState<string>('Usuario')
  const [plantsCount, setPlantsCount] = React.useState<number>(0)
  const [recentPlantings, setRecentPlantings] = React.useState<{ plant_name: string; quantity: number }[]>([])
  const [streakDays, setStreakDays] = React.useState<number>(0)
  const insets = useSafeAreaInsets()
  const dailyReminders = React.useMemo(() => {
    const items = [
      { icon: '🔍', text: 'Observa las raíces (deben ser blancas o ligeramente beige, no marrones).' },
      { icon: '🛠️', text: 'Verifica que la bomba y el sistema de riego funcionen bien (sin obstrucciones).' },
      { icon: '🍂', text: 'Retira hojas amarillas o secas.' },
      { icon: '💦', text: 'Mira el flujo del agua en todas las torres: asegúrate de que cada planta reciba riego.' },
    ]
    const count = Math.min(3, items.length)
    const start = new Date().getDate() % items.length
    return Array.from({ length: count }).map((_, i) => items[(start + i) % items.length])
  }, [])

  const weeklyTip = React.useMemo(() => {
    const items = [
      { text: 'Cambia la solución cada 7–14 días o antes si notas olores, turbidez o residuos.' },
      { text: 'Usa agua limpia y sin cloro (puedes dejar reposar el agua del grifo 24 h).' },
      { text: 'Revisa que el nivel de agua del tanque no baje mucho, ya que la bomba puede trabajar en seco.' },
    ]
    const intervalDays = 7
    const idx = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24 * intervalDays)) % items.length
    return items[idx]
  }, [])

  React.useEffect(() => {
    const getUserName = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.user_metadata?.name) {
          setDisplayName(user.user_metadata.name)
        } else if (email) {
          // Fallback: usar el email si no hay nombre
          const local = email.split('@')[0]
          setDisplayName(local.charAt(0).toUpperCase() + local.slice(1))
        }
        if (user) {
          const { count } = await supabase
            .from('plantings')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
          setPlantsCount(typeof count === 'number' ? count : 0)

          const { data } = await supabase
            .from('plantings')
            .select('plant_name, quantity')
            .order('planted_at', { ascending: false })
            .limit(3)
          setRecentPlantings(Array.isArray(data) ? data as any : [])

          const { data: plantDates } = await supabase
            .from('plantings')
            .select('planted_at')
            .order('planted_at', { ascending: false })
            .limit(120)
          const { data: harvestDates } = await supabase
            .from('harvests')
            .select('harvested_at')
            .order('harvested_at', { ascending: false })
            .limit(120)
          const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
          const days = new Set<string>()
          ;(plantDates || []).forEach((p: any) => {
            const d = new Date(p.planted_at)
            d.setHours(0, 0, 0, 0)
            days.add(dayKey(d))
          })
          ;(harvestDates || []).forEach((h: any) => {
            const d = new Date(h.harvested_at)
            d.setHours(0, 0, 0, 0)
            days.add(dayKey(d))
          })
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          let streak = 0
          for (let i = 0; i < 365; i++) {
            const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
            const k = dayKey(d)
            if (days.has(k)) streak++
            else break
          }
          setStreakDays(streak)
        }
      } catch (error) {
        console.error('Error obteniendo nombre de usuario:', error)
        // Fallback: usar el email si hay error
        if (email) {
          const local = email.split('@')[0]
          setDisplayName(local.charAt(0).toUpperCase() + local.slice(1))
        }
      }
    }
    getUserName()
  }, [email])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(insets.bottom, 12) + 64 + 24 }]}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.headerRow}>
          <Text style={styles.greeting}>Hola {displayName}!</Text>
          <Text style={styles.subtitle}>Explora tus plantas y su estado actual</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen</Text>
          <Text style={styles.summaryLine}>Plantas Registradas: <Text style={styles.bold}>{plantsCount}</Text></Text>
          <Text style={styles.summaryLine}>Has cuidado tus plantas durante <Text style={styles.bold}>{streakDays}</Text> días seguidos</Text>
        </View>

        <Text style={styles.sectionTitle}>Recordatorios</Text>
        {dailyReminders.map((r, idx) => (
          <View key={idx} style={styles.listItem}>
            <Text style={styles.itemIcon}>{r.icon}</Text>
            <Text style={styles.itemText}>{r.text}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Tip del día</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>{weeklyTip.text}</Text>
        </View>

        <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scroll: {
    paddingHorizontal: 16,
  },
  headerRow: {
    paddingBottom: 8,
  },
  greeting: {
    marginTop: 12,
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 4,
    color: '#6B7280',
  },
  summaryCard: {
    marginTop: 16,
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  summaryTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    marginBottom: 8,
  },
  summaryLine: {
    color: '#fff',
    marginTop: 6,
  },
  bold: {
    fontWeight: '700',
  },
  sectionTitle: {
    marginTop: 24,
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  listItem: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  itemIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  itemText: {
    flex: 1,
    color: '#111827',
  },
  tipCard: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  tipText: {
    color: '#111827',
    lineHeight: 22,
  },
})