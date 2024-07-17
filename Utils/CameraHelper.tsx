//@ts-nocheck
import * as ImagePicker from 'expo-image-picker';

export const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
        alert("You've refused to allow this appp to access your camera!");
        return;
    }

    const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // aspect: [4, 4],
        quality: 0.5,
    });
    // console.log("camerAPickerResult", result);

    // Explore the result
    // console.log(result);

    if (!result.cancelled) {
        return result;
    } else {
        return null
    }
}