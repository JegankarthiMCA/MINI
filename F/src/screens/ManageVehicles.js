import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For AsyncStorage

export default function ManageVehicles({ navigation }) {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [capacity, setCapacity] = useState('');

  // Function to get token from AsyncStorage (or wherever you are storing it)
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Assuming token is stored with key 'token'
      return token;
    } catch (e) {
      console.log('Failed to get token');
    }
  };

  const handleAddVehicle = async () => {
    const token = await getToken(); // Get the stored token

    try {
      const response = await axios.post(
        'http://172.16.22.187:8080/api/admin/vehicles',
        {
          vehicleNumber,
          capacity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request header
          }
        }
      );

      if (response.status === 200) {  // Check the response status
        Alert.alert('Success', 'Vehicle added successfully');
        navigation.navigate('AdminDashboard');
      } else {
        // Handle cases where the response is not 200 OK
        Alert.alert('Error', `Unexpected response code: ${response.status}`);
      }

    } catch (error) {
      // Check the structure of the error object
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        Alert.alert('Error', `Failed to add vehicle: ${error.response.data.message || error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        Alert.alert('Error', 'No response received from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        Alert.alert('Error', `Request setup failed: ${error.message}`);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Add Vehicle</Text>
        <TextInput
          style={styles.input}
          placeholder="Vehicle Number"
          placeholderTextColor="#999999" // Placeholder text color
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Capacity"
          placeholderTextColor="#999999" // Placeholder text color
          value={capacity}
          onChangeText={setCapacity}
        />
        <TouchableOpacity style={styles.button} onPress={handleAddVehicle}>
          <Text style={styles.buttonText}>Add Vehicle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  formContainer: {
    width: width - 40, // Ensure form container width is responsive
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#ffffff', // White text
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ffffff', // White border
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    color: '#ffffff', // White text
    backgroundColor: '#1c1c1c', // Dark gray background for input
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#ffffff', // White background for button
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000', // Black text for button
    fontSize: 16,
    fontWeight: 'bold',
  },
});
