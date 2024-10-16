import { View, Image, Modal, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Tabs } from 'expo-router'

const AppLogo = require("../../assets/images/LawMadad-icon.png");

export default function TabLayout() {
    const [modalVisible, setModalVisible] = useState(false);

    const handleImagePress = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <View style={{ flex: 1 }}>
            <Tabs
                screenOptions={{
                    headerShown: true,
                    headerRight: () => (
                        <TouchableOpacity onPress={handleImagePress}>
                            <Image
                                source={AppLogo}
                                style={{ width: 40, height: 40, marginRight: 10 }}
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
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',  // Semi-transparent background
    },
    fullSizeImage: {
        width: 300,  // Adjust the size of the full-sized image
        height: 300,
    },
    closeButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
