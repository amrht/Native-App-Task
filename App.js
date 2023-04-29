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
import { SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const cuisines = ['American', 'Asian', 'British', 'Caribbean', 'Central Europe', 'Chinese', 'Eastern Europe', 'French', 'Greek', 'Indian', 'Italian', 'Japanese', 'Korean', 'Kosher', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'South American', 'South East Asian', 'World'];

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
  const [searchText, setSearchText] = useState('');


  useEffect(() => {
    fetchData();
  }, []);
  const cuisineN = cuisine.replace(/ /g, '%20').toLowerCase();
 
  const fetchData = async () => {
    const response = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&app_id=acdacb8d&app_key=02befa5bfeaaefbd07d90c1561317e9c&cuisineType=${cuisineN}&from=0&to=50&q=${searchText}`);
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

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const clearSearch = () => {
    setSearchText('');
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search dishes"
        onChangeText={handleSearch}
        value={searchText}
        onClear={clearSearch}
        onSubmitEditing={fetchData}
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInputContainer}
        inputStyle={styles.searchBarInput}
        searchIcon={(
        <Icon
          name="search"
          size={20}
          color="gray"
          onPress={fetchData}
          />
        )}
        clearIcon={(
    <Icon
      name="remove"
      size={20}
      color="gray"
      onPress={clearSearch}
    />
  )}
      />
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
        <Stack.Screen name="Details" component={DetailsScreen} options={({ route }) => ({ title: `Dishes - ${route.params.cuisine}` })}/>
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
  searchBarContainer: {
    backgroundColor: '#fff',
    borderTopColor: '#fff',
    borderBottomColor: '#fff',
    padding: 0,
  },
  searchBarInputContainer: {
    backgroundColor: '#f2f2f2',
  },
  searchBarInput: {
    fontSize: 16,
  },
  searchBarClearIcon: {
    color: '#86939e',
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
