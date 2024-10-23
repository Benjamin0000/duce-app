import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ImageBackground, SafeAreaView, Dimensions} from 'react-native';
import { useState, useEffect} from 'react';
import { BlurView } from 'expo-blur';
import { useTheme, useIsFocused} from '@react-navigation/native';
import { useRouter } from "expo-router";
import { useColorScheme } from '@/hooks/useColorScheme';
import MenuLoader from '@/components/Loaders/MenuLoader';
import { errorMessage } from '@/components/custom/MessageAlert'
import ErrorComponent from '@/components/custom/ErrorComponent'
import { getData, get_url} from '@/components/custom/custom_request' 

const { height, width } = Dimensions.get('window');
const screenWidth = width;
const numColumns = 3;
const itemMargin = 5;
const itemWidth = (screenWidth - itemMargin * (numColumns + 1)) / numColumns;
const [ITEM , CATEGORY] = [1, 0]; 

function LogoTitle() {
  return (
    <Image style={styles.image} source={require('../../assets/images/dulce_logo_2.png')} />
  );
}

const Index = () => {
  const { colors } = useTheme(); 
  const [categories, setCategories] = useState([]); 
  const [loadingMenu, setLoadingMenu] = useState(true); 
  const [loadingError, setError] = useState({}); 
  const isFocused = useIsFocused();
  const colorScheme = useColorScheme();
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();
 

  const navigate = (item:any) => {
    if(item.type === ITEM)
      router.push(`/item/${item.id}/${item.name}`);
    else 
      router.push(`/category/${item.id}/${item.name}`);
  };

  function itemBackground(){
    return colorScheme == 'dark' ? '#111' : '#eee'
  }

  const handleRetry = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  const fetchData = async () => {
    setError({})
    const result = await getData(get_url('/get-category'));
    if (result.data) {
      setCategories(result.data);
      setLoadingMenu(false); 
    } else if (result.error) {
      setError(result.error);
      errorMessage(`${result.error.message}`, `${result.error.title}`);
    }
  };

  useEffect(()=>{ 
    setLoadingMenu(true)
    if(isFocused){
      fetchData();
    }
  }, [isFocused, refreshKey])

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <ImageBackground style={styles.backgroundImage}
            source={require('../../assets/images/food_bg.jpg')}
            resizeMode="cover">
            <BlurView intensity={3} style={styles.blurContainer}> 
              <LogoTitle/> 
            </BlurView> 
        </ImageBackground>

        <View style={[styles.listContainer, {backgroundColor: colors.background}]}>
          <Text style={[styles.pageHeader, { color: colors.text }]}>Our menu</Text>
          <View style={styles.itemContainer}>
            { loadingError.title ?
              <ErrorComponent 
                title={loadingError.title} 
                message={loadingError.message} 
                onRetry={handleRetry}
              />
            :
            <>
              { loadingMenu ? 
                <MenuLoader/>
              : 
                <FlatList
                  data={categories}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                    style={[styles.item, { backgroundColor: itemBackground() }]} 
                    onPress={()=>navigate(item)}
                  >
                    <View>
                      <Image resizeMode="contain" style={styles.image_item} source={{ uri: item.logo }} />
                    </View>
                    <View>
                      <Text numberOfLines={1} style={[styles.item_title, { color: colors.text }]}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                    
                  )}
                  keyExtractor={item => item.id}
                  numColumns={3}  
                />
              }
            </>
            }
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

export default Index; 

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000'  // To prevent any potential gaps on device edges
  },
  backgroundImage: {
    width:'100%',
    height: height * 0.4, 
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Extra overlay to darken the blur
  }, 
  mainContainer: {
    
  },
  image: {
    width: 100,
    height: 100,
  },
  listContainer: {
   height: height * 0.6,
   width:'100%',
   padding:0,
  }, 
  pageHeader: {
    marginTop:10,
    fontSize: 32,
    textAlign:'center',
    fontFamily:'SpaceMono'
  },

  item:{
    padding: 10,
    width:itemWidth,
    margin:itemMargin / 2,
    alignItems:'center'
  },
  itemContainer:{
    flex: 1,  
    marginTop:20,
    marginBottom:20,
    height:'100%',
    width:'100%'
  },
  item_title: {
    fontSize:15,
  },
  image_item: {
    width:50,
    height:50
  }
});
