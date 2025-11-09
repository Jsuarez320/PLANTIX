import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { supabase } from '../../lib/supabase'

type Props = {
  email?: string | null
}

export default function HomeScreen({ email }: Props) {
  const [displayName, setDisplayName] = React.useState<string>('Usuario')

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
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <Text style={styles.greeting}>Hola {displayName}!</Text>
          <Text style={styles.subtitle}>Explora tus plantas y su estado actual</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen</Text>
          <Text style={styles.summaryLine}>Plantas Registradas: <Text style={styles.bold}>5</Text></Text>
          <Text style={styles.summaryLine}>Has cuidado tus plantas durante <Text style={styles.bold}>10</Text> días seguidos</Text>
        </View>

        <Text style={styles.sectionTitle}>Recordatorios</Text>
        <View style={styles.listItem}>
          <Text style={styles.itemIcon}>☀️</Text>
          <Text style={styles.itemText}>Tu lechuga necesita luz solar directa hoy.</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.itemIcon}>💧</Text>
          <Text style={styles.itemText}>Recuerda regar tu tomate en 3 horas.</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.itemIcon}>🌱</Text>
          <Text style={styles.itemText}>Es momento de abonar tus frijoles.</Text>
        </View>

        <Text style={styles.sectionTitle}>Tip del día</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>Riega en las mañanas para evitar evaporación rápida del agua.</Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 24,
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