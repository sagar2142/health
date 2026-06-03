import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Navbar from '../components/Navbar';

export default function DailyTrack() {
  const [activities, setActivities] = useState({
    steps: 5420,
    stepsGoal: 10000,
    water: 4,
    waterGoal: 8,
    sleep: 7.5,
    sleepGoal: 8,
    exercise: 30,
    exerciseGoal: 60,
    calories: 1850,
    caloriesGoal: 2200,
  });

  const incrementActivity = (activity: string) => {
    setActivities(prev => ({
      ...prev,
      [activity]: prev[activity as keyof typeof prev] + (activity === 'water' ? 1 : activity === 'sleep' ? 0.5 : 100)
    }));
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const ActivityCard = ({ 
    title, 
    icon, 
    current, 
    goal, 
    unit, 
    onIncrement, 
    color = '#0a7ea4',
    iconLibrary = 'MaterialIcons' 
  }: {
    title: string;
    icon: string;
    current: number;
    goal: number;
    unit: string;
    onIncrement: () => void;
    color?: string;
    iconLibrary?: 'MaterialIcons' | 'FontAwesome5' | 'Ionicons';
  }) => {
    const progress = getProgressPercentage(current, goal);
    
    const renderIcon = () => {
      switch (iconLibrary) {
        case 'FontAwesome5':
          return <FontAwesome5 name={icon as React.ComponentProps<typeof FontAwesome5>['name']} size={28} color={color} />;
        case 'Ionicons':
          return <Ionicons name={icon as React.ComponentProps<typeof Ionicons>['name']} size={28} color={color} />;
        default:
          return <MaterialIcons name={icon as React.ComponentProps<typeof MaterialIcons>['name']} size={28} color={color} />;
      }
    };

    return (
      <LinearGradient
        colors={[color, '#fff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.activityCard}
      >
        <View style={styles.cardHeader}>
          {renderIcon()}
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${progress}%`, backgroundColor: color }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{progress.toFixed(0)}%</Text>
        </View>
        
        <View style={styles.statsRow}>
          <Text style={styles.currentValue}>{current}{unit}</Text>
          <Text style={styles.goalValue}>/ {goal}{unit}</Text>
        </View>
        
        <TouchableOpacity style={[styles.addButton, { backgroundColor: color }]} onPress={onIncrement}>
          <MaterialIcons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={['#0a7ea4', '#42a5f5', '#90caf9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.logo}>HEALTHFIT</Text>
      </LinearGradient>
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Daily Track</Text>
        <Text style={styles.subtitle}>Track your daily health activities</Text>
        
        <View style={styles.grid}>
          <ActivityCard
            title="Steps"
            icon="directions-walk"
            current={activities.steps}
            goal={activities.stepsGoal}
            unit=""
            onIncrement={() => incrementActivity('steps')}
            color="#4CAF50"
          />
          
          <ActivityCard
            title="Water"
            icon="local-drink"
            current={activities.water}
            goal={activities.waterGoal}
            unit=" glasses"
            onIncrement={() => incrementActivity('water')}
            color="#2196F3"
          />
          
          <ActivityCard
            title="Sleep"
            icon="hotel"
            current={activities.sleep}
            goal={activities.sleepGoal}
            unit="h"
            onIncrement={() => incrementActivity('sleep')}
            color="#9C27B0"
          />
          
          <ActivityCard
            title="Exercise"
            icon="dumbbell"
            iconLibrary="FontAwesome5"
            current={activities.exercise}
            goal={activities.exerciseGoal}
            unit=" min"
            onIncrement={() => incrementActivity('exercise')}
            color="#FF5722"
          />
          
          <ActivityCard
            title="Calories"
            icon="restaurant"
            current={activities.calories}
            goal={activities.caloriesGoal}
            unit=" kcal"
            onIncrement={() => incrementActivity('calories')}
            color="#FF9800"
          />
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Today&apos;s Summary</Text>
          <Text style={styles.summaryText}>
            You&apos;re doing great! Keep up the good work to reach your daily goals.
          </Text>
          <View style={styles.completedGoals}>
            <Text style={styles.completedText}>
              Goals Completed: {Object.keys(activities).filter((key, index) => {
                if (index % 2 === 0) { // Only check actual values, not goals
                  const current = activities[key as keyof typeof activities];
                  const goal = activities[`${key}Goal` as keyof typeof activities] || 0;
                  return current >= goal;
                }
                return false;
              }).length}/5
            </Text>
          </View>
        </View>
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
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0a7ea4',
    letterSpacing: 2,
    textAlign: 'left',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingBottom: 100, // Increased padding to avoid navbar overlap
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  grid: {
    gap: 16,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    color: '#333',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    minWidth: 40,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  currentValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a7ea4',
  },
  goalValue: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginTop: 8,
    marginBottom: 40, // Increased margin to ensure proper spacing
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  completedGoals: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0a7ea4',
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0a7ea4',
  },
});
