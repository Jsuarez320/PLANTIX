import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { supabase } from '../../lib/supabase'
import { Eye, EyeOff } from 'lucide-react-native'

type Props = { onRegister?: () => void }

export default function Login({ onRegister }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleContinue = async () => {
    if (!email || !password) {
      Alert.alert('Campos requeridos', 'Por favor ingresa email y contraseña')
      return
    }
    try {
      setLoading(true)
      if (isRegister) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        Alert.alert('Registro exitoso', 'Revisa tu correo para confirmar la cuenta')
        setIsRegister(false)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo procesar la solicitud')
    } finally {
      setLoading(false)
    }
  }


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.inputWrap}>
        <TextInput
          style={styles.inputInner}
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(v => !v)}>
          {showPassword ? (
            <EyeOff size={18} color="#6B7280" />
          ) : (
            <Eye size={18} color="#6B7280" />
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleContinue} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continuar</Text>
        )}
      </TouchableOpacity>

      <View style={styles.registerRow}>
        <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => onRegister?.()}>
          <Text style={styles.registerLink}>Registrarse</Text>
        </TouchableOpacity>
      </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 30,
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 30,
    },
    title: {
        fontSize: 35,
        fontWeight: '700',
        marginBottom: 24,
        textAlign: 'center',
    },
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#EDF2F7',
  },
  inputWrap: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#EDF2F7',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputInner: {
    flex: 1,
    color: '#111827',
  },
  eyeButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
    button: {
        height: 55,
        borderRadius: 24,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 18,
    },
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    registerText: {
        color: '#4A5568',
    },
    registerLink: {
        color: '#1A202C',
        fontWeight: '600',
    },
})