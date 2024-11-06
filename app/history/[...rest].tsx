import React, { useContext, useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation} from 'expo-router';
import { useRouter } from 'expo-router';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useIsFocused, useTheme } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { CartContext } from '@/components/context/CartContext';
import { errorMessage } from '@/components/custom/MessageAlert';
import { get_url, getData, SkeletonLoader, SkeletonMiniLoader } from '@/components/custom/custom_request';

const { height, width } = Dimensions.get('window');

export default function CartHistory() {
  const total_item = 10; 
  const {authToken} = useContext(CartContext); 
  const [cart, setCart] = useState([]); 
  const colorScheme = useColorScheme();
  const { rest } = useLocalSearchParams();
  const { colors } = useTheme(); 
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const id = rest[0]; 
  const orderID = rest[1]; 

  useEffect(() => {
    navigation.setOptions({ headerShown: true, title:'Order: '+orderID.toUpperCase() });
  }, [navigation]);


  function itemBackground(){
    return colorScheme === 'dark' ? '#111' : '#eee';
  }

  const fetchCart = async () => {
    const result = await getData(get_url(`/history/cart/${id}?page=${page}`), authToken.token);
    if (result.data) {
      let data = result.data.items;
      let total = data.length;

      console.log(data)

      if (total > 0) {
        setCart((prevItems) => [...prevItems, ...data]);
      }
      setHasMore(total >= total_item);
      setPage(page + 1);
      setLoading(false);
    } else if (result.error) {
      errorMessage(`${result.error.message}`, `${result.error.title}`);
      setLoading(false);
    }
  };

  const loadMoreItems = () => {
    if (hasMore) fetchCart();
  };

  useEffect(() => {
    console.log('yeah is focussed in history')
    if(isFocused){
      setLoading(true);
      fetchCart(); // Initial load of the first page
    }
  }, [isFocused]);

  function FooterComponent() {
    return (
      <>
        <History />
        {hasMore ? <SkeletonMiniLoader /> : null}
      </>
    );
  }

  function History() {
    return (
      <View style={{ marginBottom: 100, marginTop: 5 }}>
        <View style={{ padding: 20 }}>
          <TouchableOpacity style={styles.continue_btn} onPress={() => router.push('/history')}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ color: 'white', fontSize: 18 }}>Order history</Text>
              <AntDesign style={{ marginTop: 2 }} name="arrowright" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.listContainer, { backgroundColor: colors.background }]}>
        {loading ? (
          <SkeletonLoader />
        ) : (
          <FlatList
            data={cart}
            renderItem={({ item }) => (
              <View style={[styles.item, { backgroundColor: itemBackground() }]}>
                <View style={styles.item_con}>
                  <View style={{ width: '10%', paddingLeft: 0, justifyContent: 'center' }}>
                    <Text style={{ color: '#ff6347' }}>{item.qty}x</Text>
                  </View>
                  <View style={styles.column_2}>
                    <Text style={{ color: colors.text }}>{item.item_name}</Text>
                    <Text style={{ color: colors.text, fontSize: 10 }}>
                      ₦{Number(item.price).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.column_3}>
                    <Image
                      style={styles.item_image}
                      resizeMode="contain"
                      source={{ uri: item.logo }}
                      onError={(e) => console.log("Image failed to load:", e.nativeEvent.error)}
                    />
                  </View>
                </View>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={loadMoreItems}
            onEndReachedThreshold={0.5}
            ListFooterComponent={<FooterComponent />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  item: {
    height: 100,
    marginBottom: 5,
  },
  item_image: {
    width: 80, // Set a fixed width
    height: 80, // Set a fixed height
  },
  item_con: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  column_2: {
    width: '60%',
    padding: 10,
    justifyContent: 'center',
  },
  column_3: {
    width: '30%',
    height: '100%',
  },
  continue_btn: {
    backgroundColor: '#ff6347',
    borderRadius: 25,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    alignItems: 'center',
  },
});
