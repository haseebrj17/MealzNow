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

const placeOrder = async (inputs, token) => {
    console.log(`UserService | placeOrder`);
    try {
        let response = await axios.post(
            `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.ORDER}`,
            { ...inputs },
            {
                headers: authHeader(token),
            }
        );

        return handleResponse(response, 'Order placed successfully');
    } catch (error) {
        console.error('Detailed API call error:', JSON.stringify(error, null, 2));
        return {
            status: true,
            message: error?.response?.data?.message || `Failed to place order`,
        };
    }
};

export default {
    placeOrder
}