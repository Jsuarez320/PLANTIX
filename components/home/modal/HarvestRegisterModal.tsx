import React, { useState } from 'react'
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native'

type SavePayload = { name: string; quantityKg: number; quantityPlants: number; dateISO: string; notes?: string }

type Props = {
  visible: boolean
  cropOptions: string[]
  onClose: () => void
  onSave: (payload: SavePayload) => void
}

const parseDdMmYyyyToISO = (text: string) => {
  const match = text.trim().match(/^([0-3]?[0-9])\/(0?[1-9]|1[0-2])\/(\d{4})$/)
  if (!match) return null
  const day = parseInt(match[1], 10)
  const month = parseInt(match[2], 10) - 1
  const year = parseInt(match[3], 10)
  const d = new Date(year, month, day)
  if (isNaN(d.getTime())) return null
  return d.toISOString().slice(0, 10)
}

// Formatea la entrada del usuario como dd/mm/aaaa mientras escribe
const formatDdMmYyyyInput = (raw: string) => {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0,2)}/${digits.slice(2)}`
  return `${digits.slice(0,2)}/${digits.slice(2,4)}/${digits.slice(4)}`
}

export default function HarvestRegisterModal({ visible, cropOptions, onClose, onSave }: Props) {
  const [selectOpen, setSelectOpen] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null)
  const [quantityText, setQuantityText] = useState('')
  const [quantityPlantsText, setQuantityPlantsText] = useState('')
  const [dateText, setDateText] = useState('')
  const [selectTop, setSelectTop] = useState(0)
  const [selectHeight, setSelectHeight] = useState(0)

  const reset = () => {
    setSelectOpen(false)
    setSelectedCrop(null)
    setQuantityText('')
    setQuantityPlantsText('')
    setDateText('')
  }

  const handleCancel = () => {
    reset()
    onClose()
  }

  const handleSave = () => {
    if (!selectedCrop) return
    const qty = parseFloat(quantityText)
    if (!isFinite(qty) || qty <= 0) return
    const qtyPlants = parseInt(quantityPlantsText, 10)
    if (!isFinite(qtyPlants) || qtyPlants <= 0) return
    const iso = parseDdMmYyyyToISO(dateText)
    if (!iso) return
    onSave({ name: selectedCrop, quantityKg: qty, quantityPlants: qtyPlants, dateISO: iso })
    reset()
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Registrar Cosecha</Text>

          {/* Cultivo */}
          <Text style={styles.fieldLabel}>Cultivo</Text>
          <TouchableOpacity
            style={styles.selectField}
            onPress={() => setSelectOpen(prev => !prev)}
            onLayout={(e) => {
              setSelectTop(e.nativeEvent.layout.y)
              setSelectHeight(e.nativeEvent.layout.height)
            }}
          >
            <Text style={!selectedCrop ? styles.selectPlaceholder : styles.selectValue}>
              {selectedCrop ?? 'Selecciona un cultivo'}
            </Text>
            <Text style={styles.selectChevron}>▾</Text>
          </TouchableOpacity>
          {selectOpen && (
            <View
              style={[
                styles.optionsList,
                { top: selectTop + selectHeight + 4 },
              ]}
            >
              <ScrollView style={{ maxHeight: 180 }}>
                {cropOptions.map(opt => (
                  <TouchableOpacity key={opt} style={styles.optionItem} onPress={() => { setSelectedCrop(opt); setSelectOpen(false) }}>
                    <Text style={styles.optionText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Cantidad */}
          <Text style={styles.fieldLabel}>Cantidad (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 10"
            value={quantityText}
            onChangeText={setQuantityText}
            keyboardType="numeric"
          />

          {/* Plantas cosechadas */}
          <Text style={styles.fieldLabel}>Plantas cosechadas</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 3"
            value={quantityPlantsText}
            onChangeText={setQuantityPlantsText}
            keyboardType="numeric"
          />

          {/* Fecha */}
          <Text style={styles.fieldLabel}>Fecha de Cosecha</Text>
          <TextInput
            style={styles.input}
            placeholder="dd/mm/aaaa"
            value={dateText}
            onChangeText={(t) => setDateText(formatDdMmYyyyInput(t))}
            keyboardType="numeric"
            maxLength={10}
          />



          {/* Acciones */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleSave}>
              <Text style={styles.confirmText}>Guardar</Text>
            </TouchableOpacity>
          </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackdrop: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.35)', 
    justifyContent: 'center', 
    paddingHorizontal: 20 
  },
  modalBox: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    padding: 20, 
    position: 'relative' 
  },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#1F2937', 
    marginBottom: 16 
  },
  fieldLabel: { 
    fontSize: 14, 
    color: '#374151', 
    marginBottom: 8 
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    marginBottom: 16,
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  selectPlaceholder: { 
    fontSize: 16, 
    color: '#9CA3AF' 
  },
  selectValue: { 
    fontSize: 16, 
    color: '#111827', 
    fontWeight: '500' 
  },
  selectChevron: { 
    fontSize: 18, 
    color: '#6B7280' 
  },
  optionsList: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  optionItem: { 
    paddingVertical: 10, 
    paddingHorizontal: 16,
  },
  optionText: { 
    fontSize: 16, 
    color: '#111827' 
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