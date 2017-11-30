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
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
                listLocation: []
            }
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
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    }
                });
            },
            error => console.log(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
        this.watchID = navigator.geolocation.watchPosition(position => {
            this.setState({
                region: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                }
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
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    }
                });
            },
            error => console.log(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }

    render() {
        // const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    rotateEnabled={false}
                    onRegionChange={region => this.setState({ region })}
                    onRegionChangeComplete={region => this.setState({ region })}
                    /* mapType={"hybrid"} */
                    region={this.state.region}
                >
                </MapView>

                <TouchableOpacity
                    onPress={() => this.moveToCurrentLocation()}
                    style={styles.currentLocation}
                >
                    <Image
                        source={require("./img/CurrentLocation.png")}
                        style={styles.logocurrentLocation}
                    />
                </TouchableOpacity>
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
    actionButton: {
        position: "absolute",
        width: 30,
        height: 30,
        top: "2.5%",
        left: "5%",
        zIndex: 10
    },
    marker: {
        width: 50,
        height: 50
    },
    currentLocation: {
        position: "absolute",
        width: 60,
        height: 60,
        top: "85%",
        left: "80%",
        zIndex: 10
    },
    logocurrentLocation: {
        width: 60,
        height: 60
    },
    titleMarker: {
        width: 160,
        height: 160
    }
});