import { ICreateLetterInitialState, ICreateLetterSource, ISelectedAccounts } from '../models/interfaces/create-letter';

export const CreateLetterInitialState: ICreateLetterInitialState = {
   letterSource: { sources: [], isShowMore: true } as ICreateLetterSource,
   letterOptions: [],
   selectedAccounts: null,
   accounts: [],
   activeTab: 1,
   advanced: false,
   reloadTempLetter: false,
   reloadDisputeLetters: false,
   tempLetters: [],
   roundInfo: null
};