const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

const generalHeader = (clientId: string) => ({ Authorization: `Bearer ${clientId}` });

export { authHeader, generalHeader };
