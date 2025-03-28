import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { firestore } from './../../Config/FirebaseConfig';

export default function Category() {
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Affidavit');

  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = async () => {
    try {
      const snapshot = await getDocs(collection(firestore, 'Category'));
      console.log("Snapshot size:", snapshot.size);
      const categories = [];
      snapshot.forEach((doc) => {
        console.log("Doc data:", doc.data());
        categories.push(doc.data());
      });
      setCategoryList(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <View style={styles.container}>
      {categoryList.length > 0 ? (
        <FlatList
          data={categoryList}
          horizontal={true}
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
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.noDataText}>No categories available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  itemContainer: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 10,
  },
  selectedItem: {
    borderColor: '#4CAF50', // Green border for selected category
    borderWidth: 2,
    backgroundColor: '#e0f7e1', // Light green background for selected category
  },
  deselectedItem: {
    borderColor: '#ddd',
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  categoryImages: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  deselectedText: {
    color: '#000',
  },
  noDataText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
