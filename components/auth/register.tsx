
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { supabase } from "../../lib/supabase";
import { Eye, EyeOff } from 'lucide-react-native'

type Props = { onLogin?: () => void, onRegistered?: () => void }

export default function Register({ onLogin, onRegistered }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

    const handleRegister = async () => {
      if (!name || !email || !password || !confirm) {
        Alert.alert('Campos Requeridos', 'Por favor completa todos los cuadros')
        return
      }
      if (password !== confirm) {
        Alert.alert('Contraseñas Distintas', 'La confirmacion no coincide')
        return
      }
      try {
        setLoading(true)
        const normalizedEmail = email.trim().toLowerCase()
        const redirectTo = process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL
        const options: any = { data: { name } }
        if (redirectTo && redirectTo.includes('://')) {
          options.emailRedirectTo = redirectTo
        }
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options,
        })
        if (error) throw error

        if (!data.session) {
          Alert.alert(
            'Registro Enviado',
            'Revisa tu correo para confirmar la cuenta',
            [ { text: 'Cerrar', onPress: () => onRegistered?.() } ],
            { cancelable: false }
          )
          return
        }
        onRegistered?.()
      } catch (err: any) {
        const msg = String(err?.message || '')
        if (msg.includes('already registered')) {
          Alert.alert('Error', 'Este correo ya está registrado')
        } else {
          Alert.alert('Error', msg || 'No se pudo registrar')
        }
      } finally {
        setLoading(false)
      }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <Text style={styles.tittle}>Registarse</Text>
            <TextInput style={styles.input} placeholder="Nombre" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <View style={styles.inputWrap}>
              <TextInput style={styles.inputInner} placeholder="Password" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
              <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(v => !v)}>
                {showPassword ? (<EyeOff size={18} color="#6B7280" />) : (<Eye size={18} color="#6B7280" />)}
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirm} onChangeText={setConfirm} />
            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
              {loading ? (<ActivityIndicator color="#fff" />) : (<Text style={styles.buttonText}>Continuar</Text>)}
            </TouchableOpacity>
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>¿Ya tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => onLogin?.()}>
                <Text style={styles.registerLink}>Iniciar sesión</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.separatorRow}>
              <View style={styles.line} />
              <View style={styles.circle} />
              <View style={styles.line} />
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
    tittle: {
        fontSize: 35,
        fontWeight: '700',
        marginBottom: 24,
        textAlign: 'center',
    },
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#edeff2',
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#edeff2',
  },
  inputWrap: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#edeff2',
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#edeff2',
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
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        backgroundColor: '#000',
    },
    buttonText: {
        fontWeight: '600',
        fontSize: 18,
        color: '#fff',
    },
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    registerText:{
        color: '#000',
    },
    registerLink: {
        fontWeight: '600',
        color: '#000',
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
    backgroundColor: '#a8a8b1',
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 9,
    borderWidth: 2,
    marginHorizontal: 12,
    borderColor: '#a8a8b1',
  },
})