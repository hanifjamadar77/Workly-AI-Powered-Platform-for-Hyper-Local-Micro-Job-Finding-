// LoadingScreen.js
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Animated, StatusBar, StyleSheet, Text, View } from 'react-native';

const LoadingScreen = ({ onLoadingComplete }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto navigate after 3 seconds
    const timer = setTimeout(() => {
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Grid Background */}
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.background}
      >
        {/* Grid Pattern Overlay */}
        <View style={styles.gridOverlay} />
        
        {/* Main Content */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Worker Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.workerIcon}>👷‍♂️</Text>
          </View>
          
          {/* App Name */}
          <Text style={styles.appName}>Workly</Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  workerIcon: {
    fontSize: 60,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 2,
  },
});

export default LoadingScreen;