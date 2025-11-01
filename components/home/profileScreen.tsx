import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserProfile {
  username: string;
  plantsRegistered: number;
  fullName: string;
  email: string;
  phone: string;
}

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [profile, setProfile] = useState<UserProfile>({
    username: 'Elkinml06',
    plantsRegistered: 2,
    fullName: 'Elkin Mendoza López',
    email: 'emendoza264@unab.edu.co',
    phone: '3124038107',
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

  const updateProfile = (field: keyof UserProfile, value: string | number) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
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

          {/* Phone */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profile.phone}
              onChangeText={(text) => updateProfile('phone', text)}
              editable={isEditing}
              placeholder="Teléfono"
              keyboardType="phone-pad"
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
});