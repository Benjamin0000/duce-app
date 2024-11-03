import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, ScrollView, Image, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CartContext } from '../../../components/context/CartContext';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import LoaderOverlay from '../../../components/Loaders/LoaderOverlay'
import CustomSelect from '../../../components/custom/Select'
import { errorMessage } from '@/components/custom/MessageAlert'
import * as Location from 'expo-location';
import { getData, get_url, calculateDistance, postData} from '@/components/custom/custom_request' 
import ErrorComponent from '@/components/custom/ErrorComponent'

const { height } = Dimensions.get('window');

export default function FinishOrder() {
    const [loadingError, setError] = useState({title:'', message:''}); 
    const { colors } = useTheme(); 
    const theme = useColorScheme();
    const [refreshKey, setRefreshKey] = useState(0);
    const {total_cost, branch, authToken, cart} = useContext(CartContext); 
    const [vat, setVat] = useState(0);
    const [loading, setLoading] = useState(false); 
    const [isDelivery, setIsDelivery] = useState(true);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [isPin, setIsPin] = useState(true); 

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [locationPoint, setLocationPoint] = useState(''); 
    const [discountCode, setDiscountCode] = useState(''); 
    const [discounts, setDiscounts] = useState([]); 
    const [validDiscount, setValidDiscount] = useState(false); 
    const [discountError, setDiscountError] = useState(false); 
    const [discount, setDiscount] = useState(0); //in % fetched from server
    const [deliveryCost, setDeliveryCost] = useState(0);  // fetched from server
    const [selectedLocation, setSelectedLocation] = useState({id:0, region: '', cost: 0});
    const [locations, setLocations] = useState([]);

    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [note, setNote] = useState(''); 
    const selectedBranch = branch ? branch.id : ''; 

    useEffect(()=>{
        get_locations_and_discount();
    }, [])



    useEffect(()=>{
        get_locations_and_discount(); 
    }, [refreshKey])


    const handleRetry = () => {
        setRefreshKey(prevKey => prevKey + 1); 
    };

    const handleSetLocation = (region)=>{
        setSelectedLocation(region); 
        setDeliveryCost(region.cost); 
    }

    const get_locations_and_discount = async ()=>{
        setLoading(true)
        setError({title:'', message:''}) 

        console.log('getting locations')
        console.log(cart)
        
        const result = await getData(get_url('/get-discounts/'+selectedBranch));
        let data = result.data; 
        if (data) {
            setLocations(data.locations); 
            setDiscounts(data.discounts); 
            setLoading(false)
        } else if (result.error) {
            errorMessage(`${result.error.message}`, `${result.error.title}`);
            setLoading(false)
            setError(result.error); 
        }
    }

    const getPinLocation = async () => {
        // Request permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          Alert.alert("Permission to access location was denied");
          return;
        }
      
        // Get the current position
        try {
          setLoading(true); 
          let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
            maximumAge: 0,
            timeout: 10000,
          });
      
          const { latitude, longitude } = location.coords;
      
          // Set the location point with the retrieved latitude and longitude
          setLocationPoint(`${latitude},${longitude}`); 
          setLoading(false)
      
        } catch (error) {
          Alert.alert("Error fetching location:", error.message);
          setLoading(false)
        }
    };
      

    const submitOrder = async ()=>{
        let error = false 
        let msg = ""
        if(!name){
            msg = 'Enter a valid full name'
            error = true; 
        }else if(!mobile){
            msg = 'Enter a mobile number'
            error = true; 
        }else if(!validatePhoneNumber(mobile)){
            msg = 'Invalid mobile number'
            error = true; 
        }else if(!email || !validateEmail(email)){
            msg = 'Enter a valid email address'
            error = true; 
        }

        if(error) {
            errorMessage(msg)
            return 
        }

        if(isDelivery){
            if(deliveryAddress.length < 5){
                error = true; 
                msg = "Invalid Delivery address"
            }else if(selectedLocation.id == 0 ){
                msg = "Please set a delivery Location"
                error = true; 
            }            
        }else{
            if( !validateDate(selectedDate) ) return;  
            if( !validateTime(selectedTime) ) return; 
        }

        if (error) {
            errorMessage(msg);
            return;
        }


        let data = {
            'fullname':name,
            'mobile_number':mobile,
            'email':email, 
            'is_pickup':isDelivery ? 'no' : 'yes',
            'address':deliveryAddress,
            'pined_location':locationPoint,
            'selected_location':selectedLocation.id, 
            'pickup_time':selectedTime,
            'pickup_date':selectedDate,
            'discount_code':discountCode,
            'note':note,
            'items':cart.map(({ id, qty, price, name }) => ({ id, qty, price, name }))
        }
        setLoading(true)
        let response = await postData(get_url('/process-order/'+selectedBranch), data, authToken); 

        if (response.data) {
            setLoading(false)
            console.log('result'); 
            console.log(JSON.stringify(response, null, 4));
        }else if(response.error){
            setLoading(false)
            console.log('error')
            console.log(JSON.stringify(response, null, 4));
        }

    }

    function findDiscountByCode(code) {
        return discounts.find(discount => discount.code.toLowerCase() === code.toLowerCase()) || null;
    }

    function handleDiscountCodeInput(code){
        if(code.length <= 0){
            setDiscountError(false); 
            setValidDiscount(false); 
        }
        if(code.length > 2){
            let check = findDiscountByCode(code); 
            if(check){
                setDiscountCode(code);
                setDiscount(Number(check.pct)); 
                setValidDiscount(true); 
                setDiscountError(false);
            }else{
                setDiscount(0); 
                setValidDiscount(false); 
                setDiscountCode(''); 
                setDiscountError(true);
            }
        }
    }

    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    function validatePhoneNumber(phoneNumber) {
        const phonePattern = /^0[1-9][01]\d{8}$/;
        return phonePattern.test(phoneNumber);
    }

    function validateDate(date){
        if (date.toLocaleDateString() < new Date().toLocaleDateString()) {
            errorMessage('Selected pickup time must be between 9 AM and 8 PM');
            return false; 
        }
        return true;  
    }
    
    function validateTime(time) {
        
        const now = new Date();
        const hours = time.getHours();
        const minutes = time.getMinutes();

        // Check if the time is within the range of 9 AM to 9 PM
        if (hours < 9 || hours > 21) {
                errorMessage('Pickup time must be between 9 AM and 8 PM');
            return false;
        }
    
        // Check if the time is in the past (for today)
        if (
            hours < now.getHours() || 
            (hours === now.getHours() && minutes < now.getMinutes())
        ) {
            errorMessage('Pickup time must not be in the past');
            return false;
        }
    
        return true;
    }

    // const calculate_delivery_cost = ()=>{
    //     let delivery_cost = 0;
    //     if( selectedLocation.id != 0){
    //         delivery_cost = selectedLocation.cost; 
    //     }else if(locationPoint != ''){
    //         if(branch.location){
    //             let branch_location = branch.location.split(','); 
    //             let user_location = locationPoint.split(','); 
    //             let km = calculateDistance(branch_location[0], branch_location[1], user_location[0], user_location[1]);
    //             delivery_cost = km * Number(branch.cost_per_km); 
    //         }
    //     }

    //     return Number(delivery_cost); 
    // }

    const totalCostWithDiscount = ()=>{
        let total = Number(total_cost); 
        let Vat = 0; 

        if(discount > 0)
            total -= (discount / 100) * total; 
        
        if(branch.vat > 0){
            Vat = (branch.vat / 100) * total;
            total += Vat;  
        }

        if(isDelivery)
            total += Number(deliveryCost); 
       
        return {
           'total': Number(total).toFixed(2),
           'vat':Vat
        }
    }

    const totalCostNoDiscount = ()=>{
        let total = Number(total_cost);
        let Vat = 0; 

        if(branch.vat > 0){
            Vat = (branch.vat / 100) * total;
            total += Vat;  
        }
        if(isDelivery)
            total += Number(deliveryCost); 
        
        return {
            'total': Number(total).toFixed(2),
            'vat':Vat
        }
    }
    

    const inputStyles = [
        styles.input,
        theme === 'dark' ? styles.inputDark : styles.inputLight,
        // {color:colors.text}
    ];

    // Handle date and time selection
    const onChangeDate = (event, date) => {
        if(!validateDate(date)){
            errorMessage('Selected date cannot be in the past'); 
        }
        setShowDatePicker(false);
        setSelectedDate(date);
    };

    const onChangeTime = (event, time) => {
        if(validateTime(time)){
            setSelectedTime(time);
        }  

        setShowTimePicker(false);
        
    };

    const borderColorForToggle = ()=>{
        return theme == 'dark' ? '#555' : '#ddd'
    }

    const pickUpBackground = ()=>{
        return theme == 'dark' ? '#444' : '#ddd'
    }

    const pickupBorderColor = ()=>{
        return theme == 'dark' ? '#555' : '#eee'
    }

    const locationBorder = ()=>{
        return theme == 'dark' ? '#555' : '#aaa'
    }

    const itemBackground = () => (theme === 'dark' ? '#111' : '#ddd');

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.Container, { backgroundColor: colors.background }]}>

            <LoaderOverlay visible={loading} />

                <ScrollView>
                { loadingError.title ?
                    <ErrorComponent 
                        title={loadingError.title} 
                        message={loadingError.message} 
                        onRetry={handleRetry}
                    />
                    :
                    <View style={{ padding: 10 }}>
                        <View>
                            <Text style={[styles.info_header, {color:colors.text}]}>Branch Info</Text>
                            <View style={[styles.item, { backgroundColor : itemBackground() }]}>
                                <View style={styles.item_con}>
                                    <View style={styles.column_one}>
                                        <Text style={{ color: colors.text, fontWeight: 'bold' }}>{branch.name}.</Text>
                                        <Text style={{ color: colors.text, fontSize: 12 }}>{branch.address}</Text>
                                        <Text style={{ color: colors.text, marginTop: 5 }}>
                                            <Text style={{ fontWeight: 'bold' }}>City:</Text> <Text style={{ fontSize: 12 }}>{branch.city}</Text>
                                        </Text>
                                        <Text style={{color: colors.text }}>
                                            <Text style={{ fontWeight: 'bold' }}>State:</Text> <Text style={{ fontSize: 12 }}>{branch.state}</Text>
                                        </Text>
                                    </View>
                                    <View style={styles.column_two}>
                                        <Image style={styles.item_image} resizeMode="contain" source={{ uri: branch.poster }} />
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text style={[styles.info_header, {color:colors.text}]}>Personal Info</Text>
                            <TextInput style={inputStyles} onChangeText={setName} placeholderTextColor={colors.text} placeholder="Full name"/>
                            <TextInput style={inputStyles} onChangeText={setMobile} placeholderTextColor={colors.text} placeholder="Mobile number"/>
                            <TextInput style={inputStyles} onChangeText={setEmail} placeholderTextColor={colors.text} placeholder="Email address"/>
                        </View>

                        <View>
                            <Text style={[styles.info_header, {color:colors.text}]}>Delivery Info</Text>
                            <View style={styles.toggleContainer}>
                                <TouchableOpacity
                                    style={[styles.toggleButton, isDelivery && styles.activeButton, {borderColor:borderColorForToggle()}]}
                                    onPress={() => setIsDelivery(true)}
                                >
                                    <Text style={[styles.toggleText, {color:isDelivery ?'white':colors.text}]}>Delivery</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.toggleButton, !isDelivery && styles.activeButton, {borderColor:borderColorForToggle()}]}
                                    onPress={() => setIsDelivery(false)}
                                >
                                    <Text style={[styles.toggleText, {color: !isDelivery ?'white':colors.text }]}>Pickup</Text>
                                </TouchableOpacity>
                            </View>

                            {isDelivery ? (
                                <>
                                    <TextInput
                                        style={inputStyles}
                                        placeholder="Delivery Address"
                                        value={deliveryAddress}
                                        onChangeText={setDeliveryAddress}
                                        placeholderTextColor={colors.text}
                                    />

                            <View style={styles.toggleContainer}>
                                <TouchableOpacity
                                    style={[styles.toggleButton, isPin && styles.activeButton, {borderColor:borderColorForToggle()}]}
                                    onPress={() => setIsPin(true)}
                                >
                                    <Text style={[styles.toggleText, {color:isPin ?'white':colors.text}]}>Pin Location</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.toggleButton, !isPin && styles.activeButton, {borderColor:borderColorForToggle()}]}
                                    onPress={() => setIsPin(false)}
                                >
                                    <Text style={[styles.toggleText, {color: !isPin ?'white':colors.text }]}>Set Location</Text>
                                </TouchableOpacity>
                            </View>

                                { isPin? 
                                    <View style={{borderColor :locationBorder(), borderWidth:1, padding:10}}>
                                        <Text style={{textAlign:'center', color: colors.text}}>
                                            { !locationPoint ? "Capture your precise location to help the delivery person find you easily. Very useful if you're ordering for yourself." : 'Location captured' }
                                        </Text>
                                        <TouchableOpacity onPress={getPinLocation}  style={[styles.locationButton, {flexDirection: 'row', justifyContent:'center'}, {backgroundColor: locationPoint ? '#039F5D' : '#444'}]}>
                                            <Text style={[styles.locationButtonText]}>
                                                { locationPoint ? 'Pinned' : 'Pin Location' }
                                            </Text>
                                            <Text>
                                                <EvilIcons name="location" size={23} color="#ff6347" />
                                            </Text>
                                            {/* locationPoint */}
                                        </TouchableOpacity>
                                    </View>
                                    : 
                                    <View>
                                        <CustomSelect
                                            options={locations}
                                            selectedValue={selectedLocation}
                                            onValueChange={(region)=>{handleSetLocation(region)}}
                                            title='Select a location'
                                        />
                                    </View>
                                }
                                </>
                            ) : (
                                <>
                                    <View style={{flexDirection:'row', backgroundColor:pickUpBackground()}}>
                                        <TouchableOpacity style={[styles.datePickerCon, {borderColor :pickupBorderColor()}]} onPress={() => setShowDatePicker(true)}>
                                            <Text style={[styles.datePickerText, {color:colors.text}]}>
                                                Set pickup date
                                            </Text>
                                            <Text style={[styles.datePickerText, {color:colors.text}]}>
                                                {selectedDate.toLocaleDateString()}
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={[styles.datePickerCon, {borderColor :pickupBorderColor()}]} onPress={() => setShowTimePicker(true)}>
                                            <Text style={[styles.datePickerText, {color:colors.text}]}>
                                                Set pickup time
                                            </Text>
                                            <Text style={[styles.datePickerText, {color:colors.text}]}>
                                                {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    {showDatePicker && (
                                        <DateTimePicker
                                            mode="date"
                                            value={selectedDate}
                                            onChange={onChangeDate}
                                        />
                                    )}

                                    {showTimePicker && (
                                        <DateTimePicker
                                            mode="time"
                                            value={selectedTime}
                                            onChange={onChangeTime}
                                        />
                                    )}
                                </>
                            )}
                        </View>

                        <View style={{flexDirection:'row', marginTop:10}}>
                            <View style={{width:'40%', marginTop:10}}>
                                <Text style={[styles.total_text, {color:colors.text}]}>Discount Code:</Text>
                            </View>
                            <View style={{width:'60%'}}>
                                <TextInput style={[inputStyles, {marginBottom:2}]} onChangeText={(code)=>handleDiscountCodeInput(code)} placeholderTextColor={colors.text} placeholder="Enter Code (optional)" />
                                { discountError && <Text style={{color:'red', fontSize:12}}>Invalid Discount Code</Text> }
                                { validDiscount && <Text style={{color:'green', fontSize:12}}>{discount}% Discount Applied</Text> }
                            </View>
                        </View>

                        <View style={{flexDirection:'row', marginTop:10}}>
                            <View style={{width:'50%'}}>
                                <Text style={[styles.total_text, {color:colors.text}]}>VAT</Text>
                            </View>
                            <View style={{width:'50%', alignItems:'flex-end'}}>
                                <Text style={[styles.total_text, {color:colors.text}]}>₦{ Number( discount > 0 ? totalCostWithDiscount().vat : totalCostNoDiscount().vat ).toLocaleString() }</Text>
                            </View>
                        </View>

                        { isDelivery && deliveryCost > 0?
                            <View style={{flexDirection:'row', marginTop:10}}>
                                <View style={{width:'50%'}}>
                                    <Text style={[styles.total_text, {color:colors.text}]}>Delivery Cost</Text>
                                </View>
                                <View style={{width:'50%', alignItems:'flex-end'}}>
                                    <Text style={[styles.total_text, {color:colors.text}]}>₦{Number(deliveryCost).toLocaleString()}</Text>
                                </View>
                            </View> : ''
                        }



                        <View style={{flexDirection:'row', marginTop:10}}>
                            <View style={{width:'50%'}}>
                                <Text style={[styles.total_text, {color:colors.text}]}>Item Cost</Text>
                            </View>
                            <View style={{width:'50%', alignItems:'flex-end'}}>
                                <Text style={[styles.total_text, {color:colors.text}]}>₦{Number(total_cost).toLocaleString()}</Text>
                            </View>
                        </View>

                        <View style={{flexDirection:'row', marginTop:10}}>
                            <View style={{width:'30%'}}>
                                <Text style={[styles.total_text, {color:colors.text}]}>Total Cost</Text>
                            </View>
                            <View style={{width:'70%', alignItems:'flex-end'}}>
                                <Text style={[styles.total_text, {color:colors.text}]}>
                                    ₦{Number(totalCostWithDiscount().total).toLocaleString()} {' '}
                                    { discount ?
                                        <Text style={{textDecorationLine: 'line-through', fontSize:15}}>₦{Number(totalCostNoDiscount().total).toLocaleString()}</Text>
                                    : ''
                                    }
                                </Text>
                            </View>
                        </View>

                        <TextInput style={[inputStyles, {marginTop:15}]}
                            multiline={true}    
                            numberOfLines={3}  
                            textAlignVertical="top"
                            onChangeText={setNote}
                            placeholderTextColor={colors.text} 
                            placeholder="Add a short note (optional)" 
                        />

                        <TouchableOpacity onPress={submitOrder} style={styles.proceedButton}>
                            <Text style={styles.proceedButtonText}>Proceed to checkout</Text>
                        </TouchableOpacity>
                    </View>
                }
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000'  // To prevent any potential gaps on device edges
    },
    item: {
        marginBottom: 5,
        minHeight: 100, // Set a minimum height for each item
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    item_con: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
    },
    column_one: {
        width: '70%',
        justifyContent: 'center',
    },
    column_two: {
        width: '30%',
        height: 100, // Set a height for the image container if needed
        alignItems: 'flex-end',
    },
    item_image: {
        width: '100%',
        height: '100%',
    },
    Container: {
        flex: 1,
        height: height * 100,
        padding: 0,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
        fontSize: 17,
    },
    inputLight: {
        backgroundColor: '#fff',
        color: '#000',
        borderColor: '#ccc',
    },
    inputDark: {
        backgroundColor: '#333',
        color: '#fff',
        borderColor: '#555'
    },
    info_header: {
        fontSize: 20,
        fontFamily:'Ubuntu_500Medium',
        marginBottom: 10,
    },
    toggleContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-around',
        marginVertical: 15,
    },
    toggleButton: {
        // paddingVertical: 10,
        // paddingHorizontal: 20,
        
        borderWidth: 1,
        width:'50%',
        alignItems:'center',
        height:30, 
        justifyContent:'center', 

    },
    activeButton: {
        backgroundColor: '#039F5D',
    },
    toggleText: {
        fontSize: 16,
        color: '#fff',
    },
    locationButton: {
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    locationButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    datePickerText: {
        fontSize: 16,
        fontFamily:'Ubuntu_500Medium',
        marginVertical: 10,
    },
    datePickerCon: {
        width:'50%', 
        borderWidth:1, 
        alignItems:'center'
    },
    proceedButton: {
        backgroundColor: '#039F5D',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
        marginBottom:'30%'
    },
    proceedButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    total_text:{
        fontSize:20,
        fontFamily:'Ubuntu_500Medium'
    }
});
