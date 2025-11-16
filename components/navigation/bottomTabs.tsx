import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { House, Plus, Tractor, UserRound, Fence } from 'lucide-react-native'

// Import screens
import HomeScreen from '../home/homeScreen';
import AddPlantScreen from '../home/addPlantScreen';
import HistoryScreen from '../home/historyScreen';
import HarvestScreen from '../home/harvestScreen';
import ProfileScreen from '../home/profileScreen';

type MenuKey = 'home' | 'profile' | 'add' | 'history' | 'harvest'

interface BottomTabsProps {
  sessionEmail?: string | null;
}

export default function BottomTabs({ sessionEmail }: BottomTabsProps) {
  const [selected, setSelected] = useState<MenuKey>('home')
  const insets = useSafeAreaInsets()

  React.useEffect(() => {
    ;(globalThis as any).__setBottomTab = (key: MenuKey) => setSelected(key)
    return () => {
      if ((globalThis as any).__setBottomTab) {
        ;(globalThis as any).__setBottomTab = undefined
      }
    }
  }, [])

  const renderContent = () => {
    switch (selected) {
      case 'home':
        return <HomeScreen email={sessionEmail} />
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

  const TabButton = ({ label, Icon, isActive, onPress }: { label: string; Icon: React.ElementType; isActive?: boolean; onPress?: () => void }) => (
    <Pressable style={styles.tabButton} onPress={onPress}>
      <Icon color={isActive ? '#2ECC71' : '#9CA3AF'} size={22} strokeWidth={2} />
      <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  )

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.content}>{renderContent()}</View>

        {(() => {
          const bottomPadding = Math.max(insets.bottom, 12)
          return (
            <View style={[styles.bottomBar, { paddingBottom: bottomPadding }]}>
              <View style={styles.tabGroup}>
                <TabButton label="Home" Icon={House} isActive={selected === 'home'} onPress={() => setSelected('home')} />
                <TabButton label="Huerto" Icon={Fence} isActive={selected === 'history'} onPress={() => setSelected('history')} />                
              </View>

              <View style={styles.tabGroup}>
                <TabButton label="Cosecha" Icon={Tractor} isActive={selected === 'harvest'} onPress={() => setSelected('harvest')} />
                <TabButton label="Perfil" Icon={UserRound} isActive={selected === 'profile'} onPress={() => setSelected('profile')} />
              </View>
            </View>
          )
        })()}

        {(() => {
          return (
            <Pressable
              style={[styles.fab, { bottom: insets.bottom + (Platform.OS === 'ios' ? 16 : 32)}]}
              onPress={() => setSelected('add')}
              android_ripple={{ color: '#111827' }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Plus color="#FFFFFF" size={28} strokeWidth={3} />
            </Pressable>
          )
        })()}
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
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E7EB',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    height: 64,
    ...Platform.select({
      ios: {
        paddingBottom: 20, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  tabGroup: {
    top: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  tabLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#2e3eccff',
  },
  fab: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#000000',
    alignSelf: 'center',
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});