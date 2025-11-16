import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, TouchableWithoutFeedback, Keyboard } from "react-native";
import { supabase } from "../../lib/supabase";
const googleIcon = require("../../assets/img/google.png")

type Props = { onLogin?: () => void, onRegistered?: () => void }

export default function Register({ onLogin, onRegistered }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

    // Verificacion
    const handleRegister = async () => {
        if (!name || !email || !password || !confirm){
            Alert.alert('Campos Requeridos', 'Por favor completa todos los cuadros')
            return
        }
        if (password !== confirm){
            Alert.alert('Contraseñas Distintas', 'La confirmacion no coincide')
            return
        }
        try{
            setLoading(true)
            const redirectTo = process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { name }, emailRedirectTo: redirectTo }, 
            })
            if (error) throw error 
            // Mostrar alerta y redirigir al cerrar
            Alert.alert(
              'Registro Enviado',
              'Revisa tu correo para confirmar la cuenta',
              [
                { text: 'Cerrar', onPress: () => onRegistered?.() },
              ],
              { cancelable: false }
            )
        } catch (err: any) {
            Alert.alert('Error', err.message || 'No se pudo registar')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogle = async() => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.signInWithOAuth({ provider : 'google' })
            if (error) throw error
        } catch (err: any) {
            Alert.alert('Google Auth', err.message || 'Configura deep links para movil')
        } finally {
            setLoading(false)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
            <Text style={styles.tittle}>Registarse</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
            />
            
            <TextInput 
                style={styles.input}
                placeholder="email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TextInput 
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Continuar</Text>
                )}
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
    googleButton:{
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#e1e5ea',
    },
    googleIcon: {
        width: 24,
        height: 24,
        marginRight: 24,
    },
    googleText: {
        fontWeight: '600',
        fontSize: 14,
        color: '#000',
    },
})