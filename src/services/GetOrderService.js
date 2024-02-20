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

const getUserOrder = async (token) => {
    console.log("UserService | getUserOrder");
    try {
        let requestBody = {};
        let response = await axios.post(
            `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.GET_ORDER}`,
            requestBody,
            {
                headers: authHeader(token),
            }
        );

        return handleResponse(response, 'Orders fetched successfully');
    } catch (error) {
        return {
            status: false,
            message: error?.response?.data?.message
                ? error?.response?.data?.message
                : `Failed to fetch orders`,
        }
    }
}

export default { getUserOrder };
