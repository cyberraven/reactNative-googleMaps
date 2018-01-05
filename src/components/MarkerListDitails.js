

import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import MapView from "react-native-maps";

import markerIcon from '../images/test_icon_gym01.png';
import testLocations from '../testLocation/testcombine.json';
import POI_cycling from "../images/POI_cycling.png";
import POI_fitness from "../images/POI_fitness.png";
import POI_swimming from "../images/POI_swimming.png";

const  maxDistance = 200;
const icons = {
  markerIcons: [
    {
      src: POI_cycling,
    },
    {
      src: POI_fitness,
    },
    {
      src: POI_swimming,
    },
  ],
  user: {
    src: '../images/testUserIcon.png',
  },
}
export default class MarkerListDetails extends Component {

  constructor(props) {
    super(props);
    this.state.currentPosition = props;
    this.getMarkerDetails();
  }

  state = {
    markers: null,
    positionOfLastUpdate: null,
    region: null,
  };

  posDiff(pos) {
    if(this.state.positionOfLastUpdate == null) {
      this.state.positionOfLastUpdate = this.state.region;
      return true;
    }
    const distnace = Math.sqrt(
      Math.pow(this.positionOfLastUpdate.latitude - this.state.region.latitude, 2) +
      Math.pow(this.positionOfLastUpdate.longittude - this.state.region.longitude, 2));
    if(distance >= this.maxDistance) {
      this.state.positionOfLastUpdate = this.state.region;
      return true;
    }
    return false;
  }

  getMarkerDetails() {
    if(this.state.markers == null || this.posDiff()) {
      //console.log(JSON.stringify(testLocations, null, 4));
      this.state.markers = testLocations;
    }
  }
  parseCoordinate(poi) {
    const coordinate = {
      latitude: poi.lat,
      longitude: poi.lng,
    };
    return coordinate;
  }
  print() {
    console.log("hello i was pressed");
  }
  update(region) {
    //console.log("this is new region (update) " + JSON.stringify(region, null, 4));
    this.state.currentPosition = region;
    this.state.markers = null;
  }
   getIcon() {
    return(icons.markerIcons[Math.floor(Math.random() * icons.markerIcons.length)].src);
  }

  updateMarkers(region) {
    const markers = [];
    console.log('this is what i am getting back: ' + this.getIcon());
    this.state.markers.map((marker, index) => {
      if(index < 2000) {
        markers.push(
          <MapView.Marker
            key={index}
            coordinate={this.parseCoordinate(marker)}
            onPress={(e) => {this.print(e)}}
          >
            <Image
              style={{ width: 40, height: 40}}
              source={this.getIcon()}
            />
          </MapView.Marker>
        );
      }
    });
    //console.log("return markers: \n" + JSON.stringify(markers, null, 4));
    return markers;
  }
  renderMarker = (pin) => {
    return (
      <Marker
       key={pin.id}
       coordinate={pin.location}
       onPress={(e) => {this.print(e)}}>
         <Image
         style={{ width: 40, height: 40}}
         source={markerIcon}
         />
       </Marker>
    )
  }

  renderPoints() {
    const items = [];
    console.log("this is current pos data: \n" + JSON.stringify(this.state.currentPosition, null, 4) + Math.random());

    this.state.markers.map((marker, index) => {
      if(index < 200) {
        items.push(
          <MapView.Marker
             key={index}
             coordinate={this.parseCoordinate(marker)}
             onPress={(e) => {this.print(e)}}
           >
            <Image
              style={{ width: 40, height: 40}}
              source={markerIcon}
            />
          </MapView.Marker>
        )
      }
    });
      return (items);
  }

  render() {
    return (
      <View>
       {this.renderPoints()}
     </View>
    )
  }
}
