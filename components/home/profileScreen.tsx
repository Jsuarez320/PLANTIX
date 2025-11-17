import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase'
import { useNavigation } from '@react-navigation/native'
import { LogOut } from 'lucide-react-native'

interface UserProfile {
  username: string;
  plantsRegistered: number;
  fullName: string;
  email: string;
  phone: string;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<any>()
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    plantsRegistered: 0,
    fullName: '',
    email: '',
    phone: '',
  });

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    console.log('Saving profile:', profile);
    console.log('Password change:', { currentPassword, newPassword });
    setIsEditing(false);
    // Reset password fields
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigation.navigate('welcome')
  }

  const updateProfile = (field: keyof UserProfile, value: string | number) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  React.useEffect(() => {
    const load = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        if (user) {
          const meta: Record<string, any> = user.user_metadata || {}
          const email = user.email ?? ''
          const phone = (user as any).phone ?? meta.phone ?? ''
          const displayName = meta.name ?? meta.full_name ?? meta.username ?? (email ? email.split('@')[0] : '')
          const fullName = meta.full_name ?? meta.name ?? ''
          const { count } = await supabase
            .from('plantings')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
          setProfile(prev => ({
            ...prev,
            username: displayName || prev.username,
            fullName: prev.fullName || fullName,
            email: email || prev.email,
            phone: prev.phone || phone,
            plantsRegistered: typeof count === 'number' ? count : prev.plantsRegistered,
          }))
        }
      } catch (e: any) {
        const msg: string = e?.message || ''
        if (msg.includes('Invalid Refresh Token') || msg.includes('Refresh Token Not Found')) {
          await supabase.auth.signOut({ scope: 'local' })
          navigation.navigate('welcome')
        }
      }
    }
    load()
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user
      if (user) {
        const meta: Record<string, any> = user.user_metadata || {}
        const email = user.email ?? ''
        const phone = (user as any).phone ?? meta.phone ?? ''
        const displayName = meta.name ?? meta.full_name ?? meta.username ?? (email ? email.split('@')[0] : '')
        const fullName = meta.full_name ?? meta.name ?? ''
        setProfile(prev => ({
          ...prev,
          username: displayName || prev.username,
          fullName: fullName || prev.fullName,
          email: email || prev.email,
          phone: phone || prev.phone,
        }))
        ;(async () => {
          const { count } = await supabase
            .from('plantings')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
          setProfile(prev => ({ ...prev, plantsRegistered: typeof count === 'number' ? count : prev.plantsRegistered }))
        })()
      }
    })
    return () => {
      listener.subscription?.unsubscribe?.()
    }
  }, [])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 12) + 64 + 24 }}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={handleLogout} style={[styles.logoutTopButton, styles.logoutTopRight]}>
            <LogOut size={16} color="#b91010ff" style={{ marginRight: 6 }} />
            <Text style={styles.logoutTopText}>Cerrar sesión</Text>
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>👤</Text>
            </View>
          </View>
          
          <Text style={styles.username}>{profile.username}</Text>
          <Text style={styles.plantsCount}>
            Plantas Registradas: {profile.plantsRegistered}
          </Text>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Información personal</Text>
            <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
              <Text style={styles.editButtonText}>✏️ Editar</Text>
            </TouchableOpacity>
          </View>

          {/* Full Name */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profile.fullName}
              onChangeText={(text) => updateProfile('fullName', text)}
              editable={isEditing}
              placeholder="Nombre completo"
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profile.email}
              onChangeText={(text) => updateProfile('email', text)}
              editable={isEditing}
              placeholder="Correo electrónico"
              keyboardType="email-address"
            />
          </View>
        </View>

        {/* Password Reset Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reestablecer contraseña</Text>
          
          {/* Current Password */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Contraseña actual"
              secureTextEntry
            />
          </View>

          {/* New Password */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nueva contraseña"
              secureTextEntry
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: {
    fontSize: 40,
    color: '#6B7280',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  plantsCount: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  logoutTopButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutTopText: {
    fontSize: 14,
    color: '#b91010ff',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputDisabled: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  saveButton: {
    backgroundColor: '#000000',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  logoutTopRight: {
    position: 'absolute',
    right: 5,
  },
});