import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { House, Leaf, Plus, Fence, Tractor, UserRound, LogOut, Menu, X } from 'lucide-react-native'
import { supabase } from '../../lib/supabase'

// Import screens
import HomeScreen from '../home/homeScreen';
import CareScreen from '../home/careScreen';
import AddPlantScreen from '../home/addPlantScreen';
import HistoryScreen from '../home/historyScreen';
import HarvestScreen from '../home/harvestScreen';
import ProfileScreen from '../home/profileScreen';

type MenuKey = 'home' | 'profile' | 'care' | 'add' | 'history' | 'harvest'

interface BottomTabsProps {
  sessionEmail?: string | null;
}

export default function BottomTabs({ sessionEmail }: BottomTabsProps) {
  const [selected, setSelected] = useState<MenuKey>('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const sidebarWidth = 280
  const translateX = React.useRef(new Animated.Value(sidebarWidth)).current
  const insets = useSafeAreaInsets()

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: sidebarOpen ? 0 : sidebarWidth,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [sidebarOpen])

  const menuButtonTranslateY = insets.top + 12 + (28 / 2) - (44 / 2)

  const displayName = useMemo(() => {
    if (!sessionEmail) return 'Usuario'
    const local = sessionEmail.split('@')[0]
    return local.charAt(0).toUpperCase() + local.slice(1)
  }, [sessionEmail])

  const handleMenuSelect = (key: MenuKey) => {
    setSelected(key)
    setSidebarOpen(false)
  }

  const renderContent = () => {
    switch (selected) {
      case 'home':
        return <HomeScreen email={sessionEmail} />
      case 'care':
        return <CareScreen />
      case 'add':
        return <AddPlantScreen />
      case 'history':
        return <HistoryScreen />
      case 'harvest':
        return <HarvestScreen />
      case 'profile':
        return <ProfileScreen />
      default:
        return null
    }
  }

  const MenuItem = ({ label, Icon, isActive, onPress }: { label: string; Icon: React.ElementType; isActive?: boolean; onPress?: () => void }) => (
    <TouchableOpacity style={[styles.menuItem, isActive && styles.menuItemActive]} onPress={onPress}>
      <Icon color="#6FE3FF" size={20} strokeWidth={2} />
      <Text style={styles.menuLabel}>{label}</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.content}>
          {!sidebarOpen && (
            <TouchableOpacity
              style={[
                styles.menuButton,
                {
                  transform: [
                    { translateX: 0 },
                    { translateY: menuButtonTranslateY }
                  ]
                }
              ]}
              onPress={() => setSidebarOpen(true)}
            >
              <Menu color="#000" size={24} />
            </TouchableOpacity>
          )}
          {renderContent()}
        </View>

        {sidebarOpen && (
          <TouchableOpacity 
            style={styles.overlay} 
            activeOpacity={1}
            onPress={() => setSidebarOpen(false)}
          />
        )}

        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{ translateX }],
            }
          ]}
        >
          <View style={styles.header}>
            <View style={styles.avatar}>
              <UserRound color="#1F2F95" size={24} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{displayName}</Text>
              <Text style={styles.email}>{sessionEmail ?? 'sin correo'}</Text>
            </View>
            <TouchableOpacity onPress={() => setSidebarOpen(false)}>
              <X color="#6FE3FF" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.menuSection}>
            <MenuItem label="Inicio" Icon={House} isActive={selected === 'home'} onPress={() => handleMenuSelect('home')} />
            <MenuItem label="Cuidado" Icon={Leaf} isActive={selected === 'care'} onPress={() => handleMenuSelect('care')} />
            <MenuItem label="Agregar" Icon={Plus} isActive={selected === 'add'} onPress={() => handleMenuSelect('add')} />
            <MenuItem label="Huerto" Icon={Fence} isActive={selected === 'history'} onPress={() => handleMenuSelect('history')} />
            <MenuItem label="Cosecha" Icon={Tractor} isActive={selected === 'harvest'} onPress={() => handleMenuSelect('harvest')} />
            <MenuItem label="Perfil" Icon={UserRound} isActive={selected === 'profile'} onPress={() => handleMenuSelect('profile')} />
          </ScrollView>

          <View style={styles.logoutBar}>
            <TouchableOpacity style={styles.logoutButton} onPress={() => supabase.auth.signOut()}>
              <LogOut color="#6FE3FF" size={20} />
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  menuButton: {
    position: 'absolute',
    marginTop: 12,
    right: 16,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#2633A8',
    zIndex: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomColor: '#FFFFFF22',
    borderBottomWidth: 1,
    gap: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#6FE3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  email: {
    color: '#CFE6FF',
    fontSize: 12,
    marginTop: 2,
  },
  menuSection: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 14,
  },
  menuItemActive: {
    backgroundColor: '#FFFFFF14',
    borderRadius: 10,
  },
  menuLabel: {
    color: '#E6F4FF',
    fontSize: 15,
    fontWeight: '500',
  },
  logoutBar: {
    marginTop: 'auto',
    borderTopColor: '#FFFFFF22',
    borderTopWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutText: {
    color: '#E6F4FF',
    fontSize: 15,
    fontWeight: '600',
  },
});