import React from "react";
import { View } from "react-native";
import MainScreen from "./src/MainScreen";

export default class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <MainScreen />
      </View>
    );
  }
}