import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text, StyleSheet, ScrollView } from 'react-native'

export default function CareScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Cuidado</Text>
        <Text style={styles.subtitle}>Explora como puedes cuidar tus plantas</Text>

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

        <Text style={styles.sectionTitle}>Instalación del cultivo en casa</Text>
        <View style={styles.videoCard}>
          <View style={styles.videoPlaceholder}>
            <View style={styles.playCircle}>
              <View style={styles.playTriangle} />
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
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
  title: {
    marginTop: 12,
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    color: '#6B7280',
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
  videoCard: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  videoPlaceholder: {
    height: 220,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: '#fff',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 4,
  },
  progressTrack: {
    marginTop: 12,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  progressFill: {
    width: '55%',
    height: 8,
    borderRadius: 8,
    backgroundColor: '#EF4444',
  },
})