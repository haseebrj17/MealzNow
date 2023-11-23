import { ApiContants } from '../assets/constants';
import axios from 'axios';
import { authHeader } from '../utils/Generator';

const AuthRequest = axios.create({
    baseURL: ApiContants.BACKEND_API.BASE_API_URL,
});

const handleResponse = (response, successMessage) => {
    if (response?.status === 200) {
        return {
            status: true,
            message: successMessage,
            data: response?.data,
        };
    } else {
        return {
            status: false,
            message: response?.data?.message || 'Unknown error occurred',
        };
    }
};

const addUserAddress = async (inputs, token) => {
    console.log(`UserService | addUserAddress`);
    try {
        let requestBody = {
            Id: null,
            StreetAddress: inputs?.StreetAddress,
            House: inputs?.House,
            District: inputs?.District,
            UnitNumber: inputs?.UnitNumber,
            FloorNumber: inputs?.FloorNumber,
            Notes: inputs?.Notes,
            Tag: inputs?.Tag,
            IsDefault: inputs?.IsDefault,
            Latitude: inputs?.Latitude,
            Longitude: inputs?.Longitude,
            CityName: inputs?.CityName,
            CustomerId: inputs?.CustomerId,
            PostalCode: inputs?.PostalCode,
            CountryName: inputs?.CountryName,
            StateName: inputs?.StateName
        };

        console.log('Request body:', requestBody);

        let response = await axios.post(
            `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.ADD_ADDRESS}`,
            requestBody,
            {
                headers: authHeader(token),
            }
        );

        console.log(`Response by BackEnd ${response}`)

        return handleResponse(response, 'Address added successfully');
    } catch (error) {
        console.error('Detailed API call error:', JSON.stringify(error, null, 2));
        return {
            status: false,
            message: error?.response?.data?.message || `Failed to add Address`,
        };
    }
};

const updateUserAddress = async (user, address, token) => {
    console.log(`UserService | updateUserData`);
    try {
        let requestBody = {
            Id: user?.Id,
            StreetAddress: address?.streetAddress,
            House: address?.house,
            District: address?.district,
            UnitNumber: address?.unitNumber,
            FloorNumber: address?.floorNumber,
            Notes: address?.notes,
            Tag: address?.tag,
            Latitude: address?.latitude,
            Longitude: address?.longitude,
            City: address?.city
        };
        let response = await axios.post(
            `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.ADD_ADDRESS}`,
            requestBody,
            {
                headers: authHeader(token),
            }
        );

        return handleResponse(response, 'Address updated successfully');
    } catch (error) {
        return {
            status: false,
            message: error?.response?.data?.message
                ? error?.response?.data?.message
                : `Failed to update Address`,
        };
    }
};

const getUserAddresses = async ({ Id, token}) => {
    console.log("UserService | getUserAddresses");
    try {
        let requestBody = {
            Id: Id
        };
        let response = await axios.post(
            `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.GET_ADDRESS}`,
            requestBody,
            {
                headers: authHeader(token),
            }
        );
        console.log(response)

        return handleResponse(response, 'Address fetched successfully');
    } catch (error) {
        return {
            status: false,
            message: error?.response?.data?.message
                ? error?.response?.data?.message
                : `Failed to fetch Address`,
        }
    }
}

export default { addUserAddress, updateUserAddress, getUserAddresses };
