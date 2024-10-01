import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For AsyncStorage
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

export default function ManageStudents() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showBuses, setShowBuses] = useState(false);
  const navigation = useNavigation(); // Initialize useNavigation

  useEffect(() => {
    // Fetch available vehicles for assignment
    const fetchVehicles = async () => {
      const token = await getToken(); // Retrieve token for authorization
      try {
        const response = await axios.get('http://172.16.22.187:8080/api/admin/vehicles', {
          headers: { Authorization: `Bearer ${token}` } // Add token to request header
        });
        setVehicles(response.data);
      } catch (error) {
        handleError(error, 'Failed to load vehicles');
      }
    };

    fetchVehicles();
  }, []);

  // Function to get token from AsyncStorage
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage
      return token;
    } catch (e) {
      console.log('Failed to get token');
      Alert.alert('Error', 'Authentication token not found');
    }
  };

  const handleRegisterStudent = async () => {
    const token = await getToken(); // Retrieve token

    if (!token) {
      Alert.alert('Error', 'Authentication token is required');
      return;
    }

    if (!selectedVehicle) {
      Alert.alert('Error', 'Please select a vehicle');
      return;
    }

    try {
      const response = await axios.post('http://172.16.22.187:8080/api/admin/register-student', {
        username,
        password,
        vehicleId: selectedVehicle._id,
      }, {
        headers: { Authorization: `Bearer ${token}` } // Include token in request header
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Student registered successfully');
        setShowBuses(true);  // Show buses after successful registration
        navigation.navigate('AdminDashboard'); // Navigate to AdminDashboard
      } else {
        Alert.alert('Error', `Unexpected response code: ${response.status}`);
      }

    } catch (error) {
      handleError(error, 'Failed to register student');
    }
  };

  const handleError = (error, defaultMessage) => {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      Alert.alert('Error', error.response.data.message || defaultMessage);
    } else if (error.request) {
      // The request was made but no response was received
      Alert.alert('Error', 'No response from the server');
    } else {
      // Something happened in setting up the request
      Alert.alert('Error', `Request error: ${error.message}`);
    }
  };

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setVehicleId(vehicle._id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Student</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#999999" // Placeholder text color
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#999999" // Placeholder text color
        value={password}
        onChangeText={setPassword}
      />

      {/* Vehicle selection as cards */}
      <Text style={styles.subtitle}>Select a Vehicle:</Text>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.vehicleCard, selectedVehicle?._id === item._id && styles.selectedVehicleCard]}
            onPress={() => handleSelectVehicle(item)}
          >
            <Text style={styles.vehicleText}>{item.vehicleNumber}</Text>
            <Text style={styles.vehicleSubText}>Capacity: {item.capacity}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegisterStudent}>
        <Text style={styles.buttonText}>Register Student</Text>
      </TouchableOpacity>

      {showBuses && (
        <View style={styles.busesContainer}>
          <Text style={styles.subtitle}>Available Buses:</Text>
          <FlatList
            data={vehicles}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.vehicleCard}>
                <Text style={styles.vehicleText}>Bus: {item.vehicleNumber}</Text>
                <Text style={styles.vehicleSubText}>Capacity: {item.capacity}</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#ffffff', // White text
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ffffff', // White border
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#ffffff', // White text
    backgroundColor: '#1c1c1c', // Dark gray background for input
    borderRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff', // White text
    marginVertical: 10,
    fontWeight: 'bold',
  },
  busesContainer: {
    marginTop: 20,
  },
  vehicleCard: {
    backgroundColor: '#1c1c1c', // Dark gray background
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderColor: '#ffffff', // White border
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  selectedVehicleCard: {
    backgroundColor: '#333333', // Slightly darker gray for selected card
  },
  vehicleText: {
    fontSize: 16,
    color: '#ffffff', // White text
    fontWeight: 'bold',
  },
  vehicleSubText: {
    fontSize: 14,
    color: '#999999', // Light gray text
  },
  button: {
    backgroundColor: '#ffffff', // White background for button
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#000000', // Black text for button
    fontSize: 16,
    fontWeight: 'bold',
  },
});
