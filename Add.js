import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCity, faChalkboardUser, faVolcano } from '@fortawesome/free-solid-svg-icons';

const HomeScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentLink, setCurrentLink] = useState('');

    const links = [
        { url: 'https://script.google.com/macros/s/AKfycbxbE14YofZiO9Eam30sNroreMAy-xt9ojwLDJhCuqFby-X9EqpemZomBd_eoU93gp_pMQ/exec', icon: faVolcano, text: 'Kejadian Bencana' },
        { url: 'https://script.google.com/macros/s/AKfycbwCfjnjD9yUxTJIYPT67kDazNlBVIo54sGFszQnevgYn2cDoyut6cKF5gnU0p_G7We0/exec', icon: faChalkboardUser, text: 'Kegiatan Mitigasi Bencana' },
        { url: 'https://script.google.com/macros/s/AKfycby80mFZjD697uBui7e_vMq3FrbExZB25xVNk3Rxfiun29-n3Z_IFVQSzEG7U_7cz75tSw/exec', icon: faCity, text: 'Persil Bangunan' },
    ];

    const openModal = (link) => {
        setCurrentLink(link);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <View style={styles.additionalSection}>
                {links.map((link, index) => (
                    <View key={index} style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => openModal(link.url)}
                        >
                            <FontAwesomeIcon icon={link.icon} size={60} color={'#fff'} />
                        </TouchableOpacity>
                        <Text style={styles.buttonText}>{link.text}</Text>
                    </View>
                ))}
            </View>

            <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
                <View style={styles.webViewContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeButtonText}>Tutup</Text>
                    </TouchableOpacity>
                    <WebView source={{ uri: currentLink }} style={styles.webView} />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center', 
        alignItems: 'center',      
    },
    buttonContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    button: {
        backgroundColor: '#B71C1C',
        padding: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#023048',
        fontSize: 16,
        fontWeight: '700',
        marginTop: 5, 
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
    additionalSection: {
        justifyContent: 'center',
        alignItems: 'center',  
    },
});

export default HomeScreen;
