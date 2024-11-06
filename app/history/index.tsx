import { Button, Text, View, StyleSheet, SafeAreaView, FlatList, Dimensions } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { useIsFocused, useTheme } from '@react-navigation/native';
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
  const isFocused = useIsFocused();
  
  const navigate = (item) => {
    router.push(`/history/${item.id}/${item.orderID}`);
  };

  function orderStatus(item) {
    const statuses = {
      delivery: {
        0: { label: 'Waiting', color: '#F5A623' },         // Amber for "Waiting"
        1: { label: 'Processing', color: '#4A90E2' },       // Blue for "Processing"
        2: { label: 'Out for Delivery', color: '#F8E71C' }, // Yellow for "Out for Delivery"
        3: { label: 'Delivered', color: '#7ED321' }         // Green for "Delivered"
      },
      pickup: {
        0: { label: 'Waiting', color: '#F5A623' },          // Amber for "Waiting"
        1: { label: 'Processing', color: '#4A90E2' },       // Blue for "Processing"
        2: { label: 'Ready for pickup', color: '#BD10E0' }, // Purple for "Ready for Pickup"
        3: { label: 'Back to stock', color: '#D0021B' },    // Red for "Back to Stock"
        4: { label: 'Picked', color: '#7ED321' }            // Green for "Picked"
      }
    };
  
    const mode = item.is_pickup === 0 ? 'delivery' : 'pickup';
    const { label, color } = statuses[mode][item.status] || { label: 'Unknown', color: '#000' };
  
    return <Text style={{ color }}>{label}</Text>;
  }
  


  const fetchOrders = async ()=>{
      const result = await getData(get_url('/get-orders/?page='+page), authToken.token);
      if (result.data) {
        let data = result.data.orders;
        let total = data.length;
        // console.log('orders')
        // console.log(data)
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


  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  
  function formatTime(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format, `0` becomes `12`
    return `${hours}:${minutes} ${ampm}`;
  }

  const loadMoreItems = () => {
    if (hasMore) {
        fetchOrders();
    }
  };

  useEffect(() => {
    if(isFocused){
      console.log('focusing onthe history screen ')
      setOrders([])
      setLoading(true);
      fetchOrders(); // Initial load of the first page
    }
  }, [isFocused]);

  // Renders each order item in the FlatList
  const renderItem = ({ item }) => (
    <View style={[styles.orderCard, { backgroundColor: colors.card }]}>
      <Text style={[styles.orderId, {color:colors.text}]}>Order ID: {item.orderID.toUpperCase()}</Text>
      <Text style={[styles.status, {color:colors.text}]}>Order Status: {orderStatus(item)} </Text>
      <Text style={[styles.status, {color:colors.text}]}>Discount:  {item.discount}%</Text>
      

      {item.vat_cost ? 
       <Text style={[styles.status, {color:colors.text}]}>VAT:  ₦{Number(item.vat_cost).toLocaleString()}</Text>
      : ''
      }
      { item.is_pickup == 0? 
        <Text style={[styles.status, {color:colors.text}]}>Delivery Cost: ₦{Number(item.delivery_fee).toLocaleString()} </Text>
          : null
      }
      <Text style={[styles.status, {color:colors.text}, {fontWeight:'bold'}]}>Total Paid: ₦{Number(item.total_cost).toLocaleString()}</Text>
      
      <View style={{width:'50%'}}>
       <Button onPress={()=>navigate(item)} color={'#ff6347'} title="View Cart"/>
      </View>
        { item.is_pickup == 0 ? 
          <View style={{marginTop:15}}>
            <Text style={[styles.orderId, {color:colors.text}]}>Delivery Personel</Text>
            <Text style={{color:colors.text, fontSize:15, fontWeight:'bold'}}>John malague</Text>
            <Text style={{color:colors.text}}>Contact Details</Text>
            <Text style={{color:colors.text}}>08044546543, 09088765432</Text>
          </View>
          : 
          <View style={{marginTop:12}}>
            <Text style={{color:colors.text}}>Pickup Date: {formatDate(item.pickup_date)}</Text>
            <Text style={{color:colors.text}}>Pickup Time: {formatTime(item.pickup_time)}</Text>
          </View>
        }


    </View>
  );

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          { loading ? 
                <SkeletonLoader/> 
              : 
              <>
              { 
                orders.length == 0? 
                <Text style={{textAlign:'center', fontSize:20, marginTop:20, color:colors.text}}>No history to show</Text> 
              : ''}
              <FlatList
                data={orders}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                onEndReached={loadMoreItems} // Trigger pagination
                onEndReachedThreshold={0.5} // Trigger when the user scrolls 50% to the end
                ListFooterComponent={hasMore ? <SkeletonMiniLoader /> : null} // Show skeleton when loading more
                numColumns={1} 
              />
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

