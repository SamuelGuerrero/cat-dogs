import { StatusBar } from "expo-status-bar";
import {
  Button,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Camera } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import * as React from "react";

import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

export default function App() {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();
  const [prediction, setPrediction] = useState("Gato");

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    <Text>
      Permission for camera not granted. Please change this in settings.
    </Text>;
  }

  const predict = async (newPhoto) => {
    // const modelJson = require("./tfjs_target_dir/model.json");

    const model = await tf.loadLayersModel('https://raw.githubusercontent.com/justin0u0/NTHU-OAuth-Decaptcha/master/cnn-decaptcha/model/tensorflowjs/model.json');

    console.warn("JAJA");

    const imageTensor = tf.browser.fromPixels({ uri: newPhoto.uri });
    const processedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);
    const inputTensor = tf.expandDims(processedImage, 0);
    const predictions = await model.predict(inputTensor);
    console.log("Predictions:", predictions);
  };

  const takePic = async () => {
    const options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    const newPhoto = await cameraRef.current.takePictureAsync(options);

    setPhoto(newPhoto);
    predict(newPhoto);
  };

  if (photo) {
    const sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    const savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    return (
      <ImageBackground
        style={{
          width: "100%",
          height: "100%",
          flex: 1,
          justifyContent: "center",
        }}
        source={{ uri: "https://i.postimg.cc/wML28nQp/Al-Ed-fondo.png" }}
      >
        <SafeAreaView style={styles.containerMain}>
          <View>
            {prediction ? (
              <Text style={styles.predictionText}>{prediction}</Text>
            ) : undefined}
          </View>
          <Image
            source={{ uri: "data:image/jpg;base64," + photo.base64 }}
            style={{ width: 280, height: 280, borderRadius: 10 }}
          />
          <View
            style={{ display: "flex", flexDirection: "row", marginTop: 40 }}
          >
            {hasMediaLibraryPermission ? (
              <Button title="Guardar" onPress={savePhoto} />
            ) : undefined}
            <Button
              style={{ backgroundColor: "#FFF" }}
              title="Descartar"
              onPress={() => setPhoto(undefined)}
            />
          </View>
          {/* <Text style={{ color: "#ff0000" }}>{prediction}</Text> */}
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <Camera ratio="20:10" style={styles.container} ref={cameraRef}>
      <Text style={styles.predictionText}>Centre la imágen en el cuadro</Text>
      <View
        style={{ borderColor: "#000", width: 280, height: 280, borderWidth: 3 }}
      ></View>
      <View style={styles.buttonContainer}>
        <Button title="Tomar foto" onPress={takePic} />
      </View>
      <StatusBar style="auto" />
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  predictionText: {
    marginBottom: 10,
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
  },
  containerMain: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  buttonContainer: {
    backgroundColor: "#FFF",
    position: "absolute",
    bottom: 50,
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
  },
});
