import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      // Login to your app server (which receives ESP32 data)
      const res = await fetch('http://10.155.97.162:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token && data.user) {
        await login(data.token, data.user);
        router.replace('/');
      } else {
        Alert.alert('Login Failed', data.error || 'Invalid credentials');
      }
    } catch {
      Alert.alert('Error', 'Could not connect to server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to HealthFit</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/pages/auth/Signup')}>
        <Text style={styles.link}>Don&apos;t have an account? Sign Up</Text>
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