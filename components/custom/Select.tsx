import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTheme } from '@react-navigation/native';

const CustomSelect = ({ options, selectedValue, onValueChange, title }) => {
    const theme = useColorScheme();
    const { colors } = useTheme(); 
    const [modalVisible, setModalVisible] = useState(false);

    const handleSelect = (option) => {
        onValueChange(option);
        setModalVisible(false);
    };
    const containerStyles = [
        styles.container,
        theme === 'dark' ? styles.containerDark : styles.containerLight,
    ];

    const modalBody = [
        styles.modalContainer,
        theme === 'dark' ? {backgroundColor:'#333'} : {backgroundColor:'#fff'} 
    ]

    return (
        <View>
            <TouchableOpacity 
                style={[styles.selectButton, containerStyles]} 
                onPress={() => setModalVisible(true)}>
                <Text style={[styles.selectText, {color:theme === 'dark' ? '#fff' : '#000'}]}>{selectedValue || title }</Text>
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)} />
                <View style={modalBody}>
                    <Text style={{color:colors.text, textAlign:'center'}}>{title}</Text>
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item.value.toString()}
                        renderItem={({ item }) => (
                        <TouchableOpacity style={styles.option} onPress={() => handleSelect(item.value)}>
                            <Text style={[styles.optionText, {color:colors.text}]}>{item.label}</Text>
                        </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
        </View>
    ); 
};

const styles = StyleSheet.create({
  selectButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  selectText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalContainer: {
    flex: 0.5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  option: {
    padding: 15,
  },
  optionText: {
    fontSize: 16,
  },
  containerLight: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  containerDark: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  }
});

export default CustomSelect;
