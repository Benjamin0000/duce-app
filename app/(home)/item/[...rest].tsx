import { useLocalSearchParams, useNavigation} from 'expo-router';
import { Text, Image, StyleSheet, SafeAreaView, View, Dimensions, ScrollView, Pressable} from 'react-native';
import { useState, useEffect, useContext, useRef } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { get_url, getData } from '@/components/custom/custom_request';
import HorizontalLoader  from '@/components/Loaders/horizontalLoader';
import { errorMessage } from '@/components/custom/MessageAlert';
import { Collapsible } from '@/components/Collapsible';
import { useIsFocused, useTheme } from '@react-navigation/native';
import { CartContext } from '../../../components/context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

const { height, width } = Dimensions.get('window');

export default function ShowItem() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const { cart, getItem, addToCart, removeFromCart, deleteFromCart } = useContext(CartContext);

  const { colors } = useTheme(); 
  const { rest } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState({}); 
  const [addons, setAddons] = useState([])
  const [openedAddons, setOpenedAddons] = useState([]); 
  const [cart_item, setCartItem] = useState({}); 
  const addOnsInCart = useRef([]);
  const router = useRouter();
  const isFocused = useIsFocused();
  
  const item_id = rest[0]; 
  const item_name = rest[1]; 

  function itemBackground(){
    return colorScheme == 'dark' ? '#111' : '#eee'
  }

  function SkeletonLoader()
  {
      return (
        <>
          <HorizontalLoader height={200} style={{marginBottom:5}} />
          <HorizontalLoader height={100} />
        </>
      )
  }

  useEffect(() => {
    navigation.setOptions({ headerShown: true, title:item_name });
  }, [navigation]);

  useEffect(()=>{
    console.log('cart updated in show view')
    let theItem = getItem(item.id)
    setCartItem(theItem)
    console.log(addOnsInCart.current)
  }, [cart])

  useEffect(() => {
    if(isFocused){
      console.log('show item page')
      setLoading(true);
      fetchData(); // Initial load of the first page
    }
  }, [isFocused]);

  const fetchData = async () => { // Start skeleton loader
    const result = await getData(get_url('/get-item/'+item_id)); 
    if (result.data) {
        let item = result.data.item;
        if(!item){
          errorMessage('Item not found');
          router.push('/(home)/');
          return; 
        }
        setItem(item); 
        setAddons(item.addons);
        let theItem = getItem(item.id)
        setCartItem(theItem)

        addOnsInCart.current = item.addons.reduce((result, adds) => {
          adds.items.forEach(add_item => {
            const isInCart = cart.some(cart_item => cart_item.id === add_item.id);
            const alreadyAdded = result.includes(adds.id);
            if (isInCart && !alreadyAdded) {
              result.push(adds.id);
            }
          });
          return result;
        }, []);

    } else if (result.error) {
        errorMessage(`${result.error.message}`, `${result.error.title}`);
    }
    setLoading(false);
  };


  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.content_con, {backgroundColor: colors.background}]}>
            { loading ?
                <SkeletonLoader/>
              :
              <>
                <View style={[styles.item_content_con, { backgroundColor: itemBackground() }]}>
                  <View style={styles.image_con}>
                      <Image style={styles.image} resizeMode="contain" width={100} source={{ uri: item.logo }} />
                  </View>

                  <View style={styles.des_con}>
                    <View style={{alignItems:'center'}}>
                      <Text style={[{ color: colors.text }, styles.item_name]}>{item.name}</Text>
                      <Text style={[{ color: colors.text }, styles.item_price]}>₦{Number(item.selling_price).toLocaleString()}</Text> 
                    </View>
                    <View style={{alignItems:'center'}}>
                      <Text style={[{ color: colors.text }, styles.item_des]}>{item.des}</Text>
                    </View>
                  </View>
                </View>

                <ScrollView>
                    <View style={{marginTop:10}}>
                      
                       { addons.map((addon, index) => (
                       
                        <View style={{marginBottom: 3}} key={index}>
                          <Collapsible open={addOnsInCart.current.includes(addon.id)} title={addon.title} header_style={{height:50}}>
                              {addon.items.map((item, index)=>{
                                let add = getItem(item.id); 
                               
                                return (
                                  <Pressable onPress={()=>addToCart(item)} style={styles.addon_con} key={index}>
                                    { add.qty ?
                                      <View style={{width:'10%', paddingLeft:5}}>
                                        <Text style={{color:'#ff6347'}}>{add.qty}x</Text>
                                      </View> : ''
                                    }
                                    <View style={{width: add.qty ? '54%' : '70%', padding:5}}>
                                        <Text style={{color: colors.text}}>{item.name}</Text>
                                        <Text style={{color: colors.text, fontSize:10}}>₦{Number(item.selling_price).toLocaleString()}</Text>
                                    </View>

                                    <View style={[styles.addon_right, {width: '30%' } ]}>
                                      <Image style={styles.addon_image} resizeMode="contain" source={{ uri: item.logo }} />
                                    </View>

                                    { add.qty ?
                                      <Pressable onPress={()=>deleteFromCart(add.id)} style={{width:'6%'}}>
                                        <Ionicons color='#ff6347' name='trash' size={20} />
                                      </Pressable> : ''
                                    }
                                  </Pressable>
                                )
                              })}
                          </Collapsible>
                          </View>
                        )) 
                      }
                    </View>

                  <View style={{height: 230}}>
                    <View style={{alignItems:'center', marginTop:20}}>
                      <Text style={{fontSize:18, color: colors.text}}>Quantity</Text>
                    </View>
                      
                    <View style={styles.numbers_con}>
                      <Pressable onPress={()=>removeFromCart(item.id)}  style={[styles.make_circle,  {marginRight:10, borderColor: colors.text}]}>
                        <Text style={[{color: colors.text, fontSize:20}]}>—</Text>
                      </Pressable>
                      <View style={{height:60, justifyContent:'center'}}>
                        <Text style={{color: colors.text, fontSize:20, fontWeight:'bold'}}>{cart_item.qty ??  0}</Text>
                      </View>
                      <Pressable onPress={()=>addToCart(item)} style={[styles.make_circle, {marginLeft:10, borderColor: colors.text}]}>
                        <Text style={[{color: colors.text, fontSize:20}]}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                </ScrollView>
              </>
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
  content_con: {
    flex:1,
  }, 
  item_content_con: {
    
  },
  image_con: {
    height:height * 0.2,
    padding:10,
    justifyContent:'center',
    alignContent:'center'
  }, 
  image:{
    width:'100%',
    height:'100%'
  },
  des_con:{
    padding:10, 
  },
  item_name:{
    fontSize:20,
    fontFamily:'Ubuntu_500Medium'
  }, 
  item_price:{
    fontSize:20,
    fontFamily: 'Ubuntu_500Medium',
  }, 
  item_des:{
    fontFamily:'SpaceMono',
    marginTop:10
  },
  numbers_con: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:'center',
    alignItems:'center',
    marginTop:15,
    marginBottom:15
  },
  make_circle : {
    borderWidth:1,
    borderRadius:30,
    padding:5, 
    alignItems:'center',
    justifyContent:'center',
    width: 60,  
    height: 60,
  },
  addon_con:{
    flexDirection: 'row',
    justifyContent: 'space-between', // Space between text and image
    alignItems: 'center',
    minHeight: 50,
    marginBottom:5,
  },
  addon_left: {
    width: '70%',
  },
  addon_right: {
    justifyContent: 'center',
    alignItems: 'center', // Centers the image horizontally
    padding: 5, // Adds some padding to give the image space
  },
  addon_image: {
    width: 50, // Set the image width
    height: 50, // Set the image height
  },
});
