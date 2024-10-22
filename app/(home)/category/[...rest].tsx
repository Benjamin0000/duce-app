import { useLocalSearchParams, useNavigation } from 'expo-router';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ImageBackground, SafeAreaView, Dimensions, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme, useIsFocused} from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import HorizontalLoader  from '@/components/Loaders/horizontalLoader';
import { getData, get_url } from '@/components/custom/custom_request' 
import { errorMessage } from '@/components/custom/MessageAlert'
import ErrorComponent from '@/components/custom/ErrorComponent'
const { height, width } = Dimensions.get('window');

export default function ShowCategory() {
  const total_item = 10; 
  const navigation = useNavigation();
  const { colors } = useTheme(); 
  const { rest } = useLocalSearchParams();
  const colorScheme = useColorScheme();

  const [loadingError, setError] = useState({}); 
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 


  const item_id = rest[0]; 
  const item_name = rest[1]; 

  useEffect(() => {
    navigation.setOptions({ headerShown: true, title:item_name });
  }, [navigation]);



  function itemBackground(){
    return colorScheme == 'dark' ? '#111' : '#eee'
  }

  function SkeletonLoader()
  {
      return (
          <FlatList
            data={[...Array(10).keys()]} // Static array for 5 placeholders
            renderItem={()=><HorizontalLoader height={100} />}
            keyExtractor={(item, index) => `loader-${index}`}
            showsVerticalScrollIndicator={false}
          />
      )
  }

  const fetchData = async () => { // Start skeleton loader
    const result = await getData(get_url('/get-items/'+item_id+'?page='+page)); 
    if (result.data) {
      let data = result.data.data;
      let total = data.length;
      console.log(total)
      if(total > 0)
        setItems((prevItems) => [...prevItems, ...result.data]);

      if(total < total_item){
          setHasMore(false)
      }else{   
        setPage(page+1);
      }
    } else if (result.error) {
        setError(result.error);  
        errorMessage(`${result.error.message}`, `${result.error.title}`);
    }
    setLoading(false);
    console.log('yeah')
  };

  const loadMoreItems = () => {
    setError({}); 
    if (hasMore) {
        fetchData();
    }
  };

  useEffect(() => {  
    setLoading(true);
    fetchData(); // Initial load of the first page
  }, []);

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
          <View style={[styles.listContainer, {backgroundColor: colors.background}]}>

            { loading ? 
              <SkeletonLoader/> 
              : 
              <FlatList
                data={items}
                renderItem={({ item }) => (
                      <TouchableOpacity style={[styles.item, { backgroundColor: itemBackground() }]}>
                        <View style={styles.item_con}>
                            <View style={styles.column_one}>
                              <Text style={{ color: colors.text }}>{item.name}</Text>
                              {/* <Text style={{ color: colors.text }}>₦4,500</Text> */}
                            </View>
                            <View style={styles.column_two}>
                              <Image style={styles.item_image} resizeMode="contain" source={{ uri: item.logo }}/>
                            </View>
                        </View>
                      </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  onEndReached={loadMoreItems} // Trigger pagination
                  onEndReachedThreshold={0.5} // Trigger when the user scrolls 50% to the end
                  ListFooterComponent={hasMore ? <SkeletonLoader /> : null} // Show skeleton when loading more
                  numColumns={1}  
              /> 
            }
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
    flex: 1,
    height: height * 100,
    width:'100%',
    padding:0,
   }, 
   item:{
    height:100,
    marginBottom:5,
  },
  item_image:{
    width:'100%',
    height:'100%'
  },
  item_con:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Adjust spacing between columns
    padding: 10,
  },
  column_one: {
    width: '70%', // Adjust width for 2 columns (col-md-6)
    padding: 10,
    justifyContent:'center'
  }, 
  column_two: {
    width: '30%', // Adjust width for 2 columns (col-md-6)
    height: '100%',
    // padding: 0,
  },
  skeleton: {
    width: width - 20,
    height: 100,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
});
