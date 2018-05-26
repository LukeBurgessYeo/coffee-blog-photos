import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Button
} from 'react-native'
import ImagePicker from 'react-native-image-picker'
import { AUTH, URL } from './env.js'

const options = {
  title: '',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
}

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      avatarSource: null,
      base64Image: '',
      file: '',
      disbleUpload: false,
      uploaded: null,
      gitResponse: ''
    }
  }

  getPicture = () => {
    this.setState({
      avatarSource: null,
      base64Image: '',
      file: '',
      disbleUpload: false,
      uploaded: null,
      gitResponse: ''
    })

    ImagePicker.showImagePicker(options, (response) => {
      if (response.error) {
        this.setState({
          disbleUpload: false,
          uploaded: true,
          gitResponse: 'Error getting image.'
        })
      }
      else if (!response.didCancel) {
        this.setState({
          avatarSource: { uri: response.uri },
          base64Image: response.data,
          file: response.fileName
        })
      }
    })
  }

  upload = () => {
    this.setState({disbleUpload: true})

    fetch(encodeURI(URL + this.state.file), {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': AUTH
      },
      body: JSON.stringify({
        message: "image added from CoffeeBlogPhotos",
        content: this.state.base64Image,
        //branch: 'dev'
      }),
    })
    .then((response) => (response.ok) ? response.json() : null)
    .then((responseJson) => {
      if (responseJson === null) {
        this.setState({
          disbleUpload: false,
          uploaded: false,
          gitResponse: 'Image upload failed.'
        })
      } else {
        this.setState({
          avatarSource: null,
          base64Image: '',
          file: '',
          disbleUpload: false,
          uploaded: true,
          gitResponse: 'Image uploaded successfully.'
        })
      }
    })
    .catch((error) => {
      this.setState({
        disbleUpload: false,
        uploaded: false,
        gitResponse: error
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          onPress={this.getPicture}
          title="Choose Photo"
          color="#841584"
          accessibilityLabel="Choose photo"
        />
        {this.state.avatarSource &&
          <View>
            <Image
              source={this.state.avatarSource}
              style={{
                width: 300,
                height: 300
              }}
            />
            <Button
              onPress={this.upload}
              title="Upload"
              color="#841584"
              accessibilityLabel="Upload"
              disabled={this.state.disbleUpload}
            />
          </View>}
          {this.state.disbleUpload && <Text>Uploading...</Text>}
          {(this.state.uploaded !== null) && <Text>{this.state.gitResponse}</Text>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
  }
})
