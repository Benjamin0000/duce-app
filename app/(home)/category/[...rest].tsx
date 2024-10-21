import { Stack , useLocalSearchParams, useNavigation } from 'expo-router';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ImageBackground, SafeAreaView, Dimensions, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme, useIsFocused} from '@react-navigation/native';
const { height, width } = Dimensions.get('window');

export default function ShowCategory() {
  const navigation = useNavigation();
  const { colors } = useTheme(); 
  const { rest } = useLocalSearchParams();
  

  useEffect(() => {
    navigation.setOptions({ headerShown: true, title:rest[1] });
  }, [navigation]);


  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.listContainer, {backgroundColor: colors.background}]}>
          
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000'  // To prevent any potential gaps on device edges
  },
  listContainer: {
    height: height * 100,
    width:'100%',
    padding:0,
   }
});
