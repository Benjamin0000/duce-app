import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, ScrollView, Image, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CartContext } from '../../../components/context/CartContext';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import * as Location from 'expo-location';
import LoaderOverlay from '../../../components/Loaders/LoaderOverlay';
import CustomSelect from '../../../components/custom/Select';
import { errorMessage } from '@/components/custom/MessageAlert';

const { height } = Dimensions.get('window');

export default function FinishOrder() {
    const { colors } = useTheme();
    const theme = useColorScheme();
    const { total_cost, branch } = useContext(CartContext);
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
    const [discount, setDiscount] = useState(0);
    const [deliveryCost, setDeliveryCost] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [locations, setLocations] = useState(null);

    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');

    const requestLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            errorMessage("Permission to access location was denied");
            return;
        }
        const location = await Location.getCurrentPositionAsync({});
        setLocationPoint(`${location.coords.latitude},${location.coords.longitude}`);
    };

    const onChangeDate = (event, date) => {
        setShowDatePicker(false);
        if (date) {
            const today = new Date();
            if (date < today) {
                errorMessage("Selected date is in the past. Please choose a valid date.");
            } else {
                setSelectedDate(date);
            }
        }
    };

    const onChangeTime = (event, time) => {
        setShowTimePicker(false);
        if (time) {
            const hours = time.getHours();
            if (hours < 9 || hours > 20) {
                errorMessage("Please select a time between 9:00 AM and 8:00 PM.");
            } else {
                setSelectedTime(time);
            }
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.Container, { backgroundColor: colors.background }]}>
                <LoaderOverlay visible={loading} />

                <ScrollView>
                    <View style={{ padding: 10 }}>
                        {/* Other components */}

                        <View>
                            <Text style={[styles.info_header, { color: colors.text }]}>Delivery Info</Text>
                            <View style={styles.toggleContainer}>
                                <TouchableOpacity
                                    style={[styles.toggleButton, isDelivery && styles.activeButton]}
                                    onPress={() => setIsDelivery(true)}
                                >
                                    <Text style={[styles.toggleText, { color: isDelivery ? 'white' : colors.text }]}>Delivery</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.toggleButton, !isDelivery && styles.activeButton]}
                                    onPress={() => setIsDelivery(false)}
                                >
                                    <Text style={[styles.toggleText, { color: !isDelivery ? 'white' : colors.text }]}>Pickup</Text>
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
                                            style={[styles.toggleButton, isPin && styles.activeButton]}
                                            onPress={() => setIsPin(true)}
                                        >
                                            <Text style={[styles.toggleText, { color: isPin ? 'white' : colors.text }]}>Pin Location</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.toggleButton, !isPin && styles.activeButton]}
                                            onPress={() => setIsPin(false)}
                                        >
                                            <Text style={[styles.toggleText, { color: !isPin ? 'white' : colors.text }]}>Set Location</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {isPin ? (
                                        <View style={{ padding: 10 }}>
                                            <Text style={{ textAlign: 'center', color: colors.text }}>
                                                Capture your precise location to help the delivery person find you easily.
                                            </Text>
                                            <TouchableOpacity onPress={requestLocation} style={styles.locationButton}>
                                                <Text style={styles.locationButtonText}>Pin Location</Text>
                                                <EvilIcons name="location" size={23} color="#ff6347" />
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <CustomSelect
                                            options={locations}
                                            selectedValue={selectedLocation}
                                            onValueChange={setSelectedLocation}
                                            title="Select a location"
                                        />
                                    )}
                                </>
                            ) : (
                                <>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity style={styles.datePickerCon} onPress={() => setShowDatePicker(true)}>
                                            <Text style={styles.datePickerText}>Set pickup date</Text>
                                            <Text style={styles.datePickerText}>{selectedDate.toLocaleDateString()}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.datePickerCon} onPress={() => setShowTimePicker(true)}>
                                            <Text style={styles.datePickerText}>Set pickup time</Text>
                                            <Text style={styles.datePickerText}>
                                                {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    {showDatePicker && (
                                        <DateTimePicker mode="date" value={selectedDate} onChange={onChangeDate} />
                                    )}
                                    {showTimePicker && (
                                        <DateTimePicker mode="time" value={selectedTime} onChange={onChangeTime} />
                                    )}
                                </>
                            )}
                        </View>
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
