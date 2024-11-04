import React, { useContext, useState } from 'react';
import { View, Button, StyleSheet, ActivityIndicator, Text, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter } from "expo-router";
import { errorMessage, successMessage } from './custom/MessageAlert';
import { CartContext } from './context/CartContext';

const { height } = Dimensions.get('window');

const PaymentScreen = ({ Url, setShowWebView }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {emptyCart} = useContext(CartContext); 
   
  // Close WebView and reset state
  const closeWebView = () => {
    setShowWebView(false); // This will hide the WebView by setting showWebView to false in MainScreen
  };

  // Monitor URL changes to detect payment status
  const handleNavigationChange = (navState) => {
    const { url } = navState;
    console.log("Current URL: ", url); // Log the current URL
  
    // Detect success or failure from URL
    if (url.includes('payment-completed')) {

        const timer = setTimeout(() => {
            emptyCart(); 
            //make a request to check payment status first then decide what to do. 
            closeWebView();
            router.push('/history');
            successMessage('Payment Successful'); 
          }, 1000);
        // Clean up the timer if the component unmounts before timeout completes
        return () => clearTimeout(timer);
    } else if (url.includes('payment-canceled')) {
      // Start the timer and only clear it if the component unmounts
      const timer = setTimeout(() => {
        //make a request to check payment status first then decide what to do. 
        closeWebView();
        errorMessage('Payment Failed');
      }, 1000);
  
      // Clean up the timer if the component unmounts before timeout completes
      return () => clearTimeout(timer);
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Display loading indicator */}
      {loading && (
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color="#0000ff"
        />
      )}
      <WebView
        source={{ uri: Url }} // Use the passed URL
        style={styles.webView}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onNavigationStateChange={handleNavigationChange}
        onLoadStart={() => {
          console.log("Loading started");
          setLoading(true);
        }}
        onLoadEnd={() => {
          console.log("Loading finished");
          setLoading(false);
        }}
        startInLoadingState={true}
        userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1"

      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:height,
  },
  webView: {
    flex: 1, // This allows the WebView to take up all available space
    width: '100%', // Ensure it takes full width
    height: '100%', // Ensure it takes full height
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
});

export default PaymentScreen;
