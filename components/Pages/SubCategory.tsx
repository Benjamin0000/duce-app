import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ImageBackground, SafeAreaView, Dimensions} from 'react-native';


const SubCategory = () => {

    return (
        <>
            <SafeAreaView style={styles.safeArea}>
                <Text>This is the sub category page</Text>
            </SafeAreaView>
        </>
    )
}


export default SubCategory; 

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#000'  // To prevent any potential gaps on device edges
    }
})