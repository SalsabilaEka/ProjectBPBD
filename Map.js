import React from 'react';
import { WebView } from 'react-native-webview';

const MapScreen = () => {
    return (
        <WebView
            source={{
                uri: 'https://sigap-peta.vercel.app/home',
            }}
        />
    );
};

export default MapScreen;
