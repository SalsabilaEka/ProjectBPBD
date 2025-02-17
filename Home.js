import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Modal, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import MapView, { Marker } from 'react-native-maps';

const HomeScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentLink, setCurrentLink] = useState('');
    const [dataCount, setDataCount] = useState(0);

    useEffect(() => {
        const url = 'https://script.google.com/macros/s/AKfycbwGU3B6uUUbjtUshiWdqElE6ff0w6Wz_gId3-T9xXuoYhYUcm0YFpMOczOHwiUYslfs/exec';

        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log('API Response:', data); // Log response data
                setDataCount(data.dataCount); // Mengakses dataCount yang benar
                console.log('Data Count:', dataCount); // Periksa nilai state setelah set
            } catch (error) {
                console.error('Fetch Error:', error);
            }
        };
        fetchData();
    }, []);

    const links = [
        'https://www.google.com/maps/d/u/0/viewer?mid=1xkujiOfp8eEdZ9NOm0geFyZ-T4H9TEaH&ll=-7.654257359802979%2C110.37457584863067&z=11',
        'https://bpbd.slemankab.go.id/',
        'https://sdin.slemankab.go.id/',
        'https://bnpb.go.id/',
    ];

    const buttonLabels = [
        'Geoservice Kebencanaan',
        'BPBD Kabupaten Sleman',
        'Sleman Disaster Information Network',
        'Badan Nasional Penanggulangan Bencana',
    ];

    const openModal = (link) => {
        setCurrentLink(link);
        setModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    {/* Header Section */}
                    <View style={styles.headerContainer}>
                    <Text style={styles.headerTextJudul}>
                    SIGAP Bencana (Sistem Informasi Geospasial untuk Analisis dan Penanggulangan Bencana)
                        </Text>
                        <Text style={styles.headerText}>
                            Aplikasi ini membantu mengumpulkan dan menganalisis data mitigasi bencana untuk mendukung keputusan berbasis data
                        </Text>
                    </View>

                    {/* Data Summary Section */}
                    <View style={styles.summaryContainer}>
                        <View style={styles.card}>
                            <Text style={styles.cardNumberData}>{dataCount}</Text>
                            <Text style={styles.cardLabelData}>Jumlah Data</Text>
                        </View>
                    </View>

                    {/* Gallery Section */}
                    <View>
                        <Text style={styles.galleryTitle}>Galeri Kegiatan Penanggulangan Bencana</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryScroll}>
                            <Image source={require('./asset/gambar1.jpg')} style={styles.galleryImage} />
                            <Image source={require('./asset/gambar2.jpg')} style={styles.galleryImage} />
                            <Image source={require('./asset/gambar3.jpg')} style={styles.galleryImage} />
                            <Image source={require('./asset/gambar4.png')} style={styles.galleryImage} />
                            <Image source={require('./asset/gambar5.jpg')} style={styles.galleryImage} />
                        </ScrollView>
                    </View>

                    {/* Contact Section */}
                    <Text style={styles.sectionTitle}>Hubungi Tim Tanggap</Text>
                    <View style={styles.contactContainer}>
                        <Text style={styles.contactText}>Badan Penanggulangan Bencana Daerah</Text>
                        <Text style={styles.contactText}>Kabupaten Sleman</Text>
                        <Text style={styles.contactText}>Telepon: (0274) 86850</Text>
                        <Text style={styles.contactText}>Email: bpbd@slemankab.go.id</Text>
                        <Text style={styles.contactText}>Alamat: Jalan Candi Boko, Beran, Tridadi, Sleman 55511</Text>
                    </View>



                    {/* Additional Section with Buttons */}
                    <View style={styles.additionalSection}>
                        <Text style={styles.additionalTitle}>Informasi lebih lanjut!</Text>
                        {links.map((link, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.button}
                                onPress={() => openModal(link)}
                            >
                                <Text style={styles.buttonText}>{buttonLabels[index]}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* WebView Modal */}
                    <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
                        <View style={styles.webViewContainer}>
                            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButtonText}>Tutup</Text>
                            </TouchableOpacity>
                            <WebView source={{ uri: currentLink }} style={styles.webView} />
                        </View>
                    </Modal>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollViewContent: {
        padding: 20,
    },
    headerText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    headerTextJudul: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: 'bold'
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
    },
    card: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#ffeed4',
        alignItems: 'center',
    },
    cardNumberData: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    cardLabelData: {
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#023048',
        padding: 10,
        borderRadius: 10,
        marginVertical: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
    webViewContainer: {
        flex: 1,
    },
    webView: {
        flex: 1,
    },
    closeButton: {
        padding: 15,
        backgroundColor: '#023048',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    galleryTitle: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 10,
        color: '#000',
    },
    galleryScroll: {
        flexDirection: 'row',
    },
    galleryImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    additionalTitle: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 5,
        marginTop: 10,
    },
    map: {
        width: '100%',
        height: 250,
        marginVertical: 10,
    },
    
});

export default HomeScreen;
