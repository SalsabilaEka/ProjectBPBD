import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCity, faChalkboardUser, faVolcano } from '@fortawesome/free-solid-svg-icons';

const HomeScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentLink, setCurrentLink] = useState('');

    const links = [
        { url: 'https://script.google.com/macros/s/AKfycby7RRdBmCKR5O88H-Fd2EiKYhDJXI9c4LzGrI4_HRgLEKAINiNf4CwXe5pW877H7hyS/exec', icon: faVolcano, text: 'Kejadian Bencana' },
        { url: 'https://sdin.slemankab.go.id/', icon: faChalkboardUser, text: 'Kegiatan Mitigasi Bencana' },
        { url: 'https://bnpb.go.id/', icon: faCity, text: 'Persil Bangunan' },
    ];

    const openModal = (link) => {
        setCurrentLink(link);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            {/* Additional Section with Buttons */}
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

            {/* WebView Modal */}
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
        justifyContent: 'center',  // Centers content vertically
        alignItems: 'center',      // Centers content horizontally
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
        marginTop: 5, // Adds space between icon and text
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
        alignItems: 'center',  // Centers buttons inside this section
    },
});

export default HomeScreen;
