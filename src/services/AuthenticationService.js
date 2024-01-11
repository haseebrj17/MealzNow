import axios from 'axios';
import { ApiContants } from '../assets/constants';
import { authHeader } from '../utils/Generator';

const AuthRequest = axios.create({
    baseURL: ApiContants.BACKEND_API.BASE_API_URL,
});

const register = async user => {
    try {
        let requestBody = {
            Id: null,
            FullName: user?.FullName,
            EmailAddress: user?.EmailAddress,
            ContactNumber: user?.ContactNumber,
            Password: user?.Password,
            CustomerDevice: [
                {
                    DeviceId: user?.CustomerDevice[0].deviceId,
                    IsActive: user?.CustomerDevice[0].isActive,
                }
            ]
        };
        let registerResponse = await AuthRequest.post(
            ApiContants.BACKEND_API.REGISTER,
            requestBody
        );
        console.log(registerResponse)
        if (registerResponse?.status === 200) {
            return {
                status: true,
                message: 'Registration Successful',
                data: registerResponse?.data,
            }
        } else {
            return {
                status: false,
                message: 'Registration failed'
            }
        }
    } catch (error) {
        console.log(error);
        return { status: false, message: 'Oops! Something went wrong' };
    }
};

const login = async user => {
    try {
        let requestBody = {
            EmailAddress: user?.EmailAddress,
            Password: user?.Password
        };
        let loginResponse = await AuthRequest.post(
            ApiContants.BACKEND_API.LOGIN,
            requestBody
        );
        console.log(loginResponse)
        if (loginResponse?.status === 200) {
            return {
                status: true,
                message: 'Login successful',
                data: loginResponse?.data,
            }
        } else {
            return {
                status: false,
                message: 'Invalid credentials',
            };
        }
    } catch (error) {
        console.log(error);
        return { status: false, message: 'Oops! Something went wrong' };
    }
};

const checkUserExist = async (type, value) => {
    try {
        let params = { [type]: value };
        let userCheckResponse = await AuthRequest.get(
            ApiContants.BACKEND_API.USER_EXIST,
            { params },
        );
        return userCheckResponse?.data;
    } catch (error) {
        console.log(error);
        return { status: false, message: 'Oops! Something went wrong' };
    }
};

const phoneVerification = async codeData => {
    try {
        let requestBody = {
            Code: codeData?.code,
            Id: codeData?.id
        };
        console.log(requestBody)
        let verificationResponse = await axios.post(
            `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.VERIFICATION}`,
            requestBody
        );
        console.log(`Response Body ${verificationResponse}`)
        if (verificationResponse?.status === 200) {
            return {
                status: true,
                message: `Verification Successfull`,
                data: verificationResponse?.data,
            };
        } else {
            return {
                status: false,
                message: `Invalid code`,
            };
        }
    } catch (error) {
        console.log(error);
        return { status: false, message: 'Something went wrong' };
    }
}

const refreshToken = async () => {
    try {
        let tokenResponse = await AuthRequest.post(
            ApiContants.BACKEND_API.REFRESH_TOKEN,
        );
        if (tokenResponse?.status === 200) {
            return { status: true, data: tokenResponse?.data };
        } else {
            return { status: false };
        }
    } catch (error) {
        console.log(error);
        return { status: false, message: 'Oops! Something went wrong' };
    }
};

const deleteUserAccount = async (token) => {
    console.log(token)
    try {
        let deletionResponse = await axios.post(
            `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.DELETE_USER_ACCOUNT}`,
            {},
            {
                headers: authHeader(token),
            }
        );

        if (deletionResponse?.status === 200) {
            return { status: true };
        } else {
            return { status: false };
        }
    } catch (error) {
        console.log(error);
        return { status: false, message: 'Oops! Something went wrong' };
    }
};

export default { register, login, phoneVerification, checkUserExist, refreshToken, deleteUserAccount };