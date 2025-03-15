import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen name='home' options={{
                title: 'Home',
                headerShown: false,
                tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />
            }} />
            <Tabs.Screen name='documentDraft' options={{
                title: 'Document Draft',
                headerShown: false,
                tabBarIcon: ({ color }) => <Ionicons name="document-text-outline" size={24} color={color} />
            }} />
            <Tabs.Screen name='profile' options={{
                title: 'Profile',
                headerShown: false,
                tabBarIcon: ({ color }) => <Ionicons name="people-outline" size={24} color={color} />
            }} />
        </Tabs>
    )
}