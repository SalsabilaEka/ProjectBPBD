import { faCamera } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import {
    TouchableOpacity,
    View,
    StyleSheet,
    Alert,
    ScrollView,
    PermissionsAndroid,
    Image,
} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Geolocation from '@react-native-community/geolocation';
import { launchCamera } from 'react-native-image-picker';
import RNFS from 'react-native-fs';

const TambahMitigasi = () => {
    const [nama, setNama] = useState('');
    const [kontak, setKontak] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [alamat, setAlamat] = useState('');
    const [lintang, setLintang] = useState('');
    const [bujur, setBujur] = useState('');
    const [currentLocation, setCurrentLocation] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);

    const PermissionLocation = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'App needs access to your location',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                getCurrentLocation();
            } else {
                Alert.alert('Permission Denied', 'Location permission is required.');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const PermissionCameraAndOpen = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Camera Permission',
                    message: 'App needs access to your camera',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                openCamera();
            } else {
                Alert.alert('Permission Denied', 'Camera access is required.');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation({ latitude, longitude });
                setLintang(latitude.toString());
                setBujur(longitude.toString());
            },
            error => Alert.alert('Error', error.message),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    const handleSubmit = async () => {
        if (!nama || !kontak || !deskripsi || !alamat || !lintang || !bujur || !imageBase64) {
            Alert.alert('Error', 'Please fill all fields and add a photo');
            return;
        }

        const data = { nama, kontak, deskripsi, alamat, lintang, bujur, photo: imageBase64 };
        const scriptURL =
            'https://script.google.com/macros/s/AKfycbx-EETt3Nc24jpJX-tzoNVoPZ37aF-2kGhnLYS7VN0-zRCTDhyzQHZig7Eu_X7EhB9-XQ/exec';

        try {
            const response = await fetch(scriptURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log('Response:', result);

            if (result.status === 'success') {
                Alert.alert('Success', 'Data has been saved!');
                resetForm();
            } else {
                Alert.alert('Error', result.message || 'Failed to save data.');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to save data. Please try again.');
        }
    };

    const resetForm = () => {
        setNama('');
        setKontak('');
        setDeskripsi('');
        setAlamat('');
        setLintang('');
        setBujur('');
        setCurrentLocation(null);
        setImageUri(null);
        setImageBase64(null);
    };

    const openCamera = () => {
        launchCamera(
            {
                mediaType: 'photo',
                cameraType: 'back',
                quality: 1,
                saveToPhotos: true,
            },
            async response => {
                if (response.didCancel) {
                    console.log('User cancelled camera picker');
                } else if (response.errorCode) {
                    Alert.alert('Error', 'Camera failed to open. Please check your permissions.');
                } else {
                    const uri = response.assets[0].uri;
                    setImageUri(uri);
                    convertToBase64(uri);
                }
            }
        );
    };

    const convertToBase64 = async uri => {
        try {
            const base64Image = await RNFS.readFile(uri, 'base64');
            setImageBase64(`data:image/jpeg;base64,${base64Image}`);
        } catch (error) {
            Alert.alert('Error', 'Failed to convert image to Base64.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <TextInput
                        label="Nama"
                        value={nama}
                        onChangeText={setNama}
                        mode="outlined"
                        outlineColor="#c1111e"
                        activeOutlineColor="#c1111e"
                        style={styles.input}
                    />
                    <TextInput
                        label="Kontak"
                        value={kontak}
                        onChangeText={setKontak}
                        mode="outlined"
                        outlineColor="#c1111e"
                        activeOutlineColor="#c1111e"
                        style={styles.input}
                    />
                    <TextInput
                        label="Deskripsi"
                        value={deskripsi}
                        onChangeText={setDeskripsi}
                        mode="outlined"
                        outlineColor="#c1111e"
                        activeOutlineColor="#c1111e"
                        style={styles.input}
                    />
                    <TextInput
                        label="Alamat"
                        value={alamat}
                        onChangeText={setAlamat}
                        mode="outlined"
                        outlineColor="#c1111e"
                        activeOutlineColor="#c1111e"
                        style={styles.input}
                    />
                    {/* Location permission button */}
                    <View>
                        {currentLocation ? (
                            <Text style={styles.locationText}>Lokasi berhasil didapatkan!</Text>
                        ) : (
                            <TouchableOpacity onPress={PermissionLocation}>
                                <View style={styles.locationButton}>
                                    <Text style={{ color: 'white' }}>Dapatkan Lokasi!</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                    <TextInput
                        label="Lintang"
                        value={lintang}
                        onChangeText={setLintang}
                        mode="outlined"
                        outlineColor="#c1111e"
                        activeOutlineColor="#c1111e"
                        style={styles.input}
                    />
                    <TextInput
                        label="Bujur"
                        value={bujur}
                        onChangeText={setBujur}
                        mode="outlined"
                        outlineColor="#c1111e"
                        activeOutlineColor="#c1111e"
                        style={styles.input}
                    />

                    {/* Camera button */}
                    <Button
                        mode="contained"
                        onPress={PermissionCameraAndOpen}  // This now handles permission and camera opening
                        style={styles.button}
                        labelStyle={styles.buttonText}
                    >
                        <FontAwesomeIcon icon={faCamera} size={40} color={'#ffff'} style={styles.cameraIcon} />
                        Tambahkan Foto
                    </Button>

                    {/* Display taken image */}
                    {imageUri ? (
                        <View style={styles.imageContainer}>
                            <Text style={styles.imageText}>Foto yang diambil:</Text>
                            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                        </View>
                    ) : null}

                    {/* Submit button */}
                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        style={styles.button}
                        labelStyle={styles.buttonText}
                    >
                        Kirim
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    formContainer: {
        backgroundColor: '#fff8ec',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#ffeed4',
    },
    button: {
        marginTop: 20,
        paddingVertical: 8,
        backgroundColor: '#c1111e',
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 17,
    },
    cameraIcon: {
        marginRight: 10,
    },
    locationButton: {
        backgroundColor: '#c1111e',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        width: 175,
        marginBottom: 10,
    },
    locationText: {
        fontSize: 16,
        color: 'green',
        marginTop: 8,
    },
    imageContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    imageText: {
        fontSize: 16,
        color: '#333',
    },
    imagePreview: {
        marginTop: 10,
        width: 200,
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
    },
});

export default TambahMitigasi;
