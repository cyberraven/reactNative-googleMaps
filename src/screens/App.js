/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 import React, { Component } from 'react';
 import {
   Text,
   View,
   Image,
   Platform,
   StyleSheet,
   TouchableOpacity,
   Animated,
 } from 'react-native';
 import { Marker } from 'react-native-maps';
 import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

 import MarkerListDetails from './src/components/MarkerListDitails';
 import darkMap from './src/mapStyles/darkMap.json';

 import userIcon from './src/images/testUserIcon.jpg';
 import markerIcon from './src/images/test_icon_gym01.png';
 import markerGlow from './src/images/green_glow.png';



 const DEFAULT_LOCATION_LAT = 41.8962667,
       DEFAULT_LOCATION_LNG = 11.3340056;

//At what difference between delta values of new and last location should POIs be updated
 const DELTA_DIFFERENCE = 2,
       DELTA_DIFFERENCE_FACTOR = 1.5;


 export default class App extends Component {
   glowAnimation = null;
   constructor(props) {
     super(props)
     
     this.state = {
       region: {
         latitude: DEFAULT_LOCATION_LAT,
         longitude: DEFAULT_LOCATION_LNG,
         latitudeDelta: 6,
         longitudeDelta: 6,
        },
        locationOfLastUpdate: {
          latitude: DEFAULT_LOCATION_LAT,
          longitude: DEFAULT_LOCATION_LNG,
          latitudeDelta: 6,
          longitudeDelta: 6,
        },
        userLocation: {
          latitude: DEFAULT_LOCATION_LAT,
          longitude: DEFAULT_LOCATION_LNG,
        },
        error: null,
        markers: [],
      };      
    }
    
   componentWillMount() {
     this.glowAnimation = new Animated.Value(0);
     navigator.geolocation.getCurrentPosition(
       (position) => {
         let newRegion = {
           latitude: position.coords.latitude,
           longitude: position.coords.longitude,
           latitudeDelta: 6,
           longitudeDelta: 6,
         }
         this.setState({
           region: newRegion,
           locationOfLastUpdate: newRegion,
           error: false,
           userLocation: {
             latitude: position.coords.latitude,
             longitude: position.coords.longitude,
           }
         });
         console.log("i was mounted! " + this.state.latitude);
       },
       (error) => console.log("error with location service!!"),
       { enableHighAccuracy: true, timeout: 20000, maximumAge: 99999000 },
     );
     this.onRegionChange(null)
   }
   componentDidMount() {
     this.wathcID = navigator.geolocation.watchPosition((position) => {
       this.setState({
        userLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
       });
     });
     console.log("this is: " + Object.getOwnPropertyNames(this.state.region));
     this.glowAnimation.setValue(0);
     const config = {
       toValue: 1,
       duration: 2000,
     };

     Animated.timing(this.glowAnimation, config).start(this.animateGlow);
   }

   showUser() {

     const glowScale = this.glowAnimation.interpolate({
       inputRange: [0, 1],
       outputRange: [1, 1.6],
      });
      
      const glowOpacity = this.glowAnimation.interpolate({
        inputRange: [0, 0.1, 0.5, 1],
        outputRange: [0, 1, 1, 0.1],
      });
      
      //console.log("glow animation: " + JSON.stringify(glowOpacity, null, 4));

     return (
       <View>
        <MapView.Marker 
          key={"user_glow"}
          coordinate={this.state.userLocation}>
          <View>
            <Animated.Image
            source={userIcon}
            style={[styles.userIcon, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]}/>
          </View> 
        </MapView.Marker>
        <MapView.Marker
          key={"usr_icon"}
          coordinate={this.state.userLocation}>
            <View>
              <Image source={markerGlow} style={{height: 40, width: 40}} />
            </View>
          </MapView.Marker>
        </View>
     )
   }

   locationDifference(region) {
    // console.log("region: "+ region.latitudeDelta + ", lastupdate: " + this.state.locationOfLastUpdate.latitudeDelta + ",.... " + region.latitude);
     if(Math.abs(this.state.locationOfLastUpdate.latitudeDelta - region.latitudeDelta) >  DELTA_DIFFERENCE) {
       return true;
     }
     if((Math.abs(this.state.locationOfLastUpdate.latitude) - Math.abs(region.latitude)) > region.latitudeDelta * DELTA_DIFFERENCE_FACTOR) {
       return true;
     }
     if((Math.abs(this.state.locationOfLastUpdate.longitude) - Math.abs(region.longitude)) > region.longitudeDelta * DELTA_DIFFERENCE_FACTOR) {
       return true;
     }
     return false;
   }

   onRegionChange(region) {
     markerUpdater = new MarkerListDetails();
     if(region == null) {
       this.setState({
         markers: markerUpdater.updateMarkers(this.state.region),
       });
       return;
     }
     //console.log("last long: " + this.state.locationOfLastUpdate.longitudeDelta + "lastlocation lat: :" + this.state.locationOfLastUpdate.latitudeDelta + ", new long: " + region.longitudeDelta  + ", new lat: " + region.latitudeDelta);
     if(this.locationDifference(region)) {
       console.log("location was updated!");
       this.setState({
         locationOfLastUpdate: region,         
         markers: markerUpdater.updateMarkers(region),
       });
     }
   }


   render() {
     let markerGenerator = new MarkerListDetails(this.state.region);
     
     const glowScale = this.glowAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.6],
     });
     
     const glowOpacity = this.glowAnimation.interpolate({
       inputRange: [0, 0.1, 0.5, 1],
       outputRange: [0, 1, 1, 0.1],
     });

     //console.log("current map style: \n" + JSON.stringify(darkMap, null, 4));

     return (
       <View style={styles.container} style={{flex: 1}}>

         <MapView
            style={{flex: 1}}
            provider={PROVIDER_GOOGLE}
            customMapStyle={darkMap}
            onRegionChange={this.onRegionChange.bind(this)}
            initialRegion={this.state.region}
          >
            {this.state.markers}
            <View>
              <MapView.Marker 
                key={"user_glow"}
                coordinate={this.state.userLocation}>
                <View>
                  <Animated.Image
                  source={userIcon}
                  style={[styles.userIcon, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]}/>
                </View> 
              </MapView.Marker>
              <MapView.Marker
                key={"usr_icon"}
                coordinate={this.state.userLocation}>
                  <View>
                    <Image source={markerGlow} style={{height: 40, width: 40}} />
                  </View>
                </MapView.Marker>
            </View>
         </MapView>
       </View>
     )
   }
 }

 const styles = StyleSheet.create({
   userIcon: {
     width: 40,
     height: 40,
    borderRadius: 50,
   },
   glow: {
      position: 'absolute',
      height: 130,
      width: 130,
    },
   container: {
     flex: 1,
     alignItems: 'center',
     justifyContent: 'center',
     backgroundColor: '#F5FCFF',
   },
   controlBar: {
     top: 24,
     left: 25,
     right: 25,
     height: 40,
     borderRadius: 4,
     position: 'absolute',
     flexDirection: 'row',
     alignItems: 'center',
     paddingHorizontal: 20,
     backgroundColor: 'white',
     justifyContent: 'space-between',
   },
   button: {
     paddingVertical: 8,
     paddingHorizontal: 20,
   },
   text: {
     fontSize: 16,
     fontWeight: 'bold'
   },
 })
