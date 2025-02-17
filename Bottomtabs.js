import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHouse, faFileCirclePlus, faFolderOpen, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import Beranda from './Home';
import TambahData from './Add';
import Peta from './Map';
import Data from './Data';

function HomeScreen() {
    return (
        <Beranda />
    );
}

function MapScreen() {
    return (
        <Peta />
    );
}

function AddScreen() {
    return (
        <TambahData />
    );
}

function DataScreen() {
    return (
        <Data />
    );
}

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color }) => {
                        let iconName;

                        // Assign icons based on the route name
                        if (route.name === 'Beranda') {
                            iconName = faHouse;
                        } else if (route.name === 'Peta') {
                            iconName = faMapLocationDot;
                        } else if (route.name === 'Tambah') {
                            iconName = faFileCirclePlus;
                        } else if (route.name === 'Data') {
                            iconName = faFolderOpen;
                        }

                        // Return the icon with focused color
                        return (
                            <FontAwesomeIcon
                                icon={iconName}
                                size={20}
                                color={focused ? '#770101' : 'gray'}  // Change color when active or inactive
                            />
                        );
                    },
                    tabBarLabel: ({ focused }) => {
                        let labelColor = focused ? '#770101' : 'gray';  // Red when active
                        return (
                            <Text style={{ fontSize: 11, color: labelColor }}>
                                {route.name}
                            </Text>
                        );
                    }
                })}
            >
                <Tab.Screen name="Beranda" component={HomeScreen} options={{ headerShown: true }} />
                <Tab.Screen name="Peta" component={MapScreen} options={{ headerShown: false }} />
                <Tab.Screen name="Tambah" component={AddScreen} options={{ headerShown: true }} />
                <Tab.Screen name="Data" component={DataScreen} options={{ headerShown: true }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
