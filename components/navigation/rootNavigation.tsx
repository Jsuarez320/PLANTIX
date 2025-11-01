import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import WelcomeScreen from '../onboarding/welcomeScreen'
import Register from '../auth/register'
import Login from '../auth/login'
import SelectPlant from '../onboarding/selectPlant'
import AddPlant from '../onboarding/addplant'
import NotificationsInfo from '../onboarding/notificationsInfo'
import HarvestInfo from '../onboarding/harvestInfo'
import BottomTabs from './bottomTabs'


export type RootStackParamList = {
  welcome: undefined
  register: undefined
  login: undefined
  selectPlant: undefined
  addPlant: undefined
  notificationsInfo: undefined
  harvestInfo: undefined
  home: undefined
}

export const navigationRef = createNavigationContainerRef<RootStackParamList>()
const Stack = createNativeStackNavigator<RootStackParamList>()

type Props = {
  initialRouteName?: keyof RootStackParamList
  onReady?: () => void
  sessionEmail?: string | null | undefined
}

export default function RootNavigation({ initialRouteName = 'welcome', onReady, sessionEmail }: Props) {
  return (
    <NavigationContainer ref={navigationRef} onReady={onReady}>
      <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false, animation: 'none' }}>
        <Stack.Screen name="welcome">
          {() => (
            <View style={styles.container}>
              <WelcomeScreen onStart={() => navigationRef.navigate('register')} onLogin={() => navigationRef.navigate('login')} />
              <StatusBar style="auto" />
            </View>
          )}
        </Stack.Screen>

        <Stack.Screen name="register">
          {() => (
            <View style={styles.container}>
              <Register onLogin={() => navigationRef.navigate('login')} onRegistered={() => navigationRef.navigate('login')} />
              <StatusBar style="auto" />
            </View>
          )}
        </Stack.Screen>

        <Stack.Screen name="login">
          {() => (
            <View style={styles.container}>
              <Login onRegister={() => navigationRef.navigate('register')} />
              <StatusBar style="auto" />
            </View>
          )}
        </Stack.Screen>

        <Stack.Screen name="selectPlant">
          {() => (
            <View style={styles.container}>
              <SelectPlant onSkip={() => navigationRef.navigate('home')} onContinue={() => navigationRef.navigate('addPlant')} />
              <StatusBar style="auto" />
            </View>
          )}
        </Stack.Screen>

        <Stack.Screen name="addPlant">
          {() => (
            <View style={styles.container}>
              <AddPlant onSkip={() => navigationRef.navigate('home')} onContinue={() => navigationRef.navigate('notificationsInfo')} />
              <StatusBar style="auto" />
            </View>
          )}
        </Stack.Screen>

        <Stack.Screen name="notificationsInfo">
          {() => (
            <View style={styles.container}>
              <NotificationsInfo onSkip={() => navigationRef.navigate('home')} onContinue={() => navigationRef.navigate('harvestInfo')} />
              <StatusBar style="auto" />
            </View>
          )}
        </Stack.Screen>

        <Stack.Screen name="harvestInfo">
          {() => (
            <View style={styles.container}>
              <HarvestInfo onSkip={() => navigationRef.navigate('home')} onContinue={() => navigationRef.navigate('home')} />
              <StatusBar style="auto" />
            </View>
          )}
        </Stack.Screen>

        <Stack.Screen name="home">
          {() => (
            <View style={styles.container}>
              <BottomTabs sessionEmail={sessionEmail} />
              <StatusBar style="auto" />
            </View>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})