import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/App';
import { COLORS } from './src/constants/Theme';

export default function App() {
  return (
    <View style={styles.appRoot}>
      <SafeAreaProvider style={styles.safeArea}>
        <RootNavigator />
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  appRoot: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
});
