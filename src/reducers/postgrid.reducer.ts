import produce from "immer";
import { IPayLoad } from "../models/interfaces/shared";
import { PostGridInitialState } from "./postgrid.initalState";
import { PostgridActionTypes } from "../actions/postgrid.action-types";

export function PostGridReducer(
  state = PostGridInitialState,
  action: IPayLoad
): any {
  return produce(state, (draft) => {
    switch (action.type) {
      case PostgridActionTypes.SET_CONTACT_LIST:
        draft.contactList = [...action.payload];
        break;
      case PostgridActionTypes.SET_TEMPLATE_LIST:
        draft.templateList = [...action.payload];
        break;

      default:
        break;
    }
  });
}
