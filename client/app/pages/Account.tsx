import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';

export default function Account() {
  const { user, logout, isAuthenticated, setUser } = useAuth(); // add setUser
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || '');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Update profile on your app server
      const res = await fetch('http://10.155.97.162:3000/api/auth/update-profile', {
        method: 'POST', // Change from PUT to POST
        headers: { 
          'Content-Type': 'application/json'
          // Remove Authorization header unless backend checks JWT
        },
        body: JSON.stringify({ email: user.email, name, phone, bloodGroup }),
      });
      const data = await res.json();
      if (data.success) {
        setUser({
          ...user,
          name,
          phone,
          bloodGroup,
        });
        setEditing(false);
        Alert.alert('Profile Updated', 'Your profile has been updated.');
      } else {
        Alert.alert('Update Failed', data.error || 'Could not update profile.');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error');
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            try {
              // Delete account on your app server
              const res = await fetch('http://10.155.97.162:3000/api/auth/delete-account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email }),
              });
              const data = await res.json();
              if (data.success) {
                Alert.alert('Account Deleted', 'Your account has been deleted.');
                await logout();
                router.replace('/pages/auth/Signup');
              } else {
                Alert.alert('Delete Failed', data.error || 'Could not delete account.');
              }
            } catch (err) {
              Alert.alert('Error', 'Network error');
            }
          },
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.profileCard}>
          <Text style={styles.info}>You are not logged in.</Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => router.push('/pages/auth/Login')}
          >
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signupBtn}
            onPress={() => router.push('/pages/auth/Signup')}
          >
            <Text style={styles.signupBtnText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <Navbar />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.info}>No user profile found.</Text>
        <Navbar />
      </View>
    );
  }

  // Show profile menu when authenticated and user exists
  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}</Text>
        </View>
        <Text style={styles.email}>{user.email}</Text>
        {editing ? (
          <>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              value={bloodGroup}
              onChangeText={setBloodGroup}
              placeholder="Blood Group"
              editable={!loading}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(false)} disabled={loading}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.name}>{user.name || 'No name set'}</Text>
            <Text style={styles.infoRow}>Phone: <Text style={styles.infoValue}>{user.phone || 'Not set'}</Text></Text>
            <Text style={styles.infoRow}>Blood Group: <Text style={styles.infoValue}>{user.bloodGroup || 'Not set'}</Text></Text>
            <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
          <Text style={styles.deleteBtnText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', justifyContent: 'center', alignItems: 'center' },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    marginBottom: 40,
    width: 320,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  email: { fontSize: 16, color: '#666', marginBottom: 8 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
    width: '100%',
  },
  editBtn: {
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  editBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  saveBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelBtn: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  cancelBtnText: { color: '#333', fontWeight: 'bold', fontSize: 16 },
  logoutBtn: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  logoutBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  info: { fontSize: 18, color: '#666', textAlign: 'center', marginTop: 40 },
  loginBtn: {
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 12,
    marginTop: 16,
  },
  loginBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  signupBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 8,
  },
  signupBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  deleteBtn: {
    backgroundColor: '#e53935',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  deleteBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  infoRow: { fontSize: 16, color: '#666', marginBottom: 4 },
  infoValue: { color: '#333', fontWeight: 'bold' },
});

// Add this helper function at the top (after imports)
async function getToken() {
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    return await AsyncStorage.getItem('token');
  } catch {
    return '';
  }
}
