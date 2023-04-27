import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Linking
} from 'react-native';

const cuisines = ['American', 'Asian', 'British', 'Caribbean', 'Chinese', 'French', 'Greek', 'Indian', 'Italian', 'Japanese', 'Mediterranean', 'Mexican', 'Moroccan', 'Spanish', 'Thai', 'Turkish', 'Vietnamese'];

const CuisineCard = ({ cuisine, navigation }) => {
  const handlePress = () => {
    AsyncStorage.setItem('selectedCuisine', cuisine); // store selected cuisine in AsyncStorage
    navigation.navigate('Details', { cuisine });
  };

  return (
    <TouchableOpacity style={styles.cuisineCard} onPress={handlePress}>
      <Text style={styles.cuisineText}>{cuisine}</Text>
    </TouchableOpacity>
  );
};

const HomeScreen = ({ navigation }) => {
  useEffect(() => {
    checkStoredCuisine(); // check if there is a stored cuisine on app startup
  }, []);

  const checkStoredCuisine = async () => {
    const selectedCuisine = await AsyncStorage.getItem('selectedCuisine');
    if (selectedCuisine) {
      navigation.navigate('Details', { cuisine: selectedCuisine }); // navigate directly to details screen if there is a stored cuisine
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {cuisines.map((cuisine) => (
          <CuisineCard key={cuisine} cuisine={cuisine} navigation={navigation} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const DetailsScreen = ({ route }) => {
  const { cuisine } = route.params;
  const [data, setData] = useState([]);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch(`https://api.edamam.com/search?q=${cuisine}&app_id=${"acdacb8d"}&app_key=${'02befa5bfeaaefbd07d90c1561317e9c'}&from=0&to=50`);
    const json = await response.json();
    setData(json.hits);
  };

  const renderItem = ({ item }) => {
    const { label, image, source, url } = item.recipe;
    return (
      <View style={styles.card}>
        <Image style={styles.image} source={{ uri: image }} />
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.source}>{source}</Text>
        <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(url)}>
          <Text style={styles.buttonText}>View Recipe</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.flatList}
      />
    </View>
  );
};

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Cuisine Types' }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  cuisineCard: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10,
  },
  cuisineText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 100,
  },
  flatList: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  card: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  source: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#2196f3',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});


export default App;
