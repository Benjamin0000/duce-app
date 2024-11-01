import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ImageBackground, SafeAreaView, Dimensions, Pressable} from 'react-native';
import { useState, useEffect, useContext} from 'react';
import { BlurView } from 'expo-blur';
import { useTheme, useIsFocused} from '@react-navigation/native';
import { useRouter } from "expo-router";
import { useColorScheme } from '@/hooks/useColorScheme';
import MenuLoader from '@/components/Loaders/MenuLoader';
import { errorMessage } from '@/components/custom/MessageAlert'
import ErrorComponent from '@/components/custom/ErrorComponent'
import { getData, get_url} from '@/components/custom/custom_request' 
import { CartContext } from '../../components/context/CartContext';
import SelectBranch from '@/components/custom/SelectBranch';
import { Ionicons } from '@expo/vector-icons';

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
  const {branch, setBranches, setBranch} = useContext(CartContext);
  const { colors } = useTheme(); 
  const [categories, setCategories] = useState([]); 
  const [loadingMenu, setLoadingMenu] = useState(true); 
  const [loadingError, setError] = useState({}); 
  const isFocused = useIsFocused();
  const colorScheme = useColorScheme();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showBranches, setShowBranches] = useState(false); 
  const router = useRouter();
 

  const navigate = (item:any) => {
    if(!branch){
      toggleBranches(); 
      return ;
    }

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
    const selectedBranch = branch ? branch.id : ''; 
    const result = await getData(get_url('/get-category/'+selectedBranch));
    if (result.data) {
      setCategories(result.data.items);
      setLoadingMenu(false);
      setBranches(result.data.branches);
      
      if(result.data.branches.length == 1){
        setBranch(result.data.branches[0]); 
      }
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
  }, [isFocused, refreshKey, branch])

  const toggleBranches = () => {
    setShowBranches(!showBranches);
  };

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

        <SelectBranch isVisible={showBranches} setIsVisible={setShowBranches} />

        <TouchableOpacity onPress={toggleBranches} style={styles.branch_select_button}>
          <Text style={{color:'white', fontWeight: 'bold', fontSize:16}}>Branches <Ionicons name='home-outline'/></Text>
        </TouchableOpacity>
    
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
  }, 
  branch_select_button: {
    position: 'absolute',
    bottom: 2,         // Adjust this to see the CartIcon more clearly
   // left: 10,         // Adjust this if it's too close to the edge
    backgroundColor: '#ff6347', // Visible background color
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    padding: 10,
    zIndex: 100,        // Ensures it stays above other elements
    elevation: 5,       // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    justifyContent:'center',
    flexDirection: 'row',
  }
});
