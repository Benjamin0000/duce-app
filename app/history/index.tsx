import { Button, Text, View, StyleSheet, SafeAreaView, FlatList, Dimensions } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { useTheme } from '@react-navigation/native';
import { SkeletonLoader, SkeletonMiniLoader, getData, get_url } from '@/components/custom/custom_request' 
import { CartContext } from '../../components/context/CartContext';
import { errorMessage } from '@/components/custom/MessageAlert';
import { useRouter } from 'expo-router';

export default function History() {
  const total_item = 10; 
  const {authToken} = useContext(CartContext); 
  const { colors } = useTheme();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 
  const [orders, setOrders] = useState([]); 
  const router = useRouter();

  const navigate = (id) => {
    router.push('/history/'+id);
  };


  function order_status(id)
  {
    if(id == 0)
        return <Text style={{color:'#12C9E7'}}>Waiting</Text>
    else if(id == 1)
      return <Text style={{color:'#12E75F'}}>Processing</Text>
    else if(id == 2)
      return <Text style={{color:'#12E7C0'}}>Out for Delivery</Text>
    else
      return <Text style={{color:'#12E75F'}}>Delivered</Text>
  }


  const fetchOrders = async ()=>{
      const result = await getData(get_url('/get-orders/?page='+page), authToken.token);
      if (result.data) {
        let data = result.data.orders;
        let total = data.length;
        console.log('orders')
        console.log(data)
        if(total > 0)
            setOrders((prevItems) => [...prevItems, ...data]);

        if(total < total_item){
            setHasMore(false)
        }else{   
          setPage(page+1);
        }
        setLoading(false)
      } else if (result.error) {
          errorMessage(`${result.error.message}`, `${result.error.title}`);
          setLoading(false)
      }
  }


  const loadMoreItems = () => {
    if (hasMore) {
        fetchOrders();
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOrders(); // Initial load of the first page
  }, []);

  // Renders each order item in the FlatList
  const renderItem = ({ item }) => (
    <View style={[styles.orderCard, { backgroundColor: colors.card }]}>
      <Text style={[styles.orderId, {color:colors.text}]}>Order ID: {item.orderID}</Text>
      <Text style={[styles.status, {color:colors.text}]}>Order Status: {order_status(item.status)} </Text>
      <Text style={[styles.status, {color:colors.text}]}>Discount:  {item.discount}%</Text>
      <Text style={[styles.status, {color:colors.text}]}>Delivery Cost: ₦{Number(item.delivery_fee).toLocaleString()} </Text>


      {/* <Text style={[styles.status, {color:colors.text}]}>VAT:  ₦{Number(item.vat_cost).toLocaleString()}</Text> */}
      <Text style={[styles.status, {color:colors.text}]}>Total Paid: ₦{Number(item.total_cost).toLocaleString()}</Text>
      
      <View style={{width:'50%'}}>
       <Button onPress={()=>navigate(item.id)} color={'#ff6347'} title="View Cart"/>
      </View>
      
      <View style={{marginTop:15}}>
        <Text style={[styles.orderId, {color:colors.text}]}>Delivery Personel</Text>
        <Text style={{color:colors.text, fontSize:15, fontWeight:'bold'}}>John malague</Text>
        <Text style={{color:colors.text}}>Contact Details</Text>
        <Text style={{color:colors.text}}>08044546543, 09088765432</Text>
      </View>


    </View>
  );

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          { loading ? 
                <SkeletonLoader/> 
              : 
              <FlatList
                data={orders}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                onEndReached={loadMoreItems} // Trigger pagination
                onEndReachedThreshold={0.5} // Trigger when the user scrolls 50% to the end
                ListFooterComponent={hasMore ? <SkeletonMiniLoader /> : null} // Show skeleton when loading more
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
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    // paddingVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  orderCard: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  status: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
});

