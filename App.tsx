import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { supabase } from './lib/supabase'
import RootNavigation, { navigationRef } from './components/navigation/rootNavigation'

// La navegación principal vive ahora en navigation/rootNavigation.tsx

export default function App() {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session'] | null>(null)
  const [navReady, setNavReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.warn('Error getting session:', error.message)
          // Si hay error de refresh token, limpiamos la sesión
          if (error.message.includes('Invalid Refresh Token') || error.message.includes('Refresh Token Not Found')) {
            await supabase.auth.signOut()
          }
          setSession(null)
        } else {
          setSession(data.session)
          // Si hay sesión, intentamos ir al tutorial cuando el nav esté listo
          if (data.session && navigationRef.isReady()) {
            navigationRef.navigate('selectPlant')
          }
        }
      } catch (err) {
        console.warn('Error initializing auth:', err)
        setSession(null)
      } finally {
        setLoading(false)
      }
    }
    init()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (!navigationRef.isReady()) return
      navigationRef.navigate(newSession ? 'selectPlant' : 'welcome')
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    // Cuando el nav esté listo, si ya hay sesión, navega al tutorial
    if (navReady && session) {
      navigationRef.navigate('selectPlant')
    }
  }, [navReady])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <StatusBar style="auto" />
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <RootNavigation
        initialRouteName={session ? 'selectPlant' : 'welcome'}
        onReady={() => setNavReady(true)}
        sessionEmail={session?.user?.email}
      />
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
})
