import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => handleNavigation('/')}
      >
        <Ionicons 
          name="home" 
          size={28} 
          color={pathname === '/' ? '#fff' : 'rgba(255,255,255,0.7)'} 
        />
        <Text style={[styles.label, pathname === '/' && styles.activeLabel]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => handleNavigation('/pages/DailyTrack')}
      >
        <FontAwesome 
          name="heartbeat" 
          size={26} 
          color={pathname === '/pages/DailyTrack' ? '#fff' : 'rgba(255,255,255,0.7)'} 
        />
        <Text style={[styles.label, pathname === '/pages/DailyTrack' && styles.activeLabel]}>Daily Track</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => handleNavigation('/pages/AISupport')}
      >
        <FontAwesome5 
          name="robot" 
          size={26} 
          color={pathname === '/pages/AISupport' ? '#fff' : 'rgba(255,255,255,0.7)'} 
        />
        <Text style={[styles.label, pathname === '/pages/AISupport' && styles.activeLabel]}>AI Support</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => handleNavigation('/pages/Account')}
      >
        <MaterialIcons 
          name="account-circle" 
          size={28} 
          color={pathname === '/pages/Account' ? '#fff' : 'rgba(255,255,255,0.7)'} 
        />
        <Text style={[styles.label, pathname === '/pages/Account' && styles.activeLabel]}>Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
    backgroundColor: '#0a7ea4',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 8,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    zIndex: 100,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  activeLabel: {
    color: '#fff',
    fontWeight: '700',
  },
});