const config = require('../../../package.json').projectConfig;
const BACKEND_BASE_URL = config.backendApiBaseUrl;

const COUNTRY_FLAG = {
    BASE_URL: `https://flagsapi.com`,
    SIZE: { 16: '16.png', 24: '24.png', 32: '32.png', 48: '48.png', 64: '64.png' },
    STYLE: { FLAT: 'flat', SHINY: 'shiny' },
};

const STATIC_IMAGE = {
    BASE_URL: `${BACKEND_BASE_URL}/images`,
    TYPE: { POSTER: 'poster', LOGO: 'logo', GALLERY: 'gallery' },
    SIZE: { SQUARE: 'square', LANDSCAPE: 'landscape', PORTRAIT: 'portrait' },
    QUALITY: { SD: 'sd', HD: 'hd' },
};

const BACKEND_API = {
    BASE_API_URL: `${BACKEND_BASE_URL}/api`,
    FRANCHISES: '/GetClientFranchises',
    DASHBORAD: '/GetAppDashboardData',
    REGISTER: '/Register',
    LOGIN: '/CustomerLogin',
    VERIFICATION: '/VerifyPin',
    ADD_ADDRESS: '/CustomerAddAddress',
    UPDATE_ADDRESS: '/CustomerUpdateAddress',
    GET_ADDRESS: '/GetCustomerAddresses',
    ORDER: '/PlaceOrder',
    GET_ORDER: '/GetCustomerOrders',
    DELETE_USER_ACCOUNT: '/DeleteMyAccount'
};

export default { COUNTRY_FLAG, BACKEND_API, STATIC_IMAGE }
