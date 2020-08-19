import React, { Component } from 'react';
import { View,StyleSheet, ScrollView } from 'react-native';

import Container from './components/Navigator';

export default class App extends Component {
  render() {
    return (
        <Container />
      // <ScrollView style={styles.container}>
      //   <Header />
      //   <Container />
      // </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#add8e6'
  },
});
