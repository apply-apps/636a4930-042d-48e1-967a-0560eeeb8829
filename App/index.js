// Filename: index.js
// Combined code from all files

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, ActivityIndicator, View, FlatList, Image } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}&hourly=temperature_2m,weathercode,icon&timezone=auto`)
                .then(response => response.json())
                .then(data => {
                    // Filter the data to get points every 3 hours
                    const filteredData = data.hourly.time.map((time, index) => ({
                        time,
                        temperature: data.hourly.temperature_2m[index],
                        weathercode: data.hourly.weathercode[index],
                        icon: data.hourly.icon[index]
                    })).filter((_, index) => index % 3 === 0); // Filter every 3 hours

                    setWeatherData(filteredData);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        })();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Today's Weather (Every 3 Hours)</Text>
            {weatherData ? (
                <FlatList
                    data={weatherData}
                    keyExtractor={(item) => item.time}
                    renderItem={({ item }) => (
                        <View style={styles.weatherItem}>
                            <Text>{new Date(item.time).toLocaleTimeString()}</Text>
                            <Image
                                style={styles.icon}
                                source={{ uri: `https://openweathermap.org/img/w/${item.icon}.png` }}
                            />
                            <Text>{item.temperature}°C</Text>
                        </View>
                    )}
                />
            ) : (
                <Text>No weather data available.</Text>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30, // Space for the status bar
        marginHorizontal: 20,
        backgroundColor: '#f5fcff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    weatherItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    icon: {
        width: 50,
        height: 50,
        marginHorizontal: 10,
    },
});