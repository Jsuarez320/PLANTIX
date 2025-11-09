import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {
    onSkip?: () => void
    onContinue?: () => void
}

export default function addplant({ onSkip, onContinue }: Props) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topRow}>
                <TouchableOpacity style={styles.skipButton} onPress={() => onSkip?.()}>
                    <Text style={styles.skipText}>Saltar</Text>
                </TouchableOpacity>
                <View style={styles.progressRow}>
                    <View style={[styles.dot, styles.dotActive]} />
                    <View style={[styles.dot, styles.dotActive]} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Agrega tu cultivo</Text>

                <View style={styles.row}>
                    <Image source={require("../../assets/img/onboarding/task.png")} style={styles.icon} />
                    <Text style={styles.paragraph}>Registra tu planta en la app.</Text>
                </View>

                <View style={styles.row}>
                    <Image source={require("../../assets/img/onboarding/calendar.png")} style={styles.icon} />
                    <Text style={styles.paragraph}>Te mostraremos el tiempo estimado y los cuidados básicos que necesita.</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={() => onContinue?.()}>
                <Text style={styles.continueButtonText}>Continuar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', 
        padding: 30,
    },
    topRow: {
        marginTop: 30,
        marginBottom: 70,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    skipButton: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e1e5ea',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    skipText: {
        fontWeight: '700',
        color: '#000',
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 1,
    },
    dot: {
        width: 28,
        height: 4,
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
        marginLeft: 8,
    },
    dotActive: {
        backgroundColor: '#111827',
    },
    content: {
        justifyContent: 'center',
    },
    title: {
        paddingTop: 10,
        paddingBottom: 40,
        fontSize: 40,
        fontWeight: '800',
    },
    paragraph: {
        fontSize: 19,
        fontFamily: "Poppins-Regular",
        flexShrink: 1,
        color: '#111827',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 6,
    },
    continueButton: {
        marginTop: 60,
        marginBottom: 30,
        backgroundColor: '#000',
        borderRadius: 30,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
    },
    continueButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 18,
    },
})