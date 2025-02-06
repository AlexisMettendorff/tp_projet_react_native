import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import {
  useCameraPermissions,
  CameraView,
  BarcodeScanningResult,
} from "expo-camera";
import { useRouter } from 'expo-router';

export default function App() {
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();

  useEffect(() => {
    if (!permission?.granted && permission?.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (!permission.granted) {
    return <Text>No access to camera</Text>;
  }

  const handleBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    setScanned(true);
    router.push({ pathname: "/add-meal", params: { barcode: data } });
  };

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: [
            "qr",
            "ean13",
            "ean8",
            "upc_a",
            "upc_e",
            "code128",
            "code39",
            "code93",
            "itf14",
            "pdf417",
            "aztec",
            "datamatrix",
          ],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});
