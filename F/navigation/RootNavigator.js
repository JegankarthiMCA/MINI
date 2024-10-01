import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../src/screens/LoginScreen';
import AdminDashboard from '../src/screens/AdminDashboard';
import StudentDashboard from '../src/screens/StudentDashboard';
import ManageStudents from '../src/screens/ManageStudents';
import ManageVehicles from '../src/screens/ManageVehicles';
import ManageRoutes from '../src/screens/ManageRoutes';
import Splash from '../src/screens/Splash';
const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
        <Stack.Screen name="ManageStudents" component={ManageStudents} />
        <Stack.Screen name="ManageVehicles" component={ManageVehicles} />
        <Stack.Screen name="ManageRoutes" component={ManageRoutes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
