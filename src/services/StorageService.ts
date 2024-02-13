import { MMKV } from 'react-native-mmkv';
import { UserData } from '../types/general';

const storage = new MMKV();

const setFirstTimeUse = () => {
    return storage.set('isFirstTimeUse', 'true');
};

const getFirstTimeUse = () => {
    return storage.getString('isFirstTimeUse');
};

const setOrderPlaced = () => {
    return storage.set('orderPlaced', 'true');
};

const getOrderPlaced = () => {
    return storage.getString('orderPlaced');
};

const setToken = (token: string) => {
    return new Promise((resolve, reject) => {
        try {
            storage.set('token', token);
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

const getToken = () => {
    return storage.getString('token');
};

const setUserData = (userData: UserData) => {
    return new Promise((resolve, reject) => {
        try {
            storage.set('userData', JSON.stringify(userData));
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

const getUserData = () => {
    return storage.getString('userData');
};

const setAppleUser = (val: string) => {
    return storage.set('appleUser', JSON.stringify(val));
}

const setGoogleUser = (val: string) => {
    return storage.set('googleUser', JSON.stringify(val));
}

const getAppleUser = async () => {
    const appleUser = await storage.getString('appleUser');
    return appleUser !== null ? JSON.parse(appleUser ?? '') : null;
}

const getGoogleUser = async () => {
    const googleUser = await storage.getString('googleUser');
    return googleUser !== null ? JSON.parse(googleUser ?? '') : null;
}

const setLocation = async (location: any) => {
    return storage.set('location', location)
}

const getLocation = async () => {
    const location = storage.getString('location');
    return location !== null ? location : {};
}

const removeData = async (key: string) => {
    try {
        await storage.delete(key);
    } catch (error) {
        console.error(`Error removing data for key ${key}:`, error);
    }
};

const setDeviceToken = async (token: string) => {
    return storage.set('deviceToken', token);
}

const getDeviceToken = async () => {
    return storage.getString('deviceToken');
}

export default {
    setFirstTimeUse,
    getFirstTimeUse,
    setToken,
    getToken,
    setUserData,
    getUserData,
    getGoogleUser,
    getAppleUser,
    setGoogleUser,
    setAppleUser,
    getLocation,
    setLocation,
    removeData,
    setDeviceToken,
    getDeviceToken
};