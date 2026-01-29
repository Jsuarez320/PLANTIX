import React, { useState } from 'react'
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'

type Props = {
  visible: boolean
  plantName?: string
  onCancel: () => void
  onConfirm: (payload: { quantity: number; description?: string }) => void
}

export default function PlantDetailsModal({ visible, plantName, onCancel, onConfirm }: Props) {
  const [quantityText, setQuantityText] = useState('')
  const [description, setDescription] = useState('')

  const handleConfirm = () => {
    const q = parseInt(quantityText, 10)
    const quantity = Number.isNaN(q) ? 0 : q
    onConfirm({ quantity, description: description.trim() || undefined })
    setQuantityText('')
    setDescription('')
  }

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.overlay}>
          <View style={styles.card}>
          <Text style={styles.title}>Detalles de Siembra</Text>
          <Text style={styles.subtitle}>Estás agregando: <Text style={styles.plantName}>{plantName ?? '–'}</Text></Text>

          <View style={{ height: 8 }} />

          <Text style={styles.label}>Cantidad de plantas</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 5"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={quantityText}
            onChangeText={setQuantityText}
          />

          <View style={{ height: 12 }} />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  plantName: {
    color: '#111827',
    fontWeight: '700',
  },
  label: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#111827',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cancelText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#000000',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
})