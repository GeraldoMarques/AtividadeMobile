import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, DrawerLayoutAndroid, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import booksData from './dataBooks.json'; // Importando o JSON local

const App = () => {
  const [bookTitle, setBookTitle] = useState("");
  const [bookDataState, setBookDataState] = useState(null);
  const [location, setLocation] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    if (drawerOpen) {
      this.drawer.closeDrawer();
      setDrawerOpen(false);
    } else {
      this.drawer.openDrawer();
      setDrawerOpen(true);
    }
  };

  const renderDrawer = () => (
    <View style={styles.drawerContainer}>
      <Text style={styles.drawerTitle}>Livros Disponíveis</Text>
      {booksData.map((book, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.drawerItem} 
          onPress={() => handleBookSelection(book)}
        >
          <Text style={styles.drawerItemText}>{book.titulo}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const handleBookSelection = (selectedBook) => {
    setBookDataState(selectedBook);
    toggleDrawer();
  };

  const handleSearch = () => {
    if (bookTitle.trim() === "") {
      Alert.alert('Aviso', 'Por favor, insira um título de livro válido.');
      return;
    }

    // Procurar o livro correspondente na lista
    const foundBook = booksData.find(book => book.titulo.toLowerCase() === bookTitle.toLowerCase());

    if (foundBook) {
      setBookDataState(foundBook);
    } else {
      Alert.alert('Erro', 'Livro não encontrado. Verifique o título e tente novamente.');
    }
  };

  // Hook useEffect para obter a localização atual
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida', 'Por favor, conceda permissão de localização para obter a localização.');
        return;
      }
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);

  return (
    <DrawerLayoutAndroid
      ref={drawer => { this.drawer = drawer; }}
      drawerWidth={250}
      drawerPosition="left"
      renderNavigationView={renderDrawer}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Busca de Livros</Text>
        <TouchableOpacity style={styles.menuButton} onPress={toggleDrawer}>
          <Text style={styles.menuButtonText}>Abrir Menu</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do livro"
          value={bookTitle}
          onChangeText={(text) => setBookTitle(text)}
        />
        <Button title="Buscar Livro" onPress={handleSearch} />
        {bookDataState && (
          <View style={styles.bookDetails}>
            <Text style={styles.bookTitle}>{bookDataState.titulo}</Text>
            <Text>Autor: {bookDataState.autor}</Text>
            <Text>Ano: {bookDataState.ano}</Text>
          </View>
        )}
        {location && (
          <View style={styles.locationDetails}>
            <Text style={styles.locationHeader}>Sua localização atual:</Text>
            <Text>Latitude: {location.coords.latitude}</Text>
            <Text>Longitude: {location.coords.longitude}</Text>
          </View>
        )}
        {location && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Sua Localização"
            />
          </MapView>
        )}
      </View>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  menuButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  menuButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#fff',
  },
  bookDetails: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  locationDetails: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  locationHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  map: {
    width: '100%',
    height: 200,
    marginVertical: 20,
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#6200ee',
  },
  drawerItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default App;
