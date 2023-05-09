export const AuthInitialState = {
    auth: {
        access_token: '',
        refresh_token: '',
        isLoggedIn: false,
        loggedInUserDetails: null,
        token_type: '',
        expires_in: 0,
        isGettingPublicToken: false,
        isLocked: false,
        lockedMessage: ''
    }
};