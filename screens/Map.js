import React, { Component } from 'react'
import { Text, View, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import MapView from 'react-native-maps';
import Modal from 'react-native-modal';
import Dropdown from 'react-native-modal-dropdown';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import* as Location from'expo-location';
import* as Permissions from'expo-permissions';

import * as theme from '../themes/theme';
import { styles } from '../themes/styles';

const { Marker } = MapView;

import Header from '../components/Header';

class ParkingMap extends Component {
  state = {
    hours: {},
    active: null,
    activeModal: null,
    parkings: [],
    selectedItem: null
  }

  async componentDidMount() {
    const hours = {};
    const parkings = await getParkings();
    parkings.map(parking => {hours[parking.id] = 1});
    const selectedItem = parkings[0];
    this.setState({ parkings, hours, selectedItem});
  }
  
  handleHours = (id, value) => {
    const { hours } = this.state;
    hours[id] = value;

    this.setState({ hours });
  }

  //PARTE DE ABAJO PARA COMPRAR (item de la flatlist)
  renderParking = (item) => {
    const { hours } = this.state;
    const totalPrice = item.price * hours[item.id];

    return (
      <TouchableWithoutFeedback key={`parking-${item.id}`}>
        <View style={[styles.parking, styles.shadow]}>
          <View style={styles.hours}>
            <Text style={styles.hoursTitle}>x {item.spots} {item.title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {this.renderHours(item.id)}
              <Text style={{ color: theme.COLORS.gray }}>hours</Text>
            </View>
          </View>

          <View style={styles.parkingInfoContainer}>
            <View style={styles.parkingInfo}>
              <View style={styles.parkingIcon}>
                <Ionicons name='ios-pricetag' size={theme.SIZES.icon} color={theme.COLORS.gray} />
                <Text style={{ marginLeft: theme.SIZES.base }}>{item.price}€</Text>
              </View>
              <View style={styles.parkingIcon}>
                <Ionicons name='ios-star' size={theme.SIZES.icon} color={theme.COLORS.gray} />
                <Text style={{ marginLeft: theme.SIZES.base }}> {item.rating}</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.buy} onPress={() => this.setState({ activeModal: item })}>
             
             {item.free ? 
              <View style={styles.buyTotal}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.buyTotalPrice}>{totalPrice}</Text>
                  <FontAwesome name='euro' size={theme.SIZES.icon * 1.25} color={theme.COLORS.white} />
                </View>
                <Text style={{ color: theme.COLORS.white }}>
                  {item.price}€x{hours[item.id]}hrs
                </Text>
                </View>

                :

                <View style={styles.buyTotal}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: theme.COLORS.white, fontWeight: "bold" }}>Info</Text>
                </View>
                </View>
                
              }
              <View style={styles.buyBtn}>
                <FontAwesome name='angle-right' size={theme.SIZES.icon * 1.75} color={theme.COLORS.white} />
              </View>
            </TouchableOpacity>
            
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
  
  //PARTE DE ABAJO PARA COMPRAR (horas del dropdown menu)
  renderHours(id) {
    const { hours } = this.state;
    const availableHours = [1, 2, 3, 4, 5, 6, 7, 8];

    return (
      <Dropdown
        defaultIndex={0}
        options={availableHours}
        style={styles.hoursDropdown}
        defaultValue={`${hours[id]}:00` || '1:00'}
        dropdownStyle={styles.hoursDropdownStyle}
        onSelect={(index, value) => this.handleHours(id, value)}
        renderRow={(option) => (
          <Text style={styles.hoursDropdownOption}>{`${option}:00`}</Text>
        )}
        renderButtonText={option => `${option}:00`}
      />
    )
  }

  //VENTANA AL PULSAR EL BOTON CUADRADO (modal)
  renderModal() {
    const { activeModal, hours } = this.state;

    if (!activeModal) return null;

    return (
      <Modal
        isVisible
        useNativeDriver
        style={styles.modalContainer}
        backdropColor={theme.COLORS.overlay}
        onBackButtonPress={() => this.setState({ activeModal: null })}
        onBackdropPress={() => this.setState({ activeModal: null })}
        onSwipeComplete={() => this.setState({ activeModal: null })}
      >
        <View style={styles.modal}>
          <View>
            <Text style={{ fontSize: theme.SIZES.font * 1.5 }}>
              {activeModal.title}
            </Text>
          </View>
          <View style={{ paddingVertical: theme.SIZES.base }}>
            <Text style={{ color: theme.COLORS.gray, fontSize: theme.SIZES.font * 1.1 }}>
              {activeModal.description}
            </Text>
          </View>
          <View style={styles.modalInfo}>
            <View style={[styles.parkingIcon, {justifyContent: 'flex-start'} ]}>
              <Ionicons name='ios-pricetag' size={theme.SIZES.icon * 1.1} color={theme.COLORS.gray} />
              <Text style={{ fontSize: theme.SIZES.icon * 1.15 }}> {activeModal.price}€</Text>
            </View>
            <View style={[styles.parkingIcon, {justifyContent: 'flex-start'} ]}>
              <Ionicons name='ios-star' size={theme.SIZES.icon * 1.1} color={theme.COLORS.gray} />
              <Text style={{ fontSize: theme.SIZES.icon * 1.15 }}> {activeModal.rating}</Text>
            </View>
            <View style={[styles.parkingIcon, {justifyContent: 'flex-start'} ]}>
              <Ionicons name='ios-pin' size={theme.SIZES.icon * 1.1} color={theme.COLORS.gray} />
              <Text style={{ fontSize: theme.SIZES.icon * 1.15 }}> {activeModal.price}km</Text>
            </View>
            <View style={[styles.parkingIcon, {justifyContent: 'flex-start'} ]}>
              <Ionicons name='ios-car' size={theme.SIZES.icon * 1.3} color={theme.COLORS.gray} />
              <Text style={{ fontSize: theme.SIZES.icon * 1.15 }}> {activeModal.free ? 'Free' : 'Reserved'}</Text>
            </View>
          </View>

          
          {activeModal.free &&  
          <View style={styles.modalHours}>
            <Text style={{ textAlign: 'center', fontWeight: '500' }}>Choose your Booking Period:</Text>
            <View style={styles.modalHoursDropdown}>
              {this.renderHours(activeModal.id)}
              <Text style={{ color: theme.COLORS.gray }}>hrs</Text>
            </View>
          </View>
          }
          <View>
          

          {activeModal.free ? 
          
            <TouchableOpacity style={styles.payBtn} onPress={ async () => this.setState(await updateParking(activeModal.id, false))}>
              <Text style={styles.payText}>
                Proceed to pay {activeModal.price * hours[activeModal.id]}€
              </Text>
              <FontAwesome name='angle-right' size={theme.SIZES.icon * 1.75} color={theme.COLORS.white} />
            </TouchableOpacity>
              
              :

            <TouchableOpacity style={styles.payBtn} onPress={ async () => this.setState(await updateParking(activeModal.id, true))}>
              <Text style={styles.payText}>
                Free Parking
              </Text>
              <FontAwesome name='angle-right' size={theme.SIZES.icon * 1.75} color={theme.COLORS.white} />
            </TouchableOpacity>
            }

          </View>
        </View>
      </Modal>
    );
  }

   //MAP
   render() {
    const { parkings } = this.state;
    const { currentPosition } = this.props;

    return (
      <View style={styles.container}>
        <Header/>
        <MapView
          initialRegion={currentPosition}
          style={styles.map}
        >
          {parkings.map(parking => (
            <Marker
              key={`marker-${parking.id}`}
              coordinate={parking.coordinate}
            >
              <TouchableWithoutFeedback onPress={() => this.setState({ selectedItem: parking })} >
                <View style={[
                  styles.marker,
                  styles.shadow,
                  this.state.selectedItem.id === parking.id ? styles.active : null
                ]}>
                  <Text style={styles.markerId}>{parking.title}, </Text>
                  <Text style={styles.markerPrice}>{parking.price}€</Text>
                  <Text style={styles.markerStatus}> ({parking.free ? 'Free' : 'Reserved'})</Text>
                </View>
              </TouchableWithoutFeedback>
            </Marker>
          ))}
        </MapView>
        { this.state.selectedItem && this.renderParking(this.state.selectedItem)}
        {this.renderModal()}
      </View>
    )
  }
}

  async function updateParking(parkingId, isFree){
    const url = 'https://parking-finder-api.azurewebsites.net/parkings/reserve';
    let parkingData = {
      id: parkingId,
      free: isFree
    }

    const response = await fetch(url, {
      method: 'PUT', 
      body: JSON.stringify(parkingData), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    });


    const newParkings = await getParkings();
    let parking = await response.json();
    return { 
      selectedItem: parking,
      activeModal: parking,
      parkings: newParkings}
  }


async function getParkings() {
  const url = 'https://parking-finder-api.azurewebsites.net/parkings';
  
  const response = await fetch(url);
  const responseData = await response.json();
  return responseData;
}


//LOCALIZACION INICIAL DEL MAPA
ParkingMap.defaultProps = {
  currentPosition: {
    latitude: 60.2000652,
    longitude:  24.935192,
    latitudeDelta: 0.0122,
    longitudeDelta: 0.0121,
  }
}

export default ParkingMap;

//https://parking-finder-api.azurewebsites.net/parkings

/*
const[location, setLocation] = useState(null);
  useEffect(() => {
    this.getLocation();
  }, []);

  getLocation= async() => {
    //Checkpermission
    let {status} =  awaitPermissions.askAsync(Permissions.LOCATION);
    if (status!== 'granted') {
      Alert.alert('No permission to access location');
    }else{
      let location= awaitLocation.getCurrentPositionAsync({});
      setLocation(location);
    }
  };
*/