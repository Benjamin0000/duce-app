import React from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Dimensions, Pressable} from 'react-native';
import { CartContext } from '../../components/context/CartContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
const { height, width } = Dimensions.get('window');

export default function Cart() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const { cart, total_cost, setIsCartScreen, deleteFromCart } = useContext(CartContext);
  const { colors } = useTheme(); 
  const router = useRouter();

  // useEffect(() => {
  //   navigation.setOptions({ headerShown: true, title:'All orders' });
  // }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      setIsCartScreen(true); // Show cart screen
      console.log('got into the cart screen')
      return () => setIsCartScreen(false); // Hide when leaving
    }, [setIsCartScreen])
  );

  const navigate = (item:any) => {
    router.push(`/item/${item.id}/${item.name}`);
  };


  function itemBackground(){
    return colorScheme == 'dark' ? '#111' : '#eee'
  }    

  function CompletePayment(){
    return <>
      <View style={{marginBottom:100, marginTop:5}}>
        {cart.length <= 0 ? 
          <View style={{flex:1, alignItems:'center', justifyContent:'center', height:height*0.5}}>
            <Text style={{color:colors.text}}>No Item in cart</Text>
          </View> 
        : 
        <View>
          <View style={styles.item_con}>
            <View>
              <Text style={{color:colors.text, fontSize:20}}>Total Cost</Text>
            </View>
            <View>
              <Text style={{color:colors.text, fontSize:20}}>₦{Number(total_cost).toLocaleString()}</Text>
            </View>
          </View>
          <View style={{padding:20}}>
            <TouchableOpacity style={styles.continue_btn} onPress={()=>router.push('/cart/payment')}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color:'white', fontSize:18}}>Proceed with order</Text>
                <AntDesign style={{marginTop:2}} name="arrowright" size={24} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        }
      </View>
    </>
  }
  return (
    <>
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.listContainer, {backgroundColor: colors.background}]}>
          <FlatList
            data={cart}
            renderItem={({ item }) => (
                  <TouchableOpacity style={[styles.item, { backgroundColor: itemBackground() }]} onPress={()=>navigate(item)}>
                    <View style={styles.item_con}>
                        <View style={{width:'10%', paddingLeft:0, justifyContent:'center'}}>
                            <Text style={{color:'#ff6347'}}>{item.qty}x</Text>
                        </View>
                        <View style={styles.column_2}>
                            <Text style={{ color: colors.text }}>{item.name}</Text>
                            <Text style={{ color: colors.text, fontSize:10 }}>₦{Number(item.price).toLocaleString()}</Text>
                        </View>
                        <View style={styles.column_3}>
                          <Image style={styles.item_image} resizeMode="contain" source={{ uri: item.logo }}/>
                        </View>
                        <Pressable onPress={()=>deleteFromCart(item.id)} style={{width:'6%', justifyContent:'center'}}>
                          <Ionicons color='#ff6347' name='trash' size={20} />
                        </Pressable>
                    </View>
                  </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={1}  
              ListFooterComponent={<CompletePayment/>}
              /> 
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
    justifyContent: 'space-between',
    padding: 10,
  },
  column_2: {
    width: '60%', 
    padding: 10,
    justifyContent:'center'
  }, 
  column_3: {
    width: '24%', 
    height: '100%',
  },
  continue_btn:{
    color:'white',
    backgroundColor: '#ff6347', // Visible background color
    borderRadius: 25,
    padding: 10,
    elevation: 5,       // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    alignItems:'center'
  }
});