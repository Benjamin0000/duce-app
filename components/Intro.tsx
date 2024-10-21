import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, SafeAreaView, Platform, StatusBar, Dimensions } from 'react-native';
import Animated, { withSpring, useSharedValue, useAnimatedStyle, withDelay } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
const { height } = Dimensions.get('window');

const Intro = () => {

  // Shared values for animated properties
  const titleOpacity = useSharedValue(0);
  const title2Opacity = useSharedValue(0);
  const subTitleOpacity = useSharedValue(0);
  const imageScale = useSharedValue(0);

  // Animated styles
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: withSpring(0, { damping: 15, stiffness: 100 }) }],
  }));

  const title2Style = useAnimatedStyle(() => ({
    opacity: title2Opacity.value,
    transform: [{ translateY: withSpring(0, { damping: 16, stiffness: 100 }) }],
  }));

  const subTitleStyle = useAnimatedStyle(() => ({
    opacity: subTitleOpacity.value,
    transform: [{ translateY: withSpring(0, { damping: 16, stiffness: 100 }) }],
  }));

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(imageScale.value, { damping: 20, stiffness: 90 }) }],
  }));

  // Trigger animations when the component mounts
  useEffect(() => {
    // Adding delay between each animation
    imageScale.value = withSpring(1, { damping: 10, stiffness: 80 });
    titleOpacity.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 90 }));
    title2Opacity.value = withDelay(400, withSpring(1, { damping: 12, stiffness: 100 }));
    subTitleOpacity.value = withDelay(600, withSpring(1, { damping: 12, stiffness: 110 }));
  }, [imageScale, titleOpacity, title2Opacity, subTitleOpacity]);

  return ( 
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        style={styles.container}
        source={require('../assets/images/food.jpg')}
      >
        {/* Blur Effect for glass look */}
        <BlurView intensity={3} style={styles.blurContainer}>
          <View style={[styles.imageCover, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
            
            {/* Logo Animation */}
            <Animated.View style={[styles.imageContainer, imageStyle]}>
              <Image
                source={require('../assets/images/dulce_logo_2.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </Animated.View>

            {/* Main Title */}
            <Animated.View style={[styles.titleContainer, titleStyle]}>
              <Text style={styles.title}>Welcome to Dulce!</Text>
            </Animated.View>

            {/* Subtitle 1 */}
            <Animated.View style={[styles.title2Container, title2Style]}>
              <Text style={styles.title2}>"The Food House"</Text>
            </Animated.View>

            {/* Subtitle 2 */}
            <Animated.View style={[styles.subTitleContainer, subTitleStyle]}>
              <Text style={styles.subTitle}>Delicious foods at your fingertips.</Text>
            </Animated.View>
          </View>
        </BlurView>
      </ImageBackground>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000'  // To prevent any potential gaps on device edges
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Extra overlay to darken the blur
  },
  imageCover: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    position: 'absolute',
    top: height * 0.5,
  },
  title: {
    fontSize: 32,
    color: 'white',
    textAlign: 'center',
    fontFamily:'SpaceMono'
  },
  title2Container: {
    position: 'absolute',
    top: height * 0.59,
  },
  title2: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    fontFamily:'SpaceMono'
  },
  subTitleContainer: {
    position: 'absolute',
    top: height * 0.65,
  },
  subTitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 20,
    fontStyle: 'italic',
    fontFamily:'SpaceMono'
  },
  imageContainer: {
    position: 'absolute',
    top: height * 0.15,
  },
  logoImage: {
    width: 250,
    height: 250,
  },
});

export default Intro;
