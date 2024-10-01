import React, { useEffect, useState } from 'react';
import { View, Text, Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // For navigation

export default function StudentDashboard() {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const [studentName, setStudentName] = useState(''); // Added student name state
  const navigation = useNavigation(); // For navigation

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await axios.get('http://172.16.22.187:8080/api/student/my-route', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRoute(response.data);
        setStudentName(response.data.studentName || 'Student'); // Set student name
      } catch (error) {
        // Handle different types of errors
        if (error.response) {
          // Server responded with a status code outside the 2xx range
          setError(error.response.data.message || 'Failed to load route');
        } else if (error.request) {
          // The request was made but no response was received
          setError('No response from the server');
        } else {
          // Something happened in setting up the request
          setError(`Request error: ${error.message}`);
        }
      } finally {
        setLoading(false); // Set loading to false after the request is completed
      }
    };

    fetchRoute();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token'); // Remove token from AsyncStorage
      navigation.navigate('Login'); // Navigate to the Login screen
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
    }
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!route) {
    return <Text style={styles.noInfoText}>No route information available</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>TMs - Student Dashboard</Text>
      <Text style={styles.subtitle}>Hello {route.username}</Text>
      <View style={styles.infoContainer}></View>
      <Text style={styles.title}>Assigned Bus</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.info}>Bus Number: {route.vehicle.vehicleNumber}</Text>
        <Text style={styles.info}>Route: {route.routeName}</Text>
      </View>
      <Text style={styles.subtitle}>Stops:</Text>
      <FlatList
        data={route.stops}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.stopItemContainer}>
            <Text style={styles.stopItem}>{item.stopName} - {item.timing}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000000', // Black background
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff', // White text
    textAlign: 'center',
    marginVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#ffffff', // White underline
    paddingBottom: 10,
  },
  studentName: {
    fontSize: 20,
    color: '#ffffff', // White text
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    color: '#ffffff', // White text
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#1c1c1c', // Dark gray background for info
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  info: {
    fontSize: 18,
    color: '#ffffff', // White text
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#ffffff', // White text
    marginVertical: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stopItemContainer: {
    backgroundColor: '#2a2a2a', // Slightly lighter gray for stop items
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  stopItem: {
    fontSize: 16,
    color: '#ffffff', // White text
  },
  errorText: {
    color: '#ff0000', // Red text for errors
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingText: {
    color: '#ffffff', // White text for loading state
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  noInfoText: {
    color: '#ffffff', // White text for no information available
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#ffffff', // White background for button
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#000000', // Black text color
    fontSize: 16,
    fontWeight: 'bold',
  },
});
