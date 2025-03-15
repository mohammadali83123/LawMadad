import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from './../../Config/FirebaseConfig';
import { FlatList } from 'react-native';

export default function Category() {
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Affidavit');

  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = async () => {
    const snapshot = await getDocs(collection(db, 'Category'));
    const categories = [];
    snapshot.forEach((doc) => {
      categories.push(doc.data()); // Collecting all items
    });
    setCategoryList(categories); // Update state in one go
  };

  return (
    <View style={{ padding: 10 }}>
      <FlatList
        data={categoryList}
        horizontal={true} // Ensures items are displayed horizontally in a row
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedCategory(item.name)}>
            <View
              style={[
                styles.itemContainer,
                selectedCategory === item.name
                  ? styles.selectedItem
                  : styles.deselectedItem,
              ]}
            >
              <Image
                source={{ uri: item?.imageURL }}
                style={styles.categoryImages}
                onError={() => console.log('Image failed to load')}
              />
              <Text style={selectedCategory === item.name ? styles.selectedText : styles.deselectedText}>
                {item?.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()} // Ensure each item has a unique key
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    marginRight: 10, // Space between items
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 10,
  },
  selectedItem: {
    borderColor: '#4CAF50', // Green border for selected item
    borderWidth: 2,
    backgroundColor: '#e0f7e1', // Light green background for selected item
  },
  deselectedItem: {
    borderColor: '#ddd', // Default border color
    borderWidth: 2,
    backgroundColor: 'transparent', // No background for deselected items
  },
  categoryImages: {
    width: 100, // Adjust the width to your preference
    height: 100, // Adjust the height to your preference
    borderRadius: 10, // Add rounded corners
    borderWidth: 2, // Add a border width
    borderColor: '#ddd', // Border color
  },
  selectedText: {
    fontWeight: 'bold', // Bold text for selected category
    color: '#4CAF50', // Green text color for selected category
  },
  deselectedText: {
    color: '#000', // Default black text color for deselected category
  },
});
