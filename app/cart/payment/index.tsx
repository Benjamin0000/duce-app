import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, ScrollView, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CartContext } from '../../../components/context/CartContext';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import LoaderOverlay from '../../../components/Loaders/LoaderOverlay'

const { height } = Dimensions.get('window');

export default function FinishOrder() {
    const { colors } = useTheme(); 
    const theme = useColorScheme();
    const {total_cost} = useContext(CartContext); 
    const [loading, setLoading] = useState(false); 
    const [isDelivery, setIsDelivery] = useState(true);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [discountCode, setDiscountCode] = useState(''); 
    const [discount, setDiscount] = useState(0); 
    const [deliveryCost, setDeliveryCost] = useState(20); 


    const totalCostWithDiscount = ()=>{
        let total = total_cost; 

        if(discount > 0){
            total -= (discount / 100) * total; 
        }

        if(isDelivery){
            total += deliveryCost; 
        }
        return total; 
    }

    const totalCostNoDiscount = ()=>{
        let total = total_cost;
        if(isDelivery){
            total += deliveryCost; 
        }
        return total; 
    }
    

    const inputStyles = [
        styles.input,
        theme === 'dark' ? styles.inputDark : styles.inputLight,
        // {color:colors.text}
    ];

    // Handle date and time selection
    const onChangeDate = (event, date) => {
        setShowDatePicker(false);
        if (date) setSelectedDate(date);
    };

    const onChangeTime = (event, time) => {
        setShowTimePicker(false);
        if (time) setSelectedTime(time);
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


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.Container, { backgroundColor: colors.background }]}>

            <LoaderOverlay visible={loading} />

                <ScrollView>
                    <View style={{ padding: 10 }}>
                        <View>
                            <Text style={[styles.info_header, {color:colors.text}]}>Personal Info</Text>
                            <TextInput style={inputStyles} placeholderTextColor={colors.text} placeholder="Full name" />
                            <TextInput style={inputStyles} placeholderTextColor={colors.text} placeholder="Mobile number" />
                            <TextInput style={inputStyles} placeholderTextColor={colors.text} placeholder="Email address (optional)" />
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
                                    <View style={{borderColor :locationBorder(), borderWidth:1, padding:10}}>
                                        <Text style={{textAlign:'center', color: colors.text}}>
                                            Let's capture your precise location to help the delivery person find you easily.
                                        </Text>
                                        <TouchableOpacity style={[styles.locationButton, {flexDirection: 'row', justifyContent:'center'}]}>
                                            <Text style={[styles.locationButtonText]}>
                                                Pin Location
                                            </Text>
                                            <Text>
                                                <EvilIcons name="location" size={23} color="#ff6347" />
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    
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
                                <TextInput style={inputStyles} onChangeText={setDiscountCode} placeholderTextColor={colors.text} placeholder="Enter Code (optional)" />
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
                                    ₦{Number(totalCostWithDiscount()).toLocaleString()} {' '}
                                    { discount ?
                                        <Text style={{textDecorationLine: 'line-through', fontSize:15}}>₦{Number(totalCostNoDiscount()).toLocaleString()}</Text>
                                    : ''
                                    }
                                </Text>
                                
                            </View>
                        </View>



                        <TouchableOpacity style={styles.proceedButton}>
                            <Text style={styles.proceedButtonText}>Proceed to Make Payment</Text>
                        </TouchableOpacity>
                    </View>
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
        backgroundColor: '#ff6347',
    },
    toggleText: {
        fontSize: 16,
        color: '#fff',
    },
    locationButton: {
        backgroundColor: '#444',
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
        backgroundColor: '#ff6347',
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
