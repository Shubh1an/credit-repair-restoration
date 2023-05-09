import { IPayLoad } from "../models/interfaces/shared";

export const getAction = (actionType: string, payload: any = null): IPayLoad => ({ type: actionType, payload });