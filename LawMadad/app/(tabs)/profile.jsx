import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Switch,
  Platform
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { getUserSession, signOutUser } from "../../services/AuthService";
import { auth } from '../../Config/FirebaseConfig';
import * as Haptics from 'expo-haptics';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const router = useRouter();

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const sessionUser = await getUserSession();
        
        // If we have a Firebase user, use that data
        const currentUser = auth.currentUser;
        if (currentUser) {
          setUser({
            uid: currentUser.uid,
            displayName: currentUser.displayName || 'User',
            email: currentUser.email,
            photoURL: currentUser.photoURL || 'https://ui-avatars.com/api/?name=' + 
              encodeURIComponent(currentUser.displayName || currentUser.email || 'User'),
            provider: currentUser.providerData[0]?.providerId || 'unknown',
            emailVerified: currentUser.emailVerified,
            creationTime: currentUser.metadata?.creationTime
          });
        } else if (sessionUser) {
          // Fallback to session data if Firebase user isn't available
          setUser({
            ...sessionUser,
            photoURL: sessionUser.photoURL || 'https://ui-avatars.com/api/?name=' + 
              encodeURIComponent(sessionUser.displayName || sessionUser.email || 'User')
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            setLoading(true);
            try {
              await signOutUser();
              router.replace('/login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            } finally {
              setLoading(false);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleEditProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Edit Profile', 'Profile editing will be available in the next update!');
  };

  const toggleSwitch = (setter) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setter(previousState => !previousState);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6da7" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with background gradient */}
        <LinearGradient
          colors={['#4a6da7', '#8a9eb5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerBackground}
        >
          <View style={styles.headerContentContainer}>
            {/* Profile picture section */}
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: user?.photoURL }}
                style={styles.profileImage}
              />
              {/* <TouchableOpacity 
                style={styles.editProfileImageButton}
                onPress={handleEditProfile}
              >
                <Feather name="edit-2" size={16} color="white" />
              </TouchableOpacity> */}
            </View>
            
            {/* User info */}
            <View style={styles.userInfoContainer}>
              <Text style={styles.userName}>{user?.displayName}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.userAuthMethod}>
                <MaterialCommunityIcons 
                  name={user?.provider.includes('google') ? 'google' : 'email'} 
                  size={16} 
                  color="#fff" 
                />
                <Text style={styles.userAuthMethodText}>
                  {user?.provider.includes('google') ? 'Google Sign-in' : 'Email/Password'}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Account Information Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="person" size={20} color="#4a6da7" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{user?.displayName || 'Not set'}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="mail" size={20} color="#4a6da7" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
            {user?.emailVerified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="calendar" size={20} color="#4a6da7" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Joined</Text>
              <Text style={styles.infoValue}>
                {user?.creationTime ? new Date(user.creationTime).toLocaleDateString() : 'Unknown'}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          {/* <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="moon" size={20} color="#4a6da7" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              trackColor={{ false: "#e0e0e0", true: "#a7c1e0" }}
              thumbColor={darkMode ? "#4a6da7" : "#f4f4f4"}
              ios_backgroundColor="#e0e0e0"
              android_ripple={{ color: "#4a6da7" }}
              onValueChange={() => toggleSwitch(setDarkMode)}
              value={darkMode}
            />
          </View> */}
          
          {/* <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="notifications" size={20} color="#4a6da7" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: "#e0e0e0", true: "#a7c1e0" }}
              thumbColor={notifications ? "#4a6da7" : "#f4f4f4"}
              ios_backgroundColor="#e0e0e0"
              android_ripple={{ color: "#4a6da7" }}
              onValueChange={() => toggleSwitch(setNotifications)}
              value={notifications}
            />
          </View> */}
          
          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={() => router.push('/singlescreens/privacy')}
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="lock-closed" size={20} color="#4a6da7" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Privacy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/singlescreens/helpCenter')}
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="help-circle" size={20} color="#4a6da7" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Help Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>App Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  headerBackground: {
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: 'white',
  },
  editProfileImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4a6da7',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userInfoContainer: {
    marginLeft: 20,
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  userAuthMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  userAuthMethodText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: -15,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#f0f0f0',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a6da7',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f4f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  verifiedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  verifiedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f4f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    marginLeft: 15,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  versionText: {
    color: '#999',
    fontSize: 12,
  }
});