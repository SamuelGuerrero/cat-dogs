import { StatusBar } from "expo-status-bar";
import {
  Button,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import * as React from "react";

import * as tf from "@tensorflow/tfjs";

export default function App() {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();
  const [prediction, setPrediction] = useState("Perro");

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
  //"https://raw.githubusercontent.com/Bobingstern/TicTacToeAI/main/tfjs_app/model/model.json"
  const loadModel = async () => {
    await tf.ready();
    console("Funciona")
  };

  const getModel = () => {
    return fetch(
      "https://storage.googleapis.com/tfjs-models/tfjs/mnist_transfer_cnn_v1/model.json"
    )
      .then((response) => response.json())
      .then((model) => {
        console.warn(model)
        return model;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const predict = async (image) => {
    const prediction = await model.predict(image);
    return prediction;
  };

  const takePic = async () => {
    const options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    const newPhoto = await cameraRef.current.takePictureAsync(options);

    setPhoto(newPhoto);
  };

  if (photo) {
    return (
      <View className="w-full h-full flex-1 justify-center bg-[#FCF7F8]">
        <SafeAreaView className="flex-1 items-center justify-center">
          <View>
            {prediction ? (
              <Text className="text-[#4E8098] font-semibold text-4xl">
                {prediction}
              </Text>
            ) : undefined}
          </View>
          <View className="shadow-xl shadow-black">
            <Image
              source={{ uri: "data:image/jpg;base64," + photo.base64 }}
              className="w-72 h-72 rounded-xl"
            />
          </View>
          <View className="w-full h-20 bg-[#4E8098] rounded-tr-2xl rounded-tl-2xl absolute bottom-0">
            <View className="flex flex-row w-full space-x-20 h-full justify-center items-center">
              {hasMediaLibraryPermission ? (
                <TouchableOpacity
                  className="bg-[#90C2E7] flex justify-center items-center rounded-lg h-12 w-28 shadow-lg shadow-black"
                  onPress={loadModel}
                >
                  <Text className="text-[#FCF7F8] text-xl font-bold">
                    Predecir
                  </Text>
                </TouchableOpacity>
              ) : undefined}
              <TouchableOpacity
                className="bg-[#A31621] flex justify-center items-center rounded-lg h-12 w-28 shadow-lg shadow-black "
                onPress={() => setPhoto(undefined)}
              >
                <Text className="text-[#FCF7F8] text-xl font-bold">
                  Descartar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <Camera
      ratio="20:10"
      className="flex-1 flex items-center justify-center"
      ref={cameraRef}
    >
      <Text className="mb-3 text-white font-semibold text-xl">
        Centre la imágen en el cuadro
      </Text>
      <View
        style={{ borderColor: "#000", width: 280, height: 280, borderWidth: 3 }}
      ></View>
      <View className="bg-white absolute bottom-12">
        <Button title="Tomar foto" onPress={takePic} />
      </View>
      <StatusBar style="auto" />
    </Camera>
  );
}
