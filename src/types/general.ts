export interface UserData {
    Id: string;
    FullName: string;
    EmailAdress: string,
    ContactNumber: string,
    UserRole: string,
    FranchiseId: string,
    exp: number;
    iss: string;
    aud: string;
}

export interface GeneralState {
    isAppLoading: boolean;
    token: string;
    isFirstTimeUse: boolean;
    userData: UserData;
    location: any;
}