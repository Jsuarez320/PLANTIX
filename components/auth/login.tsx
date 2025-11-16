import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { supabase } from '../../lib/supabase'
const googleIcon = require("../../assets/img/google.png")

type Props = { onRegister?: () => void }

export default function Login({ onRegister }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)

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

  const handleGoogle = async () => {
    try {
      setLoading(true)
          const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
      if (error) throw error
    } catch (err: any) {
      Alert.alert('Google OAuth', err.message || 'Configura los deep links para móvil (AuthSession)')
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

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

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

      <View style={styles.separatorRow}>
        <View style={styles.line} />
        <View style={styles.circle} />
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogle} disabled={loading}>
        <Image style={styles.googleIcon} source={googleIcon} />
        <Text style={styles.googleText}>Continuar con Google</Text>
      </TouchableOpacity>
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
    separator: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 16,
    },
    separatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 16,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#B0B7C3',
    },
    circle: {
        width: 12,
        height: 12,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#B0B7C3',
        marginHorizontal: 12,
    },
    googleButton: {
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    googleIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    googleText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 14,
    },
})