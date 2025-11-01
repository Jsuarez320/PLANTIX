import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

// Iconos
import { House } from 'lucide-react'

// Import screens
import HomeScreen from '../home/homeScreen';
import CareScreen from '../home/careScreen';
import AddPlantScreen from '../home/addPlantScreen';
import HistoryScreen from '../home/historyScreen';
import HarvestScreen from '../home/harvestScreen';
import ProfileScreen from '../home/profileScreen';

const Tab = createBottomTabNavigator();

interface TabIconProps {
  focused: boolean;
  icon: React.ElementType;
  label: string;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, icon: Icon, label }) => {
  return (
    <View style={styles.tabIconContainer}>
      <Icon
        color={focused ? '#10B981' : '#9CA3AF'}
        size={24}
        strokeWidth={2}
      />
      <Text style={[styles.tabLabel, { color: focused ? '#10B981' : '#9CA3AF' }]}>
        {label}
      </Text>
    </View>
  );
};

interface BottomTabsProps {
  sessionEmail?: string | null;
}

export default function BottomTabs({ sessionEmail }: BottomTabsProps) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
    <Tab.Screen
        name="Home"
        options={{
            tabBarIcon: ({ focused }) => (
                <TabIcon focused={focused} icon={House} label="Home" />
            ),
        }}>
        {() => <HomeScreen email={sessionEmail} />}
    </Tab.Screen>

    <Tab.Screen
    name="Cuidado"
    component={CareScreen}
    options={{
        tabBarIcon: ({ focused }) => (
        <TabIcon focused={focused} icon={} label="Cuidado" />
        ),
    }}
    />

      <Tab.Screen
        name="Agregar"
        component={AddPlantScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={} label="Agregar" />
          ),
        }}
      />

      <Tab.Screen
        name="Historial"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={} label="Historial" />
          ),
        }}
      />

      <Tab.Screen
        name="Cosecha"
        component={HarvestScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={} label="Cosecha" />
          ),
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={} label="Perfil" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    height: 80,
    paddingBottom: 10,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});