import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator, FlatList, ImageBackground } from "react-native";
import * as Location from 'expo-location';
import { BlurView } from 'expo-blur';
const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";
const OPEN_WEATHER_KEY = process.env.EXPO_PUBLIC_OPEN_WEATHER_KEY;

export function getFirstTwoChars(str: String) {
    str = str.toString();

    // Extract the first two characters
    const firstTwo = str.slice(0, 2);
    //const last = str.slice(0, 1);
    return firstTwo;
}

function formatTime(timestamp: number) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { weekday: "short", hour: '2-digit', minute: '2-digit'});
}

type MainWeather = {
    [x: string]: any;
    name: String,
    main: {
        temp: number,
        feels_like: number,
        temp_min: number,
        temp_max: number,
        pressure: number,
        humidity: number,
        sea_level: number,
        grnd_level: number
    }
}

type Weather = {
    main: MainWeather,
    dt: number,
}

export const DetailsScreen: React.FC = () => {
    const [weather, setWeather] = useState<Weather[]>();
    const [city, setCity] = useState<string>();
    const [location, setLocation] = useState<Location.LocationObject>();
    const [errorMsg, setErrorMsg] = useState<string>();

    useEffect(() => {
        if (location) {
            fetchForecast();
        }
    }, [location]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg("Permission to access location was denied");
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    const fetchForecast = async () => {
        if (!location) {
            return;
        }
        const results = await fetch(`${BASE_URL}?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${OPEN_WEATHER_KEY}`);
        const data = await results.json();
        //console.log(JSON.stringify(data, null, 2));
        setWeather(data.list);
        setCity(data.city.name);
    }

    if (!weather) {
        return (
            <ActivityIndicator />
        )
    }
    const firstTemperature = weather.length > 0 ? getFirstTwoChars(weather[0].main.temp.toString()) : '';
    return (
        <View style={styles.container}>
            <ImageBackground
                blurRadius={20}
                source={require("../Pictures/clear-cloudy-weather.jpg")}
                style={styles.image_background} resizeMode="cover">
                <Text style={styles.cityName}>{city}</Text>
                <Text style={styles.titleTempurature}>{firstTemperature}°</Text>
                <FlatList
                    contentContainerStyle={{ gap: 12 }}
                    showsHorizontalScrollIndicator={false}
                    data={weather}
                    horizontal
                    renderItem={({ item }) => (
                        <View style={styles.temperaturesContainer}>
                            <BlurView intensity={50} style={styles.blurContainer}>
                                <Text style={styles.temperatures}>{getFirstTwoChars(item.main.temp.toString())}°</Text>
                                {/*{console.log(getFirstTwoChars(item.main.temp.toString()))} */}
                                <Text style={styles.time}>{formatTime(item.dt)}</Text>
                            </BlurView>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </ImageBackground>
            <StatusBar style="light"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleTempurature: {
        flex: 1,
        alignSelf: "center",
        fontSize: 100,
        fontWeight: "900",
        textAlign: 'center',
        paddingTop: 100,
        color: "white"
    },
    cityName: {
        paddingTop: 100,
        fontSize: 60,
        color: "white",
        textAlign: 'center',
    },
    temperaturesContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        alignContent: "center",
    },
    blurContainer: {
        //marginTop: 130,
        padding: 50,
        paddingHorizontal: 15,
        //margin: 16,
        textAlign: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 30,
      },
    temperatures: {
        fontSize: 40,
        fontWeight: "900",
        textAlign: 'center',
        color: "white",
    },
    time: {
        fontSize: 25,
        color: "white",
        fontWeight: "bold",
        textAlign: 'center',
    },
    image_background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

//