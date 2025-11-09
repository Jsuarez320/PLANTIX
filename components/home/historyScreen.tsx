import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Plant {
  id: string;
  name: string;
  image: any;
  harvestDays: number;
  progress: number;
  plantDate: string;
  estimatedHarvestDate: string;
}

const plants: Plant[] = [
  {
    id: '1',
    name: 'Lechuga',
    image: require('../../assets/img/plant.png'),
    harvestDays: 45,
    progress: 0.6, // 60% progress
    plantDate: '14/07/2025',
    estimatedHarvestDate: '12/09/2025',
  },
  {
    id: '2',
    name: 'Frijol',
    image: require('../../assets/img/plant.png'),
    harvestDays: 60,
    progress: 0.4, // 40% progress
    plantDate: '29/06/2025',
    estimatedHarvestDate: '27/09/2025',
  },
  {
    id: '3',
    name: 'Tomate',
    image: require('../../assets/img/plant.png'),
    harvestDays: 70,
    progress: 0.1, // 10% progress
    plantDate: '24/07/2025',
    estimatedHarvestDate: '07/10/2025',
  },
];

export default function HistoryScreen() {
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

        {/* Plants List */}
        <View style={styles.plantsList}>
          {plants.map((plant) => (
            <View key={plant.id} style={styles.plantCard}>
              {/* Plant Header */}
              <View style={styles.plantHeader}>
                <View style={styles.plantInfo}>
                  <Image source={plant.image} style={styles.plantImage} />
                  <View style={styles.plantDetails}>
                    <Text style={styles.plantName}>{plant.name}</Text>
                    <Text style={styles.harvestInfo}>
                      Cosecha en <Text style={styles.harvestDays}>{plant.harvestDays} días</Text>
                    </Text>
                  </View>
                </View>
                
                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEdit(plant.id)}
                  >
                    <Text style={styles.actionButtonText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(plant.id)}
                  >
                    <Text style={styles.actionButtonText}>🗑️</Text>
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
          ))}
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
  },
});