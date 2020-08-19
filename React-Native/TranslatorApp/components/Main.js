import React, { Component } from 'react';
import { ScrollView, AsyncStorage, Picker, StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import TextContainer from './TextContainer';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';


export default class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            beforeTranslation: '',
            iso639: 'es',
            afterTranslation: '',
            textArray: [],
            storageData: [],
            image: null,
            timePassed: false,
            translatedTexts: null
        };
    }

    async componentDidMount() {
        setTimeout(() => {
            this.setState({ timePassed: true })
        }, 3000);

        await this.getLanguageAndIso();


        let textArr = await AsyncStorage.getItem('translationArray');
        textArr = JSON.parse(textArr);
        if (textArr) {
            // console.log("IN HERE");
            this.state.textArray = textArr;
        }


    }

    render() {
        let translatedTexts = <Text></Text>

        if (this.state.textArray) {
            translatedTexts = this.state.textArray.map((val, key) => {
                return <TextContainer key={key} keyval={key} val={val} />
            });
        }

        let languageNames = Object.keys(this.state.storageData);
        let PickerItems = languageNames.map((s, i) => {
            return <Picker.Item key={i} value={this.state.storageData[s]} label={s} />
        });

        if (!this.state.timePassed) {
            return (
                // <ActivityIndicator size='large' color='red' />
                <Image
                    style={{ width: '100%', height: '100%',}}
                    source={require('../assets/splashimage.png')}
                />
            );
        }
        else {
            return (
                <ScrollView style={styles.scrollviewContainer}>

                    <View style={styles.textAreaContainer}>
                        <TextInput
                            style={styles.textarea}
                            numberOfLines={10}
                            multiline={true}
                            underlineColorAndroid="transparent"
                            placeholder="Translate here"
                            onChangeText={(beforeTranslation) => this.setState({ beforeTranslation })}
                            value={this.state.beforeTranslation}
                        />

                        {/* Should only appear when text is written */}
                        <TouchableOpacity onPress={this.getTranslationFromAPI.bind(this)} style={styles.addButton}>
                            {/* <Text style={styles.addButtonText}>-></Text> */}
                            <Ionicons name="md-arrow-dropright" size={44} color="white" />
                        </TouchableOpacity>

                    </View>

                    <View style={styles.pickerContainer}>
                        <Picker
                            style={{ color: 'black' }}
                            selectedValue={this.state.iso639}
                            onValueChange={(itemValue, itemIndex) => this.setState({ iso639: itemValue })}>
                            {PickerItems}
                        </Picker>
                    </View>

                    <TouchableOpacity onPress={this.clearAll} style={styles.clearAll}>
                        <MaterialIcons name="clear-all" size={44} color="red" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.selectImage} style={styles.getFile}>
                        <Ionicons name="md-photos" size={44} color="red" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.takePicture} style={styles.takePicture}>
                        <Ionicons name="md-camera" size={44} color="yellow" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.uploadImage} style={styles.uploadImage}>
                        <Ionicons name="md-cloud-upload" size={44} color="green" />
                    </TouchableOpacity>

                    <View style={styles.translatedtext}>
                        {translatedTexts}
                    </View>

                    
                </ScrollView>
            );
        }
    }

    selectImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        })

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    }

    takePicture = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: false
        });
        this.setState({ image: result.uri });
    }

    uploadImage = async () => {

        if (this.state.image) {
            this.setState({ isUploading: true });
            let apigatewayURI = 'http://ec2-34-245-180-162.eu-west-1.compute.amazonaws.com:8081/postData';

            //let apigatewayURI = 'https://03troj7gx2.execute-api.eu-west-1.amazonaws.com/live/upload'


            let uploadData = new FormData();
            uploadData.append('BucketName', 'translator-app-images');
            uploadData.append('ImageFile', { type: 'image/jpg', uri: this.state.image, name: this.state.image });

            const str = uploadData.getParts().find(item => item.fieldName === 'ImageFile');
            var last = (str.name.substring(str.name.lastIndexOf("/") + 1, str.name.length));
            this.setState({ imageName: last });

            await fetch(apigatewayURI, {
                method: 'POST',
                body: uploadData
            })
                .catch((error) => {
                    this.setState({ isUploading: false });
                    console.log("ERROR: " + error);
                    //Alert.alert('Error', 'Error on network.');
                });

            //alert(this.state.image);
            this.getRekognitionData();
        }
        else {
            alert("Please take a photo or choose an already existing image");
        }

        this.setState({ image: '' });
    }

    getRekognitionData = async () => {
        this.props.navigation.navigate('Image');
        let apigatewayURI = 'https://6dfo6k99d2.execute-api.eu-west-1.amazonaws.com/live/data';

        await fetch(apigatewayURI, {
            method: 'POST',
            body: JSON.stringify({
                "bucketname": 'translator-app-images',
                "imagename": this.state.imageName
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ rekognitionData: JSON.stringify(responseJson) });
                this.props.navigation.navigate('Image', { rekognitionData: JSON.stringify(responseJson) });
            });
    }


    getTranslationFromAPI = async () => {
        if (this.state.beforeTranslation) {
            await fetch('https://52rw378pw9.execute-api.eu-west-1.amazonaws.com/live/translate', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "text": this.state.beforeTranslation,
                    "iso639": this.state.iso639
                })
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({ afterTranslation: responseJson.text });
                })
                .then(() => {

                    this.state.textArray.push({
                        'translatedText': this.state.afterTranslation,
                        'originalText': this.state.beforeTranslation
                    });
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        this.setState({ textArray: this.state.textArray });
        this.setState({ beforeTranslation: '' });

        // Store array locally to save data
        var stringifiedArray = JSON.stringify(this.state.textArray);
        AsyncStorage.setItem('translationArray', stringifiedArray);
    }

    clearAll = () => {
        if(this.state.textArray){
            AsyncStorage.removeItem('translationArray');
        }
    }

    getLanguageAndIso = async () => {
        //console.log("in getLanguageandISO function");
        await fetch('https://t952jxc7o0.execute-api.eu-west-1.amazonaws.com/live/data')
            .then((response) => response.json())
            .then((responseJson) => {
                // alert(JSON.stringify(responseJson));
                var parsed = JSON.parse(JSON.stringify(responseJson));
                parsed = parsed.languages;
                this.setState({ storageData: parsed });
                //alert(JSON.stringify(this.state.storageData));
            })
    }

}

const styles = StyleSheet.create({
    scrollviewContainer: {
        flex: 1,
        backgroundColor: '#add8e6'
    },
    pickerContainer: {
        backgroundColor: '#e6d8ad',
        marginLeft: 20,
        width: 210,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black'
    },
    getFile:{
        position: 'absolute',
        right: 135,
        top: 195,
    },
    takePicture:{
        position: 'absolute',
        right: 80,
        top: 195,
    },
    uploadImage:{
        position: 'absolute',
        right: 20,
        top: 195,
    },
    clearAll:{
        left:345,
    },
    textAreaContainer: {
        borderColor: 'grey',
        borderWidth: 1,
        padding: 10,
        margin: 10,
        borderRadius: 10,
        backgroundColor: 'white'
    },
    textarea: {
        height: 150,
        justifyContent: "flex-start",
        textAlignVertical: 'top',
        fontSize: 20,
    },
    addButton: {
        position: 'absolute',
        zIndex: 11,
        right: 20,
        bottom: 25,
        backgroundColor: '#e6bbad',
        width: 65,
        height: 65,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 24,
    },
    translatedtext: {
        flex: 1,
    }
});
