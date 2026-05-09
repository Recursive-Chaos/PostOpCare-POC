import React from 'react';
import { View, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { palette, styles } from './App.styles';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import { useAuth } from './src/hooks/useAuth';

export default function App() {
  const auth = useAuth();
  
  const topInset = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

  if (auth.loading) {
    return (
      <View style={[styles.safeArea, { paddingTop: topInset, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.safeArea, { paddingTop: topInset }]}>
      <ExpoStatusBar style="dark" backgroundColor={palette.background} />
      {!auth.user ? (
        <LoginScreen auth={auth} />
      ) : (
        <DashboardScreen user={auth.user} onLogout={auth.logout} />
      )}
    </View>
  );
}