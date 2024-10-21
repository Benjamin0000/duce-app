import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ImageBackground, SafeAreaView, Dimensions} from 'react-native';

const ShowItem = () => {
   return ( 
        <>
            <SafeAreaView style={styles.safeArea}>
                <Text>This is the show item page</Text>
            </SafeAreaView>
        </>
    )
}

export default ShowItem; 

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#000'  // To prevent any potential gaps on device edges
    }
})