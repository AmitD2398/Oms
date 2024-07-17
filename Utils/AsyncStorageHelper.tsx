
//@ts-nocheck
import AsyncStorage from '@react-native-async-storage/async-storage';


//for single string value
export const setItemInStorage = async (key, data) => {
    try {
        return await AsyncStorage.setItem(key, data);
    } catch (error) {
        return null;
        // console.log("AsyncStorageError::", error);
    }
};

//for single string value
export const getItemFromStorage = async key => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value) {
            return value;
        }
        return null;
    } catch (error) {
        return null;
        // console.log("AsyncStorageError::", error);
    }
};

//for single string value
export const removeItemFromStorage = async key => {
    try {
        return await AsyncStorage.removeItem(key);
    } catch (error) {
        return null;
        // console.log("AsyncStorageError::", error);
    }
};




//for object value
export const setObjectInStorage = async (key, data) => {
    try {
        return await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        return null;
        // console.log("AsyncStorageError::", error);
    }
};

//for object value
export const getObjectFromStorage = async key => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value) {
            return JSON.parse(value);
        }
        return null;
    } catch (error) {
        return null;
        // console.log("AsyncStorageError::", error);
    }
};



//for deletion of multiple key values
export const multiDeleteFromStorage = async keyArray => {
    try {
        return await AsyncStorage.multiRemove(keyArray);
    } catch (error) {
        return null;
        // console.log("AsyncStorageError::", error);
    }
};

//for clearing all local storage
export const clearStorage = async () => {
    try {
        return await AsyncStorage.clear();
    } catch (error) {
        return null;
        // console.log("AsyncStorageError::", error);
    }
};


//clears accessToken from local storage
export const clearTokenFromStorage = async () => {
    try {
        return await AsyncStorage.removeItem("accessToken");
    } catch (error) {
        return null;
        // console.log("AsyncStorageError::", error);
    }
};
