import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Animated, Modal, FlatList } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';
import { CartContext } from '../context/CartContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { successMessage } from '@/components/custom/MessageAlert';

const { height } = Dimensions.get('window');

const SelectBranch = ({ isVisible, setIsVisible }) => {
  const { branch, branches, setBranch } = useContext(CartContext);
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(height)).current; // Initialize animated value
  const colorScheme = useColorScheme();
  const [showModal, setShowModal] = useState(isVisible); // Track the Modal visibility

  useEffect(() => {
    if (isVisible) {
      // Open Modal first and then animate slide up
      setShowModal(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();
    } else {
      // Slide down, then close the Modal
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 500,
        easing: Easing.in(Easing.exp),
        useNativeDriver: true,
      }).start(() => setShowModal(false)); // Close Modal after slide down animation
    }
  }, [isVisible]);

  const itemBackground = () => (colorScheme === 'dark' ? '#111' : '#ddd');

  const choseBranch = (item) => {
    // Safely handle the change of branch
    setBranch((old_item) => {
      // Check if old_item has an id and compare it with the selected item
      if(!old_item)
          return item; 

      if(old_item.id !== item.id){
          successMessage('Branch changed');
          return item; 
      }
      
      return old_item; 
    });
    setIsVisible(false);
  };

  return (
    <>
      {showModal && (
        <Modal transparent={true} animationType="none" visible={showModal}>
          <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setIsVisible(false)} />
          <Animated.View style={[styles.slider, { transform: [{ translateY: slideAnim }], backgroundColor: colors.background }]}>
            <Text style={[styles.header, { color: colors.text }]}>Pick a branch</Text>
            <Text style={[{ color: colors.text, marginBottom: 5 }]}>Choose a nearby branch; your selected branch will be the location where your order is processed.</Text>

            <FlatList
              data={branches}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => choseBranch(item)} style={[styles.item, { backgroundColor: branch && branch.id === item.id ? '#8A4103' : itemBackground() }]}>
                  <View style={styles.item_con}>
                    <View style={styles.column_one}>
                      <Text style={{ color: branch && branch.id === item.id ? 'white' : colors.text, fontWeight: 'bold' }}>{item.name}.</Text>
                      <Text style={{ color: branch && branch.id === item.id ? 'white' : colors.text, fontSize: 12 }}>{item.address}</Text>
                      <Text style={{ color: branch && branch.id === item.id ? 'white' : colors.text, marginTop: 5 }}>
                        <Text style={{ fontWeight: 'bold' }}>City:</Text> <Text style={{ fontSize: 12 }}>{item.city}</Text>
                      </Text>
                      <Text style={{ color: branch && branch.id === item.id ? 'white' : colors.text }}>
                        <Text style={{ fontWeight: 'bold' }}>State:</Text> <Text style={{ fontSize: 12 }}>{item.state}</Text>
                      </Text>
                    </View>
                    <View style={styles.column_two}>
                      <Image style={styles.item_image} resizeMode="contain" source={{ uri: item.poster }} />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              numColumns={1}
              contentContainerStyle={{ paddingBottom: 20 }} // Add some padding at the bottom
            />
          </Animated.View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  slider: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: Dimensions.get('window').height * 0.8, // Set max height to 80% of the screen height
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  item: {
    marginBottom: 5,
    minHeight: 100, // Set a minimum height for each item
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  item_con: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  column_one: {
    width: '70%',
    justifyContent: 'center',
  },
  column_two: {
    width: '30%',
    height: 100, // Set a height for the image container if needed
    alignItems: 'flex-end',
  },
  item_image: {
    width: '100%',
    height: '100%',
  },
  header: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10,
    fontFamily: 'Ubuntu_500Medium',
  },
});

export default SelectBranch;
