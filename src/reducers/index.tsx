import { combineReducers } from "redux";

import { SharedReducer } from "../shared/shared-reducer";
import { AuthReducer } from "./auth.reducer";
import { CustomerViewReducer } from "./customer-view.reducer";
import { DashboardReducer } from "./dashboard.reducer";
import { CreateLetterReducer } from "./create-letter.reducer";
import { FastEditReducer } from "./fast-edit-accounts.reducer";
import { PostGridReducer } from "./postgrid.reducer";

export const combinedReducer = combineReducers({
  authModel: AuthReducer,
  dashboardModel: DashboardReducer,
  customerViewModel: CustomerViewReducer,
  createLetterModel: CreateLetterReducer,
  fastEditModel: FastEditReducer,
  sharedModel: SharedReducer,
  postGridModel: PostGridReducer,
});
