import { ISharedState } from "../models/interfaces/shared";

export const SharedState = {
    isLoaderShown: false,
    isLoaderShownInner: false,
    loaderInnerMessage: '',
    AuthRules: null,
    currentAccessibleScreens: null
} as ISharedState;