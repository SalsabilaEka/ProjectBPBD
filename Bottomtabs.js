import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHouse, faFileCirclePlus, faFolderOpen, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import Beranda from './Home';
import Tambahmitigasi from './TambahMitigasi';

function HomeScreen() {
    return (
        <Beranda />
    );
}


function MapScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Settings!</Text>
        </View>
    );
}
function AddScreen() {
    return (
        <Tambahmitigasi />
    );
}
function DataScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Settings!</Text>
        </View>
    );
}

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Beranda" component={HomeScreen}
                    options={{
                        headerShown: true,
                        tabBarIcon: ({ color }) => (
                            <FontAwesomeIcon icon={faHouse} size={20} color={color} />
                        ),
                    }} />
                <Tab.Screen name="Peta" component={MapScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <FontAwesomeIcon icon={faMapLocationDot} size={20} color={color} />
                        ),
                    }} />
                <Tab.Screen name="Tambah" component={AddScreen}
                    options={{
                        headerShown: true,
                        tabBarIcon: ({ color }) => (
                            <FontAwesomeIcon icon={faFileCirclePlus} size={20} color={color} />
                        ),
                    }} />
                <Tab.Screen name="Data" component={DataScreen}
                    options={{
                        headerShown: true,
                        tabBarIcon: ({ color }) => (
                            <FontAwesomeIcon icon={faFolderOpen} size={20} color={color} />
                        ),
                    }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}