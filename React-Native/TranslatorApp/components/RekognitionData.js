import React, { Component } from 'react';
import { ScrollView, Picker, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';

export default class RekognitionData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rekognitionDataLoaded: false,
            option: 'text',
            iso639: 'es',
            languageAndISO: [],
            label: [],
            text: [],
            timePassed: false,
            errorRekognitionData: false,
            LabelData: false,
            TextData: false
        };
    }

    async componentDidMount() {
        await this.getLanguageAndIso();

        if (!this.state.rekognitionDataLoaded) {
            setTimeout(() => {
                this.setState({ timePassed: true })
                this.getRekognitionData();
                this.setState({ LabelData: this.getLabelData() });
                this.setState({ TextData: this.getTextData() });
                this.translateText();
                this.translateLabel();
            }, 15000);
        }
    }

    render() {
        let languageNames = Object.keys(this.state.languageAndISO);
        let PickerItems = languageNames.map((s, i) => {
            return <Picker.Item key={i} value={this.state.languageAndISO[s]} label={s} />
        });

        if (this.state.timePassed == false) {
            return (
                <View style={styles.activityIndicator}>
                    <Text>Processing Image...</Text>
                    <ActivityIndicator size='large' color='red' />
                </View>
            );
        }
        else if (this.state.errorRekognitionData == true) {
            return (
                <View style={styles.activityIndicator}>
                    <Text>There has been an error processing the data... Please return</Text>
                </View>
            );
        }
        else {
            return (

                <View style={styles.container}>
                    <TouchableOpacity style={styles.textButton} onPress={() => this.setState({ option: 'text' })}>
                        <Text style={styles.buttonText}>Text</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.labelButton} onPress={() => this.setState({ option: 'label' })}>
                        <Text style={styles.buttonText}>Labels</Text>
                    </TouchableOpacity>


                    <View style={styles.pickerContainerLangauge}>
                        <Picker
                            style={{ color: 'black' }}
                            selectedValue={this.state.iso639}
                            onValueChange={(itemValue, itemIndex) => {
                                //alert(itemValue);
                                this.setState({ iso639: itemValue });
                                setTimeout(() => {
                                    this.translateText();
                                    this.translateLabel();
                                }, 2000)
                            }
                            }>
                            {PickerItems}
                        </Picker>
                    </View>


                    <ScrollView style={styles.scrollviewStyle}>
                        {
                            this.state.option == 'text' ?
                                (
                                    <View style={styles.originalTextView}>
                                        {this.state.TextData}
                                    </View>
                                )
                                :
                                (
                                    <View style={styles.originalTextView}>
                                        {this.state.LabelData}
                                    </View>
                                )

                        }
                        {
                            this.state.option == 'text' ?
                                (
                                    <View style={styles.translatedTextView}>
                                        {this.getTranslatedTextData()}
                                    </View>
                                )
                                :
                                (
                                    <View style={styles.translatedTextView}>
                                        {this.getTranslatedLabelData()}
                                    </View>
                                )
                        }
                        {/* <Text>{this.state.translateText}</Text> */}
                    </ScrollView>
                </View>
            );
        }
    }

    getRekognitionData = () => {
        if (!this.props.navigation.getParam("rekognitionData")) {
            console.log("Error with Rekognition data");
            this.setState({ errorRekognitionData: true });
        } else {
            //console.log("Rekognition data got");
            var parsed = JSON.parse(this.props.navigation.getParam("rekognitionData"));
            // parsed.label;
            // parsed.text;
            this.setState({
                label: parsed.label,
                text: parsed.text,
                rekognitionDataLoaded: true
            });
        }

        // this.state.label.map((data) => {
        //     console.log(data);
        // })
    }

    translateText = async () => {
        let apigatewayURI = 'https://govaf15dfa.execute-api.eu-west-1.amazonaws.com/live/translate';

        await fetch(apigatewayURI, {
            method: 'POST',
            body: JSON.stringify({
                "wordList": this.state.text,
                "iso639": this.state.iso639
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ TranslatedTextData: responseJson.responseList });
            });
    }

    translateLabel = async ()=>{
        let apigatewayURI = 'https://govaf15dfa.execute-api.eu-west-1.amazonaws.com/live/translate';

        await fetch(apigatewayURI, {
            method: 'POST',
            body: JSON.stringify({
                "wordList": this.state.label,
                "iso639": this.state.iso639
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ TranslatedLabelData: responseJson.responseList });
            });
    }

    getTranslatedTextData = () => {
        if (this.state.TranslatedTextData) {
            let TextData = this.state.TranslatedTextData.map((data) => {
                //console.log(data);
                return <Text style={styles.textStyle}>{data}</Text>
            })
            return TextData;
        } else {
            return <Text style={styles.textStyle}>Empty</Text>;
        }
    }

    getTranslatedLabelData = () => {
        if (this.state.TranslatedLabelData) {
            let TextData = this.state.TranslatedLabelData.map((data) => {
                //console.log(data);
                return <Text style={styles.textStyle}>{data}</Text>
            })
            return TextData;
        } else {
            return <Text style={styles.textStyle}>Empty</Text>;
        }
    }

    getLabelData = () => {
        if (this.state.label) {
            let LabelData = this.state.label.map((data) => {
                return <Text style={styles.textStyle}>{data}</Text>
            })
            return LabelData;
        } else {
            return <Text style={styles.textStyle}>Empty</Text>;
        }
    }

    getTextData = () => {
        if (this.state.text) {
            let TextData = this.state.text.map((data) => {
                return <Text style={styles.textStyle}>{data}</Text>
            })
            return TextData;
        } else {
            return <Text style={styles.textStyle}>Empty</Text>;
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
                this.setState({ languageAndISO: parsed });
                //alert(JSON.stringify(this.state.storageData));
            })
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#add8e6'
    },
    textStyle:{
        fontSize: 16,
    },
    originalTextView: {
        position: 'absolute',
        width: 195
    },
    translatedTextView: {
        //position: 'absolute',
        marginLeft:200,
    },
    activityIndicator: {
        fontSize: 20,
        fontWeight: 'bold',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 20
    },
    textButton: {
        position: 'absolute',
        zIndex: 11,
        left: '10%',
        top: '5%',
        backgroundColor: '#e6bbad',
        width: 120,
        height: 65,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 1,
    },
    labelButton: {
        position: 'absolute',
        zIndex: 11,
        right: '10%',
        top: '5%',
        backgroundColor: '#e6bbad',
        width: 120,
        height: 65,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 1,
    },
    pickerContainerLangauge: {
        position: 'absolute',
        backgroundColor: '#e6d8ad',
        left: '25%',
        top: '20%',
        width: 200,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black'
    },
    scrollviewStyle: {
        // position: 'absolute',
        backgroundColor: '#e6d8ad',
        marginTop: '45%',
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10
    }
});
