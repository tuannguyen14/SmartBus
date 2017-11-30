import React, { Component } from "react";
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    Button,
    TouchableOpacity,
    Image
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
// import { firebaseApp } from "../api/Firebase";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

let { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE = 0;
const LONGITUDE = 0;
const LATITUDE_DELTA = 0.03;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class MainScreen extends Component<{}> {
    constructor(props) {
        super(props);
        // this.itemRef = firebaseApp.database().ref("Users");
        this.state = {
            region: new MapView.AnimatedRegion({
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            }),
            listLocation: []
        };
    }

    componentWillMount() {
        // this.setState({
        //     listLocation: this.getAllLocation()
        // });
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            position => {
                this.setState({
                    region: new MapView.AnimatedRegion({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    }
                    )
                });
            },
            error => console.log(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
        this.watchID = navigator.geolocation.watchPosition(position => {
            this.setState({
                region: new MapView.AnimatedRegion({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                }
                )
            });
        });
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    onRegionChange(region) {
        this.setState({ region });
    }

    moveToCurrentLocation() {
        navigator.geolocation.getCurrentPosition(
            position => {
                this.setState({
                    region: new MapView.AnimatedRegion({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    }
                    )
                });
            },
            error => console.log(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }

    findLocation(data, details) {
        this.setState({
            region: new MapView.AnimatedRegion({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            })
        });
    }

    render() {
        // const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <MapView.Animated
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    rotateEnabled={false}
                    onRegionChange={region => this.setState({ region })}
                    onRegionChangeComplete={region => this.setState({ region })}
                    /* mapType={"hybrid"} */
                    region={this.state.region}
                >
                </MapView.Animated>
                <View style={styles.autocomplete}>
                    <GooglePlacesAutocomplete
                        placeholder='Nhập vị trí cần tìm'
                        minLength={1} // minimum length of text to search
                        autoFocus={false}
                        returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                        listViewDisplayed='auto'    // true/false/undefined
                        fetchDetails={true}
                        styles={{
                            textInputContainer: {
                                backgroundColor: 'rgba(0,0,0,0)',
                                borderTopWidth: 0,
                                borderBottomWidth: 0,
                                width: '100%',
                            },
                            textInput: {
                                marginLeft: 0,
                                marginRight: 0,
                                height: 38,
                                color: '#5d5d5d',
                                fontSize: 16,
                                borderRadius: 30
                            },
                            predefinedPlacesDescription: {
                                color: '#1faadb',
                            },
                            listView: {
                                marginTop: "3%",
                                backgroundColor: "#FFFFFF"
                            }
                        }}
                        currentLocation={false}
                        renderDescription={row => row.description} // custom description render
                        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                            this.findLocation(data, details);
                        }}
                        query={{
                            // available options: https://developers.google.com/places/web-service/autocomplete
                            key: 'AIzaSyDgZw-tjWixWlhbduJY7WXMq8iTdT8tT_g',
                            country: 'vi',
                            language: 'vi', // language of the results
                            // types: '(cities)' // default: 'geocode'
                        }}
                        nearbyPlacesAPI='GooglePlacesSearch'
                    />
                </View>
                <View style={styles.currentLocationContainer}>
                    <TouchableOpacity
                        onPress={() => this.moveToCurrentLocation()}
                    >
                        <Image
                            source={require("../img/CurrentLocation.png")}
                            style={styles.logocurrentLocation}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        height: "100%",
        width: "100%",
        zIndex: -1
    },
    marker: {
        width: 50,
        height: 50
    },
    currentLocationContainer: {
        backgroundColor: "#3F51B5",
        position: "absolute",
        width: 60,
        height: 60,
        top: "85%",
        left: "80%",
        zIndex: 10,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',

    },
    logocurrentLocation: {
        width: 36,
        height: 36
    },
    titleMarker: {
        width: 160,
        height: 160
    },
    autocomplete: {
        margin: "5.6%",
        marginTop: "7%",
        width: "86%",
        position: "absolute",
        zIndex: 10,
        alignItems: 'center'
    }
});