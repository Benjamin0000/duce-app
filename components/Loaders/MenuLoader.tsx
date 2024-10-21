import React from 'react';
import { View, FlatList, Animated, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native'; // Import the theme hook

const SkeletonLoader = () => {
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
    outputRange: [colors.border, colors.card] // Adapt to theme's colors
  });

  const renderSkeletonItem = () => (
    <View style={styles.item}>
      <View style={styles.skeletonImageContainer}>
        {/* Box-shaped image placeholder */}
        <Animated.View style={[styles.skeletonImage, { backgroundColor }]} />
      </View>
      <View style={styles.skeletonTextContainer}>
        {/* Placeholder for item title */}
        <Animated.View style={[styles.skeletonText, { backgroundColor }]} />
        {/* Placeholder for item name (rectangular) */}
        <Animated.View style={[styles.skeletonName, { backgroundColor }]} />
      </View>
    </View>
  );

  return (
    <FlatList
      data={[1, 2, 3, 4, 5, 6, 7, 8, 9]} // Static array for 6 placeholders
      renderItem={renderSkeletonItem}
      keyExtractor={(item, index) => `skeleton-${index}`}
      numColumns={3} // 3 items per row
    />
  );
};

const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / 3 - 20; // Calculate width for 3 items per row with spacing

const styles = StyleSheet.create({
  item: {
    width: itemWidth,
    margin: 10,
    alignItems: 'center',
  },
  skeletonImageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  skeletonImage: {
    width: 100, // Box-shaped image
    height: 100,
    borderRadius: 8, // Slightly rounded corners for a cleaner look
  },
  skeletonTextContainer: {
    alignItems: 'center',
  },
  skeletonText: {
    width: '80%',
    height: 20,
    borderRadius: 4,
    marginBottom: 6, // Space between the two placeholders
  },
  skeletonName: {
    width: '60%',
    height: 20,
    borderRadius: 4,
  },
});

export default SkeletonLoader;
