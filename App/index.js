// Filename: index.js
// Combined code from all files

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, ActivityIndicator, View } from 'react-native';
import * as Location from 'expo-location';

const WeatherInfo = ({ weather }) => {
    return (
        <View style={styles.weatherInfoContainer}>
            <Text style={styles.info}>Temperature: {weather?.temperature}°C</Text>
            <Text style={styles.info}>Wind Speed: {weather?.windspeed} m/s</Text>
            <Text style={styles.info}>Weather Code: {weather?.weathercode}</Text>
        </View>
    );
};

export default function App() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}&current_weather=true`)
                .then(response => response.json())
                .then(data => {
                    setWeather(data.current_weather);
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
            <Text style={styles.title}>Current Weather</Text>
            {weather ? <WeatherInfo weather={weather} /> : <Text>No weather data available.</Text>}
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
    errorText: {
        fontSize: 18,
        color: 'red',
    },
    weatherInfoContainer: {
        alignItems: 'center',
    },
    info: {
        fontSize: 18,
        marginVertical: 5,
    },
});