import React from "react"
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

// Recibe callbacks en lugar de usar expo-router
type Props = {
  onStart?: () => void
  onLogin?: () => void
}

export default function WelcomeScreen({ onStart, onLogin }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/img/plant.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Seguimiento para tus</Text>
      <Text style={styles.title}>Cultivos Hidropónicos</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => onStart?.()}
      >
        <Text style={styles.buttonText}>Empezar</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        ¿Ya tienes una cuenta?{" "}
        <Text style={styles.link} onPress={() => onLogin?.()}>Iniciar sesión</Text>
      </Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 30,
    marginTop: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: "#333",
  },
  link: {
    fontWeight: "bold",
  },
})