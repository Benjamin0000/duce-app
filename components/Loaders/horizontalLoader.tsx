import React from 'react';
import { View, FlatList, Animated, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native'; // Import the theme hook

const VerticalLoader = ({ height = 20, ...rest }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const { colors } = useTheme(); // Get theme colors (light or dark)

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.card], // Adapt to theme's colors
  });


  return (
    <View style={styles.loaderContainer}>
        <Animated.View style={[styles.loader, { height, backgroundColor }]} />
    </View>
    // <FlatList
    //   data={[1, 2, 3, 4, 5]} // Static array for 5 placeholders
    //   renderItem={renderSkeletonItem}
    //   keyExtractor={(item, index) => `loader-${index}`}
    //   showsVerticalScrollIndicator={false}
    //   contentContainerStyle={styles.contentContainer}
    // />
  );
};

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  contentContainer: {
    // padding: 10, // Optional padding for the container
  },
  loaderContainer: {
    width: screenWidth, // Full width minus margins
    marginBottom: 10, // Space between loaders
    borderRadius: 8, // Optional for rounded corners
  },
  loader: {
    width: '100%', // Full width of the parent container
    borderRadius: 4, // Rounded edges for smoother appearance
  },
});

export default VerticalLoader;
