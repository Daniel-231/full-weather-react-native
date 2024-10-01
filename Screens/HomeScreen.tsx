import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View, ImageBackground } from "react-native";

import * as Location from 'expo-location';
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const OPEN_WEATHER_KEY = process.env.EXPO_PUBLIC_OPEN_WEATHER_KEY;

function getFirstTwoChars(str: string) {
    str = str.toString();
    const firstTwo = str.slice(0, 2);
    return `${firstTwo}`
}

type Weather = {
    name: string,
    main: {
        temp: number,
        feels_like: number,
        temp_min: number,
        temp_max: number,
        pressure: number,
        humidity: number,
        sea_level: number,
        grnd_level: number
    },
    sys: {
        "country": string,
        "sunrise": number,
        "sunset": number
    },
    dt: number,
    weather: {
        id: number,
        main: string,
        description: string,
        icon: string
    }[]
}

export const HomeScreen: React.FC = () => {
    const [weather, setWeather] = useState<Weather>();
    const [location, setLocation] = useState<Location.LocationObject>();
    const [errorMsg, setErrorMsg] = useState<String>();

    useEffect(() => {
        if (location) {
            fetchWeather();
        }
    }, [location]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status != 'granted') {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            //console.log("Location: ", location);
            setLocation(location);
        })();
    }, []);

    const fetchWeather = async () => {
        if (!location) {
            return;
        }
        const results = await fetch(`${BASE_URL}?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${OPEN_WEATHER_KEY}`);
        const data = await results.json();
        console.log(JSON.stringify(data, null, 2));
        setWeather(data);
    }

    if (!weather) {
        return (
            <ActivityIndicator />
        );
    }
    const timestamp: number = weather.dt;
    const date = new Date(timestamp * 1000);
    const timeOptions: object = {
        hour: '2-digit',
        hour12: false // 24-hour format
    };
    const time24HourFormat = parseInt(date.toLocaleTimeString('en-US', timeOptions));

    const weatherDescription = weather.weather.map(weatherItem => weatherItem.description).toString(); //IMPORTANT LINE OF CODE
    console.log(weatherDescription);
    const getWeatherIcon = (description: string) => {
        if (description.includes("clear sky")) {
            if (time24HourFormat > 18) {
                return "sunny";
            } else {
                return "moon"
            }
        }
        else if (description.includes("cloud")) {
            if (time24HourFormat > 6) {
                return "cloudy-night";
            } else {
                return "cloud";
            }
        } else if (description.includes("moderate rain")) {
            return "rainy";

        } else if (description.includes("snow")) {
            return "snow";
        } else if (description.includes("storm")) {
            return "thunderstorm";
        } else {
            return "partly-sunny"; // Default icon
        }
    };


    return (
        <View style={styles.container}>
            <ImageBackground blurRadius={50}
                source={require("../Pictures/bg.png")}
                style={styles.image_background}
                resizeMode="cover"
            >
                <BlurView style={styles.blurContainer} intensity={50}>
                    <Text style={styles.location}>{weather.name}, {weather.sys.country}</Text>
                    <View style={styles.weatherRow}>
                        <Ionicons name={getWeatherIcon(weatherDescription)} size={50} color="white" />
                        <Text>{"  "}</Text>
                        <Text style={styles.temperature}>{getFirstTwoChars(weather.main.temp.toString())}°</Text>
                    </View>
                    <Text style={styles.highAndLow}>H:{getFirstTwoChars(weather.main.temp_max.toString())}°  L:{getFirstTwoChars(weather.main.temp_min.toString())}°</Text>
                    <View style={styles.huminidy}>
                        <Ionicons name={"water-outline"} size={30} color={"white"} />
                        <Text style={styles.humidityText}>
                            {weather.main.humidity}%
                        </Text>
                    </View>
                    <StatusBar style="light" />
                </BlurView>
            </ImageBackground>
        </View>
    );
}
//
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    blurContainer: {
        padding: 50,
        //paddingHorizontal: 15,
        textAlign: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 30,
    },
    location: {
        fontSize: 40,
        color: "white"
    },
    temperature: {
        fontSize: 70,
        fontWeight: "800",
        marginRight: 20,
        marginTop: 20,
        marginBottom: 20,
        color: "white"
    },
    feelsLike: {
        fontSize: 30,
        fontWeight: "800",
        textAlign: "center",
        color: "white"
    },
    image_background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    weather_status: {
        fontSize: 24,
        textAlign: "center",
        color: "white"
    },
    weatherRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    highAndLow: {
        padding: 10,
        fontSize: 28,
        marginTop: 20,
        color: "white",
        textAlign: "center"
    },
    huminidy: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },
    humidityText: {
        fontSize: 30,
        color: 'white',
        marginLeft: 8, // Space between icon and text
        textAlign: "center"
    }
});