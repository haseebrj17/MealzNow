interface authHeaderProps {
    token: string;
}

interface generalHeaderProps {
    clientId: string;
}

/**
 * Generates an Authorization header for bearer token authentication.
 * @param {string} token - The token to be included in the header.
 * @returns {Object} An object representing the Authorization header.
 */
const authHeader = (props: authHeaderProps) => ({ Authorization: `Bearer ${props.token}` });

/**
 * Generates an Authorization header for dashboard access using bearer token.
 * @param {string} clientId - The client ID to be included in the header.
 * @returns {Object} An object representing the Authorization header.
 */
const generalHeader = (props: generalHeaderProps) => ({ Authorization: `Bearer ${props.clientId}` });

export { authHeader, generalHeader };
