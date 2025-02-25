import React, { useState, useEffect } from 'react';
import { Image, View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Modal, Linking, RefreshControl } from 'react-native';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faImage, faSort } from '@fortawesome/free-solid-svg-icons';

const App = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchText, setSearchText] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const urls = [
                'https://script.google.com/macros/s/AKfycbwTn0Au1MdEmhW23zUBIwcpsQIyrAJT-rbsQ51FB-uqywI6_qUpeObAOURql1kkEbd0/exec',
                'https://script.google.com/macros/s/AKfycbyTvhKS5-JMt1C8iBQfH_97FRmKNflcjpSh-LhFQ8jfumBkZNtIYnu9gpHp48o74zmU4A/exec',
            ];

            const responses = await Promise.all(urls.map(url => axios.get(url)));
            const mergedData = responses.flatMap(response => response.data);

            const sortedData = sortData(mergedData, 'desc');

            setData(sortedData);
            setFilteredData(sortedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const sortData = (dataArray, order) => {
        return [...dataArray].sort((a, b) => {
            const dateA = new Date(a.waktu);
            const dateB = new Date(b.waktu);
            return order === 'desc' ? dateB - dateA : dateA - dateB;
        });
    };

    const toggleSort = () => {
        const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
        setSortOrder(newOrder);
        setFilteredData(sortData(filteredData, newOrder));
    };

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

    const filterByCategory = (category) => {
        setSelectedCategory(category);
        filterData(category, searchText);
    };

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    };

    const formatAddress = ({ dusun, rtrw, kalurahan, kapanewon }) => {
        return `Dusun ${dusun}, RT/RW ${rtrw}, Kalurahan ${kalurahan}, Kapanewon ${kapanewon}`;
    };

    const getDirectLink = (driveUrl) => {
        if (!driveUrl || typeof driveUrl !== 'string') {
            console.error("Invalid driveUrl:", driveUrl);
            return '';
        }

        const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
        return match ? `https://drive.google.com/uc?id=${match[1]}` : driveUrl;
    };

    const renderItem = ({ item }) => {
        const imageSource = item.foto && typeof item.foto === 'string' ? { uri: getDirectLink(item.foto) } : null;

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

                        {item.kategori === 'Kejadian Bencana' && item.status && (
                            <Text
                                style={[
                                    styles.itemStatus,
                                    {
                                        color: item.status.trim().toLowerCase() === 'sudah ditangani' ? '#52a447' :
                                            item.status.trim().toLowerCase() === 'belum ditangani' ? '#c1111e' :
                                                item.status.trim().toLowerCase() === 'sedang ditangani' ? '#e6b400' :
                                                    'black'
                                    }
                                ]}
                            >
                                Status: {item.status}
                            </Text>
                        )}
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
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Cari..."
                    placeholderTextColor="black"
                    value={searchText}
                    onChangeText={setSearchText}
                />

                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => filterData(selectedCategory, searchText)}
                >
                    <Text style={styles.searchButtonText}>Cari</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.filterButtonGroup1}>
                <TouchableOpacity
                    style={[styles.filterTopButton, selectedCategory === '' && styles.filterButtonActive]}
                    onPress={() => filterByCategory('')}
                >
                    <Text style={styles.filterButtonText}>Semua</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.sortButton} onPress={toggleSort}>
                    <View style={styles.iconSort}>
                        <FontAwesomeIcon icon={faSort} size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
            </View>

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

            <FlatList
                data={filteredData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 15,
    },
    textContent: {
        flex: 1,
    },
    listContainer: {
        padding: 10,
    },
    searchContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        flex: 1,
    },
    sortButton: {
        backgroundColor: '#659aba',
        paddingVertical: 2,
        paddingHorizontal: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    searchButton: {
        backgroundColor: '#B71C1C',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginLeft: 10,
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
        marginBottom: 10,
        width: '80%',
        alignItems: 'center',
    },
    filterButtonGroup1: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        width: '100%',
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
        textAlign: 'center'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center'
    },
    closeButton: {
        backgroundColor: '#B71C1C',
        padding: 10,
        borderRadius: 5
    },
    closeButtonText: {
        color: '#fff',
        textAlign: 'center'
    },
    itemStatus: {
        fontWeight: 'bold',
    }
});

export default App;