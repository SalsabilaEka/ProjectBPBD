import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Modal, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const HomeScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentLink, setCurrentLink] = useState('');

    const links = [
        'https://www.google.com/maps/d/u/0/viewer?mid=1xkujiOfp8eEdZ9NOm0geFyZ-T4H9TEaH&ll=-7.654257359802979%2C110.37457584863067&z=11',
        'https://sdin.slemankab.go.id/',
        'https://bnpb.go.id/',
        'https://basarnas.go.id/',
    ];

    const buttonLabels = [
        'Geoservice Kebencanaan',
        'Sleman Disaster Information Network',
        'Badan Nasional Penanggulangan Bencana',
        'Badan Nasional Pencarian dan Pertolongan',
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
                    <Text style={styles.headerText}>
                        Aplikasi ini membantu mengumpulkan dan menganalisis data mitigasi bencana untuk mendukung keputusan berbasis data
                    </Text>

                    {/* Data Summary Section */}
                    <View style={styles.summaryContainer}>
                        <View style={styles.leftCard}>
                            <View style={[styles.card, styles.cardTotal]}>
                                <Text style={styles.cardNumberData}>28</Text>
                                <Text style={styles.cardLabelData}>Jumlah Data</Text>
                            </View>
                        </View>
                        <View style={styles.rightCards}>
                            <View style={[styles.card, styles.cardRed]}>
                                <Text style={styles.cardNumber}>10</Text>
                                <Text style={styles.cardLabel}>  Jumlah Kejadian Bencana</Text>
                            </View>
                            <View style={[styles.card, styles.cardBlue]}>
                                <Text style={styles.cardNumber}>18</Text>
                                <Text style={styles.cardLabel}>  Jumlah Tindakan yang dilakukan</Text>
                            </View>
                        </View>
                    </View>

                    {/* Gallery Section */}
                    <View>
                        <Text style={styles.galleryTitle}>Galeri Kegiatan Penanggulangan Bencana</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryScroll}>
                            <Image source={{ uri: 'https://cdn.langit7.id/foto/850/langit7/berita/2022/12/08/1/26847/menengok-proses-pembuatan-keripik-belut-cemilan-khas-yogyakarta-efn.jpg' }} style={styles.galleryImage} />
                            <Image source={{ uri: 'https://images.bisnis.com/posts/2019/12/13/1181057/um5.jpg' }} style={styles.galleryImage} />
                            <Image source={{ uri: 'https://1.bp.blogspot.com/-ncNYABac_is/XZqrzxfunCI/AAAAAAAAHMM/9QZRk-3Th_wfBjnS4ie58bubBU0KXH3BACLcBGAsYHQ/s640/batik.jpg' }} style={styles.galleryImage} />
                            <Image source={{ uri: 'https://cdn.idntimes.com/content-images/community/2020/08/106373316-272833037121373-536482253941973684-n-c873a686e7d36491544e3966d0641d80.jpg' }} style={styles.galleryImage} />
                            <Image source={{ uri: 'https://assets.pikiran-rakyat.com/crop/0x0:0x0/x/photo/2024/01/27/811873858.png' }} style={styles.galleryImage} />
                        </ScrollView>
                    </View>

                    {/* Contact Section */}
                    <Text style={styles.sectionTitle}>Hubungi Tim Tanggap</Text>
                    <View style={styles.contactContainer}>
                        <Text style={styles.contactText}>Badan Penanggulangan Bencana Daerah</Text>
                        <Text style={styles.contactText}>Kabupaten Sleman</Text>
                        <Text style={styles.contactText}>Telepon: (0274) 865850</Text>
                        <Text style={styles.contactText}>Email: bpbd.slemankab.go.id</Text>
                    </View>

                    {/* Map Section */}
                    <WebView
                        source={{
                            uri: 'https://www.google.com/maps?q=Badan+Penanggulangan+Bencana+Daerah+Sleman&output=embed',
                        }}
                        style={styles.map}
                    />

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
    },
    scrollViewContent: {
        padding: 20,
    },
    headerText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    card: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    cardTotal: {
        backgroundColor: '#ffeed4',
    },
    cardRed: {
        backgroundColor: '#c1111e',
        marginBottom: 8,
        flexDirection: 'row',
    },
    cardBlue: {
        backgroundColor: '#659aba',
        flexDirection: 'row',
    },
    cardNumberData: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    cardNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    cardLabelData: {
        fontSize: 14,
        textAlign: 'center',
    },
    cardLabel: {
        fontSize: 14,
        textAlign: 'center',
        color: '#fff',
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
});

export default HomeScreen;
