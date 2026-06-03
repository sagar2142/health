import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const router = useRouter();
  const { register, login } = useAuth();

  const handleSignup = async () => {
    const result = await register(email, password, name, phone, bloodGroup);
    if (result?.success && result.token && result.user) {
      await login(result.token, result.user); // Log in after signup
      router.replace('/'); // Redirect to homescreen after signup
    } else if (result?.success) {
      // Fallback: If backend doesn't return token/user, just show success
      Alert.alert('Signup Successful', 'You can now log in.');
      router.replace('/');
    } else {
      Alert.alert('Signup Failed', result?.error || 'Could not create account');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up for HealthFit</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Blood Group (e.g. A+, O-)"
        value={bloodGroup}
        onChangeText={setBloodGroup}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/pages/auth/Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f8f9fa' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 32, textAlign: 'center', color: '#0a7ea4' },
  input: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: '#0a7ea4', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { color: '#0a7ea4', textAlign: 'center', marginTop: 8 },
});