import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View, ImageBackground, TextInput, Button } from "react-native";
//import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const url = `https://geocode.xyz/`;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const OPEN_WEATHER_KEY = process.env.EXPO_PUBLIC_OPEN_WEATHER_KEY;

type cityLocations = {
    longt: string;
    latt: string;
}

interface GetCityWeatherProp {
    weather?: Weather
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

function getFirstTwoChars(str: string) {
    str = str.toString();
    const firstTwo = str.slice(0, 2);
    return `${firstTwo}`;
}

const getCityName = async (myInput: string, setWeather: React.Dispatch<React.SetStateAction<Weather | undefined>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoading(true); // Show loader
    try {
        const result = await fetch(`${url}${myInput}?json=1`);
        const data = await result.json();
        console.log(JSON.stringify(data, null, 2));
    const latitude: cityLocations = data.latt;
        const longitude: cityLocations = data.longt;

        if (latitude && longitude) {
            await getWeather(latitude, longitude, setWeather);
        } else {
            console.log("Invalid city data");
        }
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
}

const getWeather = async (latitude: any, longitude: any, setWeather: React.Dispatch<React.SetStateAction<Weather | undefined>>) => {
    const result = await fetch(`${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_KEY}`);
    const data = await result.json();
    setWeather(data);
    console.log(JSON.stringify(data, null, 2));
}


const GetCityWeather: React.FC<GetCityWeatherProp> = ({ weather }) => {
    if (weather) {
        return (
            <BlurView style={styles.blurContainer} intensity={25}>
                <Text style={styles.cityText}>
                    {weather.name}
                </Text>
                <Text style={styles.tempText}>
                    {getFirstTwoChars(weather.main.temp.toString())}°C
                </Text>
                <Text style={styles.descriptionText}>
                    {weather.weather[0].description}
                </Text>
            </BlurView>
        )
    }
}

export const SearchScreen: React.FC = () => {
    const [input, setInput] = useState<string>("");
    const [weather, setWeather] = useState<Weather>();
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <View style={styles.container}>
            <ImageBackground blurRadius={10} source={require("../Pictures/city-night.jpg")}
                style={styles.image_background}
                resizeMode="cover">
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter City"
                        defaultValue={input}
                        placeholderTextColor="white"
                        onChangeText={(index: string) => setInput(index)}
                        onSubmitEditing={() => getCityName(input, setWeather, setLoading)}
                    />
                </View>
                {loading ? (
                        <ActivityIndicator size="large" color="#ffffff" />
                    ) : (
                        <GetCityWeather weather={weather} />
                    )}
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cityText: {
        fontSize: 30,
         color: 'white',
         textAlign: "center"
    },
    tempText: {
        fontSize: 30,
         color: 'white',
         textAlign: "center"
    },
    descriptionText: {
        fontSize: 30,
         color: 'white',
         textAlign: "center"
    },
    blurContainer: {
        margin: 50,
        padding: 30,
        overflow: 'hidden',
        borderRadius: 30,
    },
    image_background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        width: 200,
        height: 60,
        textAlign: "center",
        color: "white",
        justifyContent: 'center',
        alignSelf: "center",
        borderColor: '#ccc', 
        borderWidth: 1,
        borderRadius: 8,  
        paddingHorizontal: 10, 
        backgroundColor: 'transparent',
        fontSize: 26,
    },

})
