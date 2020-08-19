import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

export default class TextContainer extends Component {
    render() {
        return (
            <View key={this.props.keyval} style={styles.container}>
                <Text style={styles.translatedText}>{this.props.val.translatedText}</Text>
                <Text style={styles.originalText}>{this.props.val.originalText}</Text>

                {/* Output speech button*/}
                <TouchableOpacity onPress={this.speak.bind(this)} style={styles.outputSpeechButton}>
                    {/* <Text style={{ color: 'white' }}>O</Text> */}
                    <FontAwesome name="file-audio-o" size={28} color="white" />
                </TouchableOpacity>

            </View>
        );
    }

    speak() {
        Speech.speak(this.props.val.translatedText);
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        borderRadius: 10,
        backgroundColor: 'white',
        marginTop: 5,
        marginLeft: 20,
        marginRight: 20,
        paddingRight: 90
    },
    translatedText: {
        marginLeft: 10,
        padding: 5,
        fontSize: 16,
    },
    originalText: {
        marginLeft: 10,
        padding: 5,
        fontSize: 12,
    },
    outputSpeechButton: {
        position: 'absolute',
        zIndex: 11,
        top: 10,
        right: 5,
        bottom: 15,
        backgroundColor: '#8f442c',
        width: 40,
        height: 40,
        borderRadius: 20,
        borderRightWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 1,
    },
});
