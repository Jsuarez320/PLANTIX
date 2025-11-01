import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HarvestData {
  name: string;
  value: number;
  color: string;
}

const harvestData: HarvestData[] = [
  { name: 'Lechuga', value: 25, color: '#10B981' },
  { name: 'Frijol', value: 45, color: '#F59E0B' },
  { name: 'Tomate', value: 20, color: '#EF4444' },
  { name: 'Zanahoria', value: 20, color: '#F97316' },
];

const { width } = Dimensions.get('window');
const chartWidth = width - 80; // Accounting for padding
const maxValue = Math.max(...harvestData.map(item => item.value));

export default function HarvestScreen() {
  const totalHarvested = harvestData.reduce((sum, item) => sum + item.value, 0);
  const mostProductiveCrop = harvestData.reduce((prev, current) => 
    prev.value > current.value ? prev : current
  );

  const handleRegisterNewHarvest = () => {
    console.log('Register new harvest');
  };

  const renderBarChart = () => {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Producción por Cultivo (kg)</Text>
        
        <View style={styles.chart}>
          <View style={styles.barsContainer}>
            {harvestData.map((item, index) => {
              const barHeight = (item.value / maxValue) * 200; // Max height 200
              return (
                <View key={index} style={styles.barWrapper}>
                  <View style={styles.barContainer}>
                    <View 
                      style={[
                        styles.bar, 
                        { 
                          height: barHeight, 
                          backgroundColor: item.color 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.barLabel}>{item.name}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Registro de Cosecha</Text>
          <Text style={styles.subtitle}>
            Visualiza y analiza los resultados de tus cosechas.
          </Text>
        </View>

        {/* Register New Harvest Button */}
        <TouchableOpacity 
          style={styles.registerButton}
          onPress={handleRegisterNewHarvest}
        >
          <Text style={styles.registerButtonText}>Registrar Nueva Cosecha</Text>
        </TouchableOpacity>

        {/* Bar Chart */}
        {renderBarChart()}

        {/* Statistics */}
        <View style={styles.statisticsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Cosechado</Text>
            <Text style={styles.statValue}>{totalHarvested} kg</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Cultivo más productivo</Text>
            <Text style={styles.statValue}>{mostProductiveCrop.name}</Text>
          </View>
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
  registerButton: {
    backgroundColor: '#000000',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
  },
  chart: {
    alignItems: 'center',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    width: '100%',
    height: 240,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 200,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
  },
  bar: {
    width: 40,
    borderRadius: 4,
    minHeight: 10,
  },
  barLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  statisticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 8,
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
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
});