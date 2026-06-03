import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Navbar from '../components/Navbar';

export default function AISupport() {
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      message: 'Hi! I\'m HealthFit AI, your health assistant. Ask me anything about your health, fitness, or wellness.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Handle search bar submit (Gemini style)
  const handleSearch = async () => {
    if (!inputMessage.trim()) return;
    const userMsg = {
      id: chatMessages.length + 1,
      type: 'user' as const,
      message: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setInputMessage('');
    Keyboard.dismiss();

    try {
      // Use Gemini API for search/question via your app server
      const res = await fetch('http://10.155.97.162:3000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.message })
      });
      const data = await res.json();
      setChatMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          type: 'ai' as const,
          message: data.reply || 'No response from Gemini AI.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setChatMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          type: 'ai' as const,
          message: 'Error connecting to Gemini AI.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
    setLoading(false);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 300);
  };

  return (
    <View style={styles.container}>
      {/* Gemini-style gradient header */}
      <LinearGradient
        colors={['#0a7ea4', '#42a5f5', '#90caf9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.logo}>Healthfit AI</Text>
        <Text style={styles.subtitle}>Your health assistant</Text>
      </LinearGradient>

      {/* Gemini-style chat history */}
      <ScrollView
        style={styles.chatScroll}
        contentContainerStyle={[styles.chatContent, { paddingBottom: 120 }]} // Increased paddingBottom for Navbar + search bar
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
      >
        {chatMessages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageContainer,
              msg.type === 'user' ? styles.userMessage : styles.aiMessage
            ]}
          >
            <Text style={[
              styles.messageText,
              msg.type === 'user' ? styles.userText : styles.aiText
            ]}>
              {msg.message}
            </Text>
            <Text style={styles.timestamp}>{msg.timestamp}</Text>
          </View>
        ))}
        {loading && (
          <View style={[styles.messageContainer, styles.aiMessage]}>
            <Text style={[styles.messageText, styles.aiText]}>HealthFit AI is thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* Search bar should be outside ScrollView and above Navbar */}
      <View style={[styles.searchBarFixedContainer, { marginBottom: 88 }]}> {/* 72 for navbar + 16 spacing */}
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Ask AI about your health..."
            returnKeyType="send"
            onSubmitEditing={handleSearch}
            editable={!loading}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <MaterialIcons name="send" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    paddingTop: 48, // increased from 24 to avoid overlap with notification bar
    paddingBottom: 12, // reduced from 24
    paddingHorizontal: 18, // reduced from 24
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderBottomLeftRadius: 24, // reduced from 32
    borderBottomRightRadius: 24, // reduced from 32
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  logo: {
    fontSize: 20, // reduced from 32
    fontWeight: '700', // reduced from 900
    color: '#fff',
    letterSpacing: 1, // reduced from 2
    marginBottom: 2, // reduced from 4
  },
  subtitle: {
    fontSize: 13, // reduced from 16
    color: '#e3f2fd',
    marginBottom: 4, // reduced from 8
    fontWeight: '500',
  },
  chatScroll: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 0, // Remove marginBottom so search bar is not overlapped
  },
  chatContent: {
    paddingBottom: 24,
    paddingTop: 8,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '85%',
    alignSelf: 'flex-start',
    borderRadius: 18,
    padding: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  userMessage: {
    backgroundColor: '#0a7ea4',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e3f2fd',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
    fontWeight: '500',
  },
  aiText: {
    color: '#1565c0',
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 11,
    color: '#90caf9',
    marginTop: 6,
    textAlign: 'right',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd', // Highlighted background
    borderRadius: 24,
    elevation: 4, // Stronger shadow
    shadowColor: '#42a5f5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginHorizontal: 24,
    borderWidth: 2, // Add border
    borderColor: '#42a5f5', // Highlight color
  },
  searchBar: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    borderRadius: 24,
    backgroundColor: '#e3f2fd', // Match container highlight
    borderWidth: 0, // Remove default border
  },
  searchBtn: {
    backgroundColor: '#0a7ea4',
    borderRadius: 24,
    padding: 10,
    marginRight: 8,
    marginLeft: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarFixedContainer: {
    // Remove position: 'absolute', bottom, left, right, zIndex
    paddingHorizontal: 0,
    paddingBottom: 0,
    marginTop: 0,
    backgroundColor: 'transparent',
    marginHorizontal: 0,
    marginBottom: 0,
    width: '100%',
    alignItems: 'center',
  },
});
