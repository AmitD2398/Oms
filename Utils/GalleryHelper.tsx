//@ts-nocheck
import * as ImagePicker from 'expo-image-picker';

export const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
        alert("You've refused to allow this appp to access your photos!");
        return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // aspect: [4,4],
        quality: 0.5,
    });
    // console.log("imagePickerResult", result);

    if (!result.cancelled) {
        return result;
    } else {
        return null
    }
}





