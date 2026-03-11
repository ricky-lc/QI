import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { TestSelectionScreen } from '../screens/TestSelectionScreen';
import { TestScreen } from '../screens/TestScreen';
import { ResultsScreen } from '../screens/ResultsScreen';
import { TrainingScreen } from '../screens/TrainingScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { COLORS } from '../constants/colors';

const Stack = createStackNavigator();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: COLORS.bgPrimary },
          animationEnabled: true,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TestSelection" component={TestSelectionScreen} />
        <Stack.Screen name="Test" component={TestScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="Training" component={TrainingScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
