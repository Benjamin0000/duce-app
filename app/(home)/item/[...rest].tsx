import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Button, Text, Image, StyleSheet, SafeAreaView, View, Dimensions, ScrollView, Pressable} from 'react-native';
import { useState, useEffect } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { get_url, getData } from '@/components/custom/custom_request';
import HorizontalLoader  from '@/components/Loaders/horizontalLoader';
import { errorMessage } from '@/components/custom/MessageAlert';
import { Collapsible } from '@/components/Collapsible';
import { useTheme } from '@react-navigation/native';
const { height, width } = Dimensions.get('window');

export default function ShowItem() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const { colors } = useTheme(); 
  const { rest } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState({}); 
  const [addons, setAddons] = useState([])

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

  useEffect(() => {
    setLoading(true);
    fetchData(); // Initial load of the first page
    console.log('first mount')
  }, []);

  const fetchData = async () => { // Start skeleton loader
    console.log('request sent')
    const result = await getData(get_url('/get-item/'+item_id)); 
    if (result.data) {
        let item = result.data.item;
        setItem(item); 
        setAddons(item.addons); 
    } else if (result.error) {
        errorMessage(`${result.error.message}`, `${result.error.title}`);
    }
    setLoading(false);
    console.log('request ended')
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
                          <Collapsible  title={addon.title} header_style={{height:50}}>
                              {addon.items.map((item, index)=>{
                                return (
                                  <Pressable style={styles.addon_con} key={index}>
                                    <View style={styles.addon_left}>
                                        <Text style={{color: colors.text}}>{item.name}</Text>
                                    </View>
                                    <View style={styles.addon_right}>
                                      <Image style={styles.addon_image} resizeMode="contain" source={{ uri: item.logo }} />
                                    </View>
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
                      <Text style={{fontSize:18, color: colors.text}}>Number of Packs</Text>
                    </View>
                      
                    <View style={styles.numbers_con}>
                      <Pressable  style={[styles.make_circle,  {marginRight:10, borderColor: colors.text}]}>
                        <Text style={[{color: colors.text, fontSize:20}]}>—</Text>
                      </Pressable>
                      <View style={{height:60, justifyContent:'center'}}>
                        <Text style={{color: colors.text, fontSize:20, fontWeight:'bold'}}>0</Text>
                      </View>
                      <Pressable style={[styles.make_circle, {marginLeft:10, borderColor: colors.text}]}>
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
    marginBottom:5
  },
  addon_left: {
    width: '70%',
  },
  addon_right: {
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center', // Centers the image horizontally
    padding: 5, // Adds some padding to give the image space
  },
  addon_image: {
    width: 50, // Set the image width
    height: 50, // Set the image height
  },
});
