import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Text,
  View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import SearchBar from 'react-native-searchbar';

import axios from 'axios';
import polyline from 'google-polyline';

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = this.getInitialState()

    this.layout = {
      width: 350,
      height: 150
    }
  }

  getInitialState() {
    return {
      region: {
        latitude: -22.8145624,
        longitude: -47.0594595,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      },
      destination: '',
      origin: 'Predio Inovasoft',
      routes: null
    };
  }

  onRegionChange = (region) => {
    this.setState({ region })
  }

  handleChangeText = (text) => {
    this.setState({ text })
  }

  // Important: You must return a Promise
  beforeFocus = () => {
      return new Promise((resolve, reject) => {
          console.log('beforeFocus');
          resolve();
      });
  }

  // Important: You must return a Promise
  onFocus = (text) => {
      return new Promise((resolve, reject) => {
          console.log('onFocus', text);
          resolve();
      });
  }

  // Important: You must return a Promise
  afterFocus = () => {
      return new Promise((resolve, reject) => {
          console.log('afterFocus');
          resolve();
      });
  }

  onSubmitEditing = (e) => {
    console.log(e.nativeEvent.text)
    axios.get('https://14902f8d.ngrok.io/destination', {
      params: {
        origin: this.state.origin,
        destination: this.state.destination
      }
    })
      .then(response => {
        const routes =
          response.data['coriginDest']
            .route
            .map(({legs}) => {
              console.log(legs)
              return legs
            })
            .map(({steps}) => {
              console.log(steps)
              return steps
            })
            .map(({polyline: { points }}) => {
              console.log(points)
              return polyline.decode(points)
            })
            .reduce((acc, curVal) => acc.concat(curVal))
            .map((coord) => ({latitude: coord[0], longitude: coord[1]}))
        console.log(routes)
        this.setState({ routes })

      })
      .catch(err => {
        console.log(err)
      })
  }

  renderRoute = () => {
    if (this.state.routes !== null) {
      return (
        <MapView.Polyline
            coordinates={[ ...this.state.routes ]}
            strokeWidth={4}
        />
      )
    }
  }

  render() {
    const items = [
      'Viracopos',
      'Predio Inovasoft'
    ]
    return (
      <View style={{
        flex: 1,
        flexDirection: 'column',
        position: 'relative',
        marginTop: 23}}
      >
        <TextInput
          style={{
            textAlign: 'left',
            height: 40,
            borderWidth: 1,
            borderColor: '#009688',
            borderRadius: 7,
            backgroundColor : "#FFFFFF",
            margin: 7,
            padding: 7
          }}
          onChangeText={(destination) => this.setState({ destination })}
          value={this.state.destination}
          underlineColorAndroid='transparent'
          placeholder="Search here..."
          onSubmitEditing={this.onSubmitEditing}
        />
        <MapView style={{flex: 1}}
          region={this.state.region}
          onRegionChangeComplete={this.onRegionChange}
        >
        {this.renderRoute()}
        </MapView>
      </View>
    );
  }
}
