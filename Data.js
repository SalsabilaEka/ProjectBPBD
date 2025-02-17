import React, { useState, useEffect } from 'react';
import { Image, View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Modal, Linking } from 'react-native';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';  // Ikon gambar kosong

const App = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(''); // Kategori yang dipilih
    const [searchText, setSearchText] = useState(''); // Untuk input pencarian
    const [modalVisible, setModalVisible] = useState(false);  // Modal visibility state
    const [selectedItem, setSelectedItem] = useState(null); // Store the selected item for modal

    useEffect(() => {
        const fetchData = async () => {
            try {
                // URL dari ketiga Apps Script
                const urls = [
                    'https://script.google.com/macros/s/AKfycbxovA8Uda4iBiJ_t7RscCNBYGmO6nAAV60ejSdwJXy29IvMA-BJLQ1JrlSaHObGjoMo/exec', // Ganti dengan URL pertama
                    'https://script.google.com/macros/s/AKfycbyTvhKS5-JMt1C8iBQfH_97FRmKNflcjpSh-LhFQ8jfumBkZNtIYnu9gpHp48o74zmU4A/exec',
                ];

                // Fetch semua data menggunakan Promise.all
                const responses = await Promise.all(urls.map(url => axios.get(url)));
                const mergedData = responses.flatMap(response => response.data); // Menggabungkan data dari semua API

                setData(mergedData);
                setFilteredData(mergedData); // Set filteredData dengan semua data awal
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Fungsi untuk memfilter data berdasarkan kategori dan pencarian
    const filterData = (category, search) => {
        const filteredByCategory = category === '' ? data : data.filter(item => item.kategori === category);
        const filteredBySearch = filteredByCategory.filter(item => {
            const nameMatches = item.nama && typeof item.nama === 'string' && item.nama.toLowerCase().includes(search.toLowerCase());
            const descriptionMatches = item.deskripsi && typeof item.deskripsi === 'string' && item.deskripsi.toLowerCase().includes(search.toLowerCase());
            const categoryMatches = item.kategori && typeof item.kategori === 'string' && item.kategori.toLowerCase().includes(search.toLowerCase());
            return nameMatches || descriptionMatches || categoryMatches;
        });
        setFilteredData(filteredBySearch);
    };

    // Fungsi untuk memfilter berdasarkan kategori
    const filterByCategory = (category) => {
        setSelectedCategory(category);
        filterData(category, searchText); // Memanggil filterData dengan kategori dan teks pencarian
    };

    // Fungsi untuk mengonversi waktu
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('id-ID', options); // Menggunakan format lokal Indonesia
    };

    // Fungsi untuk merangkai alamat
    const formatAddress = ({ dusun, rtrw, kalurahan, kapanewon }) => {
        return `Dusun ${dusun}, RT/RW ${rtrw}, Kalurahan ${kalurahan}, Kapanewon ${kapanewon}`;
    };


    // Fungsi untuk mengubah link foto 
    const getDirectLink = (driveUrl) => {
        const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
        return match ? `https://drive.google.com/uc?id=${match[1]}` : driveUrl;
    };


    // Fungsi untuk merender data dari drive
    const renderItem = ({ item }) => {
        const imageSource = item.foto ? { uri: getDirectLink(item.foto) } : null;

        return (
            <TouchableOpacity style={styles.itemContainer} onPress={() => setSelectedItem(item)}>
                <View style={styles.cardContent}>
                    {imageSource ? (
                        <Image source={imageSource} style={styles.itemImage} resizeMode="cover" />
                    ) : (
                        <View style={styles.iconContainer}>
                            <FontAwesomeIcon icon={faImage} size={60} color="gray" />
                        </View>
                    )}

                    <View style={styles.textContent}>
                        <Text style={styles.itemTitle}>{item.nama}</Text>
                        <Text style={styles.itemSubtitle}>{formatDate(item.waktu)}</Text>
                        <Text style={styles.itemSubtitle}>{formatAddress(item)}</Text>
                        <Text style={styles.itemCategory}>Kategori: {item.kategori}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const openGoogleMaps = (latitude, longitude) => {
        if (latitude && longitude) {
            const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
            Linking.openURL(url).catch(err => console.error('Failed to open Google Maps:', err));
        } else {
            console.error('Koordinat tidak ditemukan');
        }
    };
    

    // Loading state
    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loaderText}>Loading data...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Container untuk kolom pencarian dan tombol cari */}
            <View style={styles.searchContainer}>
                {/* Input Pencarian */}
                <TextInput
                    style={styles.searchInput}
                    placeholder="Cari..."
                    value={searchText}
                    onChangeText={setSearchText}
                />

                {/* Tombol Cari */}
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => filterData(selectedCategory, searchText)} // Memanggil fungsi filterData
                >
                    <Text style={styles.searchButtonText}>Cari</Text>
                </TouchableOpacity>
            </View>

            {/* Tombol Semua */}
            <TouchableOpacity
                style={[styles.filterTopButton, selectedCategory === '' && styles.filterButtonActive]}
                onPress={() => filterByCategory('')}
            >
                <Text style={styles.filterButtonText}>Semua</Text>
            </TouchableOpacity>

            {/* Grup Tombol Kategori */}
            <View style={styles.filterButtonGroup}>
                <TouchableOpacity
                    style={[styles.filterButton, selectedCategory === 'Kejadian Bencana' && styles.filterButtonActive]}
                    onPress={() => filterByCategory('Kejadian Bencana')}
                >
                    <Text style={styles.filterButtonText}>Kejadian Bencana</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, selectedCategory === 'Mitigasi Bencana' && styles.filterButtonActive]}
                    onPress={() => filterByCategory('Mitigasi Bencana')}
                >
                    <Text style={styles.filterButtonText}>Mitigasi Bencana</Text>
                </TouchableOpacity>
            </View>

            {/* Filtered Data List */}
            <FlatList
                data={filteredData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />

            {selectedItem && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={!!selectedItem}
                    onRequestClose={() => setSelectedItem(null)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{selectedItem.nama}</Text>
                            <Text style={styles.modalText}>{selectedItem.deskripsi}</Text>

                            {/* Tambahkan tombol untuk navigasi ke Google Maps */}
                            <TouchableOpacity
                                style={styles.googleMapsButton}
                                onPress={() => openGoogleMaps(selectedItem.lintang, selectedItem.bujur)}
                            >
                                <Text style={styles.googleMapsButtonText}>Navigasi ke Google Maps</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedItem(null)}>
                                <Text style={styles.closeButtonText}>Tutup</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    cardContent: {
        flexDirection: 'row', // Mengatur tata letak horizontal untuk gambar dan teks
        alignItems: 'center',
    },
    itemImage: {
        width: 80, // Lebar gambar
        height: 80, // Tinggi gambar
        borderRadius: 10, // Membuat sudut gambar melengkung
        marginRight: 15, // Jarak antara gambar dan teks
    },
    textContent: {
        flex: 1, // Agar teks memenuhi ruang yang tersisa
    },
    listContainer: {
        padding: 10,
    },
    searchContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center', // Vertikal center alignment
        marginBottom: 10,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        flex: 1, // Input mengisi ruang yang tersedia
    },
    searchButton: {
        backgroundColor: '#B71C1C',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginLeft: 10, // Memberi jarak antara input dan tombol
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    filterTopButton: {
        backgroundColor: '#b3b3b3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        width: '95%', // Menggunakan 90% agar tidak terlalu mepet dengan sisi kiri dan kanan
        alignItems: 'center',
        alignSelf: 'center', // Membuat tombol berada di tengah
        marginHorizontal: '4%', // Memberikan jarak di sisi kiri dan kanan
        marginBottom: 10,
    },
    filterButtonGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        width: '100%',
    },
    filterButton: {
        backgroundColor: '#b3b3b3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 10,
        width: '45%',
        alignItems: 'center',
    },
    filterButtonActive: {
        backgroundColor: '#B71C1C',
    },
    filterButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    itemContainer: {
        backgroundColor: '#ffffff',
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    itemSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    itemCategory: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
        fontStyle: 'italic',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loaderText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    iconContainer: {
        width: 90,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    googleMapsButton: {
        backgroundColor: '#023048',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    googleMapsButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
        backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%'
    },
    modalTitle: {
        fontSize: 18, fontWeight: 'bold', marginBottom: 10
    },
    modalText: {
        fontSize: 16, marginBottom: 20
    },
    closeButton: {
        backgroundColor: '#B71C1C', padding: 10, borderRadius: 5
    },
    closeButtonText: {
        color: '#fff', textAlign: 'center'
    },
});


export default App;
