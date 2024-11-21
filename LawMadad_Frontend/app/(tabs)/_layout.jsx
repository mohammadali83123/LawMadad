import { View, Image, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Tabs } from 'expo-router';

const AppLogo = require("../../assets/images/logo.png");

export default function TabLayout() {
    const [modalVisible, setModalVisible] = useState(false);

    const handleImagePress = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Tabs
                screenOptions={{
                    headerShown: true,
                    headerStyle: styles.headerStyle,
                    headerTitleStyle: styles.headerTitle,
                    headerRight: () => (
                        <TouchableOpacity onPress={handleImagePress}>
                            <Image
                                source={AppLogo}
                                style={styles.logo}
                            />
                        </TouchableOpacity>
                    ),
                }}>
                <Tabs.Screen name='home' options={{ title: 'Home' }} />
                <Tabs.Screen name='setting' options={{ title: 'Settings' }} />
            </Tabs>

            {/* Modal to display full-sized image */}
            <Modal
                visible={modalVisible}
                transparent={true}
                onRequestClose={closeModal}
                animationType="fade"
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                        <Image source={AppLogo} style={styles.fullSizeImage} />
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4', // Light gray background
    },
    headerStyle: {
        backgroundColor: '#3E3E3E', // Dark gray for premium feel
        elevation: 8,  // Shadow for Android
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    headerTitle: {
        color: '#EDEDED', // Light gray for header text
        fontSize: 20,
        fontWeight: 'bold',
    },
    logo: {
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 20,  // Circular logo
        borderWidth: 2,
        borderColor: '#EDEDED', // Light gray border
        overflow: 'hidden',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)', // Darker semi-transparent background
        padding: 20,
    },
    fullSizeImage: {
        width: '90%', // Responsive width for the modal
        height: undefined,
        aspectRatio: 1, // Maintain aspect ratio
        borderRadius: 15, // Rounded corners for the image
        borderColor: '#3E3E3E', // Dark gray border
        borderWidth: 2,
        backgroundColor: '#fff', // White background for image container
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    closeButton: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: '100%',
    },
});
