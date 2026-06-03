import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Navbar from '../components/Navbar';
import { useSensorData } from '../../hooks/useSensorData';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const { isAuthenticated } = useAuth();
  const data = useSensorData(isAuthenticated);

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={['#1e88e5', '#42a5f5', '#90caf9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoRow}>
            <MaterialCommunityIcons name="heart-pulse" size={38} color="#e53935" style={{ marginRight: 10 }} />
            <Text style={styles.logo}>HEALTHFIT</Text>
          </View>
        </View>
      </LinearGradient>
      {/* Connection Status */}
      <View style={styles.connectionStatus}>
        <Text
          style={{
            color: data.serverConnected ? '#4CAF50' : '#F44336',
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          {data.serverConnected ? 'Server is connected' : 'Server is not connected'}
        </Text>
      </View>
      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Dashboard</Text>
        {!isAuthenticated ? (
          <Text style={{ color: '#F44336', fontSize: 16, marginBottom: 20 }}>
            Login to connect
          </Text>
        ) : !data ? (
          <Text style={{ color: '#1565c0', fontSize: 16, marginBottom: 20 }}>
            Loading data...
          </Text>
        ) : (
          <>
            {/* Temperature Card */}
            <LinearGradient
              colors={['#e3f2fd', '#bbdefb']}
              locations={[0, 1]}
              style={styles.card}
            >
              <Text style={styles.label}>Temperature:</Text>
              <Text style={styles.value}>
                {data.temp !== null && typeof data.temp === 'number'
                  ? `${data.temp} °C`
                  : 'Loading...'}
              </Text>
            </LinearGradient>
            {/* Stress Level Card */}
            <LinearGradient colors={['#fce4ec', '#f8bbd0']} locations={[0, 1]} style={styles.card}>
              <Text style={styles.label}>Stress Level:</Text>
              <Text style={styles.value}>
                {data.stressLevel !== null && typeof data.stressLevel === 'number'
                  ? `${data.stressLevel} %`
                  : 'Loading...'}
              </Text>
            </LinearGradient>
            {/* Heart Rate Card */}
            <LinearGradient colors={['#e8f5e9', '#a5d6a7']} locations={[0, 1]} style={styles.card}>
              <Text style={styles.label}>Heart Rate:</Text>
              <Text style={styles.value}>
                {data.heartRate !== null && typeof data.heartRate === 'number'
                  ? `${data.heartRate} bpm`
                  : 'Loading...'}
              </Text>
            </LinearGradient>
            {/* SpO₂ Card */}
            <LinearGradient colors={['#ede7f6', '#b39ddb']} locations={[0, 1]} style={styles.card}>
              <Text style={styles.label}>SpO₂:</Text>
              <Text style={styles.value}>
                {data.spo2 !== null && typeof data.spo2 === 'number'
                  ? `${data.spo2} %`
                  : 'Loading...'}
              </Text>
            </LinearGradient>
            {/* Show prediction and alert fields in one container */}
            {(data.prediction || data.alert) && (
              <View style={styles.infoBox}>
                {data.prediction && (
                  <Text style={[styles.infoValue, { color: '#FFA000', marginBottom: 4 }]}>
                    {typeof data.prediction === 'string'
                      ? data.prediction
                      : JSON.stringify(data.prediction)}
                  </Text>
                )}
                {data.alert && (
                  <Text style={[styles.infoValue, { color: '#e53935', fontWeight: 'bold' }]}>
                    {typeof data.alert === 'string'
                      ? data.alert
                      : JSON.stringify(data.alert)}
                  </Text>
                )}
              </View>
            )}
          </>
        )}
        {/* Add extra space at the bottom so content is not overlapped by Navbar */}
        <View style={{ height: 100 }} />
      </ScrollView>
      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  logoContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 30,
    paddingVertical: 22,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#90caf9',
    marginBottom: 6,
    shadowColor: '#90caf9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 38,
    fontWeight: '900',
    color: '#1565c0',
    letterSpacing: 4,
    textAlign: 'center',
    textShadowColor: '#90caf9',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  connectionStatus: {
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollInner: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 100, // Extra space for Navbar
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a7ea4',
  },
  infoBox: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#fffbe6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ffe082',
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
});

