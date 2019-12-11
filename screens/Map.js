import React, { Component } from 'react'
import { Text, View, TouchableOpacity, TouchableWithoutFeedback, Alert } from 'react-native'
import MapView from 'react-native-maps';
import Modal from 'react-native-modal';
import Dropdown from 'react-native-modal-dropdown';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

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
    selectedItem: null,
    currentPosition: null,
    timeToFreeParking: null
  }

  
  async componentDidMount() {
    const hours = {};
    const parkings = await this.getParkings();
    parkings.map(parking => { hours[parking.id] = 1 });
    const selectedItem = parkings[0];
    const currentPosition = await this.getLocation();
    this.setState({ parkings, hours, selectedItem, currentPosition });
    await this.updateParkingsStatus();

  }

  handleHours = (id, value) => {
    const { hours } = this.state;
    hours[id] = value;

    this.setState({ hours });
  }

  //Parkings menu
  renderParking = (item) => {
    const { hours, timeToFreeParking } = this.state;
    const totalPrice = item.price * hours[item.id];

    return (
      <TouchableWithoutFeedback key={`parking-${item.id}`}>
        <View style={[styles.parking, styles.shadow]}>
         
          <View style={styles.hours}>
            <Text style={styles.hoursTitle}>x {item.spots} {item.title}</Text>
            {item.free &&
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {this.renderHours(item.id)}
                <Text style={{ color: theme.COLORS.gray }}>hours</Text>
              </View>
            }
            {item.free == false &&
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: theme.COLORS.gray }}> Free in: {timeToFreeParking}</Text>
              </View>
            }
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
                    <Text style={{ color: theme.COLORS.white, fontWeight: "bold", fontSize: 18 }}>Info</Text>
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

  //Times dropdown menu
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

  //Modal
  renderModal() {
    const { activeModal, hours, timeToFreeParking } = this.state;

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
            <View style={[styles.parkingIcon, { justifyContent: 'flex-start' }]}>
              <Ionicons name='ios-pricetag' size={theme.SIZES.icon * 1.1} color={theme.COLORS.gray} />
              <Text style={{ fontSize: theme.SIZES.icon * 1.15 }}> {activeModal.price}€</Text>
            </View>
            <View style={[styles.parkingIcon, { justifyContent: 'flex-start' }]}>
              <Ionicons name='ios-star' size={theme.SIZES.icon * 1.1} color={theme.COLORS.gray} />
              <Text style={{ fontSize: theme.SIZES.icon * 1.15 }}> {activeModal.rating}</Text>
            </View>
            <View style={[styles.parkingIcon, { justifyContent: 'flex-start' }]}>
              <Ionicons name='ios-pin' size={theme.SIZES.icon * 1.1} color={theme.COLORS.gray} />
              <Text style={{ fontSize: theme.SIZES.icon * 1.15 }}> {activeModal.price}km</Text>
            </View>
            <View style={[styles.parkingIcon, { justifyContent: 'flex-start' }]}>
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

          {activeModal.free == false &&
            <View style={styles.modalHours}>
              <Text style={{ textAlign: 'center', fontWeight: '500' }}>You must free your parking in:</Text>
              <View style={styles.modalHoursDropdown}>
                <Text style={{ color: theme.COLORS.gray }}>{timeToFreeParking}</Text>
              </View>
            </View>
          }

          <View>


            {activeModal.free ?
              <TouchableOpacity style={styles.payBtn} onPress={async () => await this.updateParking(activeModal.id, false)}>
                <Text style={styles.payText}>
                  Proceed to pay {activeModal.price * hours[activeModal.id]}€
              </Text>
                <FontAwesome name='angle-right' size={theme.SIZES.icon * 1.75} color={theme.COLORS.white} />
              </TouchableOpacity>
              :
              <TouchableOpacity style={styles.payBtn} onPress={async () => await this.updateParking(activeModal.id, true)}>
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
    const { parkings, currentPosition } = this.state;

    return (
      <View style={styles.container}>
        <Header />
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
        {this.state.selectedItem && this.renderParking(this.state.selectedItem)}
        {this.renderModal()}
      </View>
    )
  }

  updateParkingsStatus = async () =>{
    this.updateReserveCountdown();
    await this.checkReserveParking();
    setTimeout(this.updateParkingsStatus, 1000);
  
  }

  updateReserveCountdown = () =>{
    const { selectedItem } = this.state;
    if(selectedItem && !selectedItem.free){
      let reservedDate = new Date(selectedItem.reservedDate);
      let diffTime = reservedDate - new Date(); 

      if (diffTime > 0){
      let timeToFreeParking = this.CalculateDiffTime(diffTime);
      this.setState({timeToFreeParking});
      }
    }
  }

  checkReserveParking = async () =>{
    const { parkings } = this.state;
    let reservedParkings = parkings.filter(p => !p.free);
    for(const parking of reservedParkings){
      let reservedDate = new Date(parking.reservedDate);
      let diffTime = reservedDate - new Date();
      if (diffTime <= 0){
        console.log("liberamos el " + parking.id );
      await this.updateParking(parking.id, true);
      }
    }

  }

  CalculateDiffTime(ms) {
    let  h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;

    let hour = String(h).padStart(2,"0");
    let min = String(m).padStart(2,"0");
    let seg = String(s).padStart(2,"0");

    return `${hour}:${min}:${seg}` ;
  }

  updateParking = async (parkingId, isFree) => {
    const url = 'https://parking-finder-api2.azurewebsites.net/parkings/reserve';
  
    const reservedDate = new Date();
    reservedDate.setHours(reservedDate.getHours() + this.state.hours[parkingId]);
    let parkingData = {
      id: parkingId,
      free: isFree,
      reservedDate: isFree ? null : reservedDate.toJSON()
    }
  
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(parkingData), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    let parking = await response.json();

    const newParkings = await this.getParkings();
    this.setState({parkings: newParkings});

    if(this.state.selectedItem && this.state.selectedItem.id == parking.id){
    this.setState({selectedItem: parking});
    }

    if(this.state.activeModal && this.state.activeModal.id == parking.id){
    this.setState({activeModal: parking});
    }
  }
  
   getParkings = async () => {
    const url = 'https://parking-finder-api2.azurewebsites.net/parkings';
  
    const response = await fetch(url);
    const responseData = await response.json();
    return responseData;
  }
  
   getLocation = async () => {
    //Checkpermission
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      Alert.alert('No permission to access location');
    } else {
      let location = await Location.getCurrentPositionAsync({});
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0121,
      };
    }
    return {
      latitude: 60.2000652,
      longitude: 24.935192,
      latitudeDelta: 0.0122,
      longitudeDelta: 0.0121,
    };
  };
  

}



export default ParkingMap;


