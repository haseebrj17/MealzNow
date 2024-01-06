import { ApiContants } from '../assets/constants';
import axios from 'axios';
import { authHeader, dashboardHeader, franchisesHeader } from '../utils/Generator';

const getFranchises = async ({ clientId }) => {
    console.log(`DashboardService | getFranchises`);
    try {
        const requestBody = {
            Id: clientId
        };

        const headers = {
            'Content-Type': 'application/json'
        };

        let franchiseResponse = await axios.post(
            `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.FRANCHISES}`,
            requestBody,
            { headers }
        );
        if (franchiseResponse?.status === 200) {
            return {
                status: true,
                message: `Franchise data fetched`,
                data: franchiseResponse?.data
            };
        } else {
            return {
                status: false,
                message: `Franchise data not found. If Error Block`,
            };
        }
    } catch (error) {
        console.log('Catch Error:', error);
        console.log('Catch Error Response:', error.response);
        return {
            status: false,
            message: `Franchise data not found. Catch Error Block`,
        };
    }
}

const getDashboard = async ({ FranchiseId }) => {
    console.log(`DashboardService | getDashboard`);
    try {
        const requestBody = {
            Id: FranchiseId
        };

        const headers = {
            'Content-Type': 'application/json'
        };
        let dashboardResponse = await axios.post(
            `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.DASHBORAD}`,
            requestBody,
            { headers }
        );
        if (dashboardResponse?.status === 200) {
            const clientId = dashboardResponse?.data?.ClientId;
            const franchiseId = dashboardResponse?.data?.FranchiseId;
            const banners = dashboardResponse?.data?.Banners;
            const packages = dashboardResponse?.data?.Packages;
            const products = dashboardResponse?.data?.Products;
            const brands = dashboardResponse?.data?.Brands;
            const categories = dashboardResponse?.data?.Categories;
            const allSubCategories = dashboardResponse?.data?.AllSubCategories;
            return {
                status: true,
                message: `Dashboard data fetched`,
                data: {
                    clientId,
                    franchiseId,
                    banners,
                    packages,
                    products,
                    brands,
                    categories,
                    allSubCategories
                },
            };
        } else {
            return {
                status: false,
                message: `Dashboard data not found. If Error Block`,
            };
        }
    } catch (error) {
        console.log('Catch Error:', error);
        return {
            status: false,
            message: `Dashboard data not found. Catch Error Block`,
        };
    }
};

const getCategories = async ({ FranchiseId }) => {
    console.log(`DashboardService | getCategories`);
    try {
        const requestBody = {
            Id: FranchiseId
        };
        const headers = {
            'Content-Type': 'application/json'
        };
        let categoriesResponse = await axios.post(
            `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.CATEGORIES}`,
            requestBody,
            { headers }
        );
        if (categoriesResponse?.status === 200) {
            const categories = dashboardResponse?.data?.categories;
            return {
                status: true,
                message: `Categories data fetched`,
                data: { categories },
            };
        } else {
            return {
                status: false,
                message: `Categories data not found. If Error Block`,
            };
        }
    } catch (error) {
        console.log('Catch Error:', error);
        return {
            status: false,
            message: `Categories data not found. Catch Error Block`,
        };
    }
};

const getProducts = async ({ categoryId }) => {
    console.log(`DashboardService | getProducts`);
    try {
        const requestBody = {
            Id: categoryId
        };

        const headers = {
            'Content-Type': 'application/json'
        };
        let productResponse = await axios.post(
            `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.PRODUCTS}`,
            requestBody,
            { headers }
        );
        if (productResponse?.status === 200) {
            return {
                status: true,
                message: `Product data fetched`,
                data: productResponse?.data,
            };
        } else {
            return {
                status: false,
                message: `Product data not found. If Error Block`,
            };
        }
    } catch (error) {
        return {
            status: false,
            message: `Product data not found. Catch Error Block`,
        };
    }
};

const getProductById = async dishId => {
    console.log(`DashboardService | getProductById`);
    console.log(dishId)
    try {
        const requestBody = {
            Id: dishId
        };
        const headers = {
            'Content-Type': 'application/json'
        };
        let singleProductResponse = await axios.post(
            `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.PRODUCT}`,
            requestBody,
            { headers }
        );
        if (singleProductResponse?.status === 200) {
            return {
                status: true,
                message: `Product data fetched`,
                data: singleProductResponse?.data,
            };
        } else {
            return {
                status: false,
                message: `Product data not found`,
            };
        }
    } catch (error) {
        return {
            status: false,
            message: `Product data not found`,
        };
    }
};

export default {
    getFranchises,
    getDashboard,
    getCategories,
    getProducts,
    getProductById
};