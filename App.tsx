import React from "react";
// Screens
import { HomeScreen } from "./Screens/HomeScreen";
import { DetailsScreen } from "./Screens/DetailsScreen";
import { SearchScreen } from "./Screens/SearchScreen";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


import { Ionicons } from "@expo/vector-icons";
const Tab = createBottomTabNavigator();

type IconName =
  | 'home'
  | 'home-outline'
  | 'search'
  | 'search-outline'
  | 'cloudy'
  | 'cloudy-outline';

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: IconName;
            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
              color = focused ? "white" : "white";
            } else if (route.name === "Details") {
              iconName = focused ? "cloudy" : "cloudy-outline";
              color = focused ? "white" : "white";
            } 
            else if (route.name === "Search") {
              iconName = focused ? "search" : "search-outline";
              color = focused ? "white" : "white";
            } 
            else {
              iconName = 'home';
              color = 'white';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarLabel: () => null,
          tabBarStyle: {
            backgroundColor: '#05071a',
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
            borderTopWidth: 0,
          },
        })}

      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;