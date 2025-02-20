import React, { useEffect, useState } from 'react';
import { 
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';


interface Reel {
  id: string;
  thumbnail: string;
  artistName: string;
}

const FeaturedReels = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace the URL below with the appropriate endpoint or query logic
    async function fetchReels() {
      try {
        const response = await fetch('https://example.com/api/submittedReels');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Assumes the API returns an array of reels with id, imageUrl, and artistName.
        setReels(data);
      } catch (error) {
        console.error("Error fetching reels:", error);
        Alert.alert("Error", "Could not load reels data.");
      } finally {
        setLoading(false);
      }
    }

    fetchReels();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Reel }) => (
    <View style={styles.itemContainer}>
      <Image 
        source={{ uri: item.thumbnail }} 
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.artistName}>{item.artistName}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList 
        data={reels}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
  itemContainer: {
    marginBottom: 16,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
  },
  artistName: {
    padding: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default FeaturedReels;
