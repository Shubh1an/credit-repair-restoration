import React, { useEffect, useState } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import toastr from 'toastr';
import axios, { CancelTokenSource } from 'axios';

import { ICheckboxListNew, ICreateCredCCBCCTempLetterRequest, ICreateLetterInitialState, ICreateSingleTempLetterRequest, ICreateTempLetterRequest, ISearchForLetter, ISelectedAccounts } from '../../../../models/interfaces/create-letter';
import { EnumBureausShorts, LetterSearchTypes } from '../../../../models/enums';
import { IDropdown } from '../../../../models/interfaces/shared';
import { ButtonComponent } from '../../../../shared/components/button';
import { SearchLetters } from '../../../../shared/components/search-letters';
import { saveSearchedLetter, saveAdvanceOption } from '../../../../actions/create-letter.actions';
import { Messages } from '../../../../shared/constants';
import { createCRALetter, createCredBCCLetter, saveActiveTabNumber, reloadTempLetter, createBureauLetter } from '../../../../actions/create-letter.actions';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        saveSearchedLetter,
        saveAdvanceOption,
        createCRALetter,
        createBureauLetter,
        createCredBCCLetter,
        saveActiveTabNumber,
        reloadTempLetter
    }, dispatch);
}
const mapStateToProps = (state: any) => {
    return {
        model: state?.createLetterModel
    }
}
export const SearchForLetterComponent = connect(mapStateToProps, mapDispatchToProps)((props: ISearchForLetter) => {

    const [loadingSingle, setLoadingSingle] = useState(false);
    const [loadingCred, setLoadingCred] = useState(false);
    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);

    useEffect(() => {
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, []);
    const onLetterSearch = (val: IDropdown, bureau: LetterSearchTypes) => {
        props.saveSearchedLetter(val, bureau);
    }
    const getLetterType = (bureau: string): LetterSearchTypes => {
        let type;
        switch (bureau?.toLowerCase()) {
            case 'tu':
                type = LetterSearchTypes.TransUnion;
                break;
            case 'exp':
                type = LetterSearchTypes.Experian;
                break;
            case 'eqf':
                type = LetterSearchTypes.Equifax;
                break;
            case 'bcc':
                type = LetterSearchTypes.BCC;
                break;
            case 'cc':
                type = LetterSearchTypes.CC;
                break;
            case 'creditor':
                type = LetterSearchTypes.Creditor;
                break;
            default:
                type = LetterSearchTypes.ChexSystems;
                break;
        }
        return type;
    }
    const validate = () => {
        const model = props?.model;
        if (!model?.letterSource?.sources?.length) {
            toastr.error('Please select letter source from Step#1');
            return false;
        } else {
            const sources = model?.letterSource?.sources?.map((x: string) => x) as string[];
            const stateKeys = Object.getOwnPropertyNames(model);
            const allLettersSet = sources.every(x => stateKeys.includes(x)) ||
                ((sources.includes(EnumBureausShorts.TU) || sources.includes(EnumBureausShorts.EXP) || sources.includes(EnumBureausShorts.EQF)
                    && !model?.advanced));
            if (!allLettersSet) {
                toastr.error('Please select letter template(s) from Step#2');
                return false;
            }
        }
        const accountsSelected = model?.selectedAccounts ? Object.getOwnPropertyNames(model?.selectedAccounts)
            ?.filter(key => model?.selectedAccounts[key] && !!model?.selectedAccounts[key]?.length && !!model?.selectedAccounts[key]?.filter((x: ICheckboxListNew) => x?.checked)?.length) : [];
        if (!accountsSelected?.length) {
            toastr.error('Please select atleast one account from accounts list below.');
            return false;
        }
        return true;
    }
    const onGenerateTempPreviewLetter = () => {
        if (validate()) {
            let craLetter, tuLetter, expLetter, eqfLetter, creditorLetter;
            let accountIdsTU, accountIdsEXP, accountIdsEQF, credAccItds;
            const model = props?.model as ICreateLetterInitialState;
            const selectedAccounts = props.model?.selectedAccounts as ISelectedAccounts;
            const selectedAccountKeys = Object.getOwnPropertyNames(selectedAccounts);
            const sources = model?.letterSource?.sources?.map((x: string) => x) as string[];
            const stateKeys = Object.getOwnPropertyNames(model);
            const templetTypes = Object.values(LetterSearchTypes);
            const letters = stateKeys?.filter((x: string) => !!(props?.model[x] || props?.model[x]?.length) && templetTypes.includes(x as any));

            accountIdsTU = selectedAccountKeys?.filter(x => (selectedAccounts[x])?.some(m => m?.checked && m?.text === EnumBureausShorts.TU)) || [];
            accountIdsEXP = selectedAccountKeys?.filter(x => (selectedAccounts[x])?.some(m => m?.checked && m?.text === EnumBureausShorts.EXP)) || [];
            accountIdsEQF = selectedAccountKeys?.filter(x => (selectedAccounts[x])?.some(m => m?.checked && m?.text === EnumBureausShorts.EQF)) || [];
            credAccItds = selectedAccountKeys?.filter(x => (selectedAccounts[x])?.some(m => m?.checked && m?.text === EnumBureausShorts.CREDITOR)) || [];

            if ((sources?.includes(EnumBureausShorts.TU) || sources?.includes(EnumBureausShorts.EQF) || sources?.includes(EnumBureausShorts.EXP))) {
                if (!model?.advanced) {
                    craLetter = model[LetterSearchTypes.CRA];
                    const payload = {
                        accountIdsEQF, accountIdsEXP, accountIdsTU,
                        createTU: sources?.includes(EnumBureausShorts.TU),
                        createEXP: sources?.includes(EnumBureausShorts.EXP),
                        createEQF: sources?.includes(EnumBureausShorts.EQF),
                        customerId: props?.cid,
                        letterId: craLetter?.id
                    } as ICreateSingleTempLetterRequest;
                    saveSingleLetter(payload); // CRA save/single save
                } else {
                    const payload = {
                        accountIdsEQF, accountIdsEXP, accountIdsTU,
                        createTU: letters?.includes(LetterSearchTypes.TransUnion),
                        createEXP: letters?.includes(LetterSearchTypes.Experian),
                        createEQF: letters?.includes(LetterSearchTypes.Equifax),
                        customerId: props?.cid
                    } as ICreateTempLetterRequest;
                    if (letters?.includes(LetterSearchTypes.TransUnion)) {
                        tuLetter = model[LetterSearchTypes.TransUnion];
                        payload.letterIdTU = tuLetter?.id;
                    }
                    if (letters?.includes(LetterSearchTypes.Experian)) {
                        expLetter = model[LetterSearchTypes.Experian];
                        payload.letterIdEXP = expLetter?.id;
                    }
                    if (letters?.includes(LetterSearchTypes.Equifax)) {
                        eqfLetter = model[LetterSearchTypes.Equifax];
                        payload.letterIdEQF = eqfLetter?.id;
                    }
                    saveBureauLetter(payload); // Bureau Save Letter
                }
            }
            if (letters?.includes(LetterSearchTypes.Creditor)) {
                creditorLetter = model[LetterSearchTypes.Creditor];
                const payload = {
                    customerId: props?.cid,
                    letterId: creditorLetter?.id,
                    accounts: credAccItds?.map(x => model.accounts?.find(m => m.id === x))
                        ?.map(x => ({ accountID: x?.id, accountName: x?.collectorName, accountNameLowered: x?.collectorName?.toLowerCase() }))
                } as ICreateCredCCBCCTempLetterRequest;
                saveCredLetter(payload); // creditor save
            }
        }
    }
    const saveSingleLetter = (payload: ICreateSingleTempLetterRequest) => {
        setLoadingSingle(true);
        props.createCRALetter(payload, axiosSource)
            .then((result: boolean) => {
                setLoadingSingle(false);
                if (result) {
                    toastr.success('Your temp letters have been generated to the Temp Letter Preview Queue.');
                    props.saveActiveTabNumber(2);
                    props?.reloadTempLetter(true);
                }
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoadingSingle(false);
                }
            })
    }
    const saveBureauLetter = (payload: ICreateTempLetterRequest) => {
        setLoadingSingle(true);
        props.createBureauLetter(payload, axiosSource)
            .then((result: boolean) => {
                setLoadingSingle(false);
                if (result) {
                    toastr.success('Your temp letters have been generated to the Temp Letter Preview Queue.');
                    props.saveActiveTabNumber(2);
                    props?.reloadTempLetter(true);
                }
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoadingSingle(false);
                }
            })
    }
    const saveCredLetter = (payload: ICreateCredCCBCCTempLetterRequest) => {
        setLoadingCred(true);
        props.createCredBCCLetter(payload, axiosSource)
            .then((result: boolean) => {
                setLoadingCred(false);
                if (result) {
                    toastr.success('Your temp letters have been generated to the Temp Letter Preview Queue.');
                    props.saveActiveTabNumber(2);
                    props?.reloadTempLetter(true);
                }
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoadingCred(false);
                }
            })
    }
    return (
        <div className="search-letter mt-4">
            <fieldset className="customer-field-set mt-2 f-11 letter-fieldset">
                <legend className="f-11">
                    <label>Step#2: Search Letter </label>
                </legend>
                <div className="search-for-letters  pb-3 pt-2 pl-2 pr-2 pl-sm-0 pr-sm-0">
                    {
                        !!props?.model?.letterSource?.sources?.length &&
                        <div className="mb-2">
                            {
                                !props?.model?.advanced && (!!props?.model?.letterSource?.sources?.filter((x: LetterSearchTypes) => x !== LetterSearchTypes.Creditor)?.length) ?
                                    <div className="row m-0">
                                        <div className="col-12 col-sm-3 pr-0 d-flex align-items-center">
                                            <label>CRA</label>
                                        </div>
                                        <div className="col-12 col-sm-9 pl-0 ">
                                            <SearchLetters minSearchLength={1} type={LetterSearchTypes.CRA} defaultValue={props?.model[LetterSearchTypes.CRA]?.name || ''}
                                                onSelectedData={(e: any) => onLetterSearch(e, LetterSearchTypes.CRA)} placeholder="Type to search..." />
                                        </div>
                                    </div>
                                    :
                                    props?.model?.letterSource?.sources?.filter((x: LetterSearchTypes) => x !== LetterSearchTypes.Creditor)?.map((bureau: LetterSearchTypes, index: number) => {
                                        return (
                                            <div className="row m-0 mt-1" key={index}>
                                                <div className="col-sm-3 pr-0 d-flex align-items-center">
                                                    <label>{bureau}</label>
                                                </div>
                                                <div className="col-sm-9 pl-0">
                                                    <SearchLetters minSearchLength={1} type={getLetterType(bureau)} defaultValue={props?.model[bureau]?.name || ''}
                                                        onSelectedData={(e: any) => onLetterSearch(e, getLetterType(bureau))} placeholder="Type to search..." />
                                                </div>
                                            </div>
                                        );
                                    })

                            }
                            {
                                (!!props?.model?.letterSource?.sources?.filter((x: string) => x !== LetterSearchTypes.Creditor)?.length) &&
                                <div className="text-right">
                                    <button className="btn btn-link f-11" onClick={() => { props.saveAdvanceOption(!props?.model?.advanced) }}>
                                        {props?.model?.advanced ? 'Choose Single Option' : 'Advance Options'}
                                    </button>
                                </div>
                            }
                            {
                                props?.model?.letterSource?.sources?.filter((x: string) => x === LetterSearchTypes.Creditor)?.map((bureau: string, index: number) => {
                                    return (
                                        <div className="row m-0 mt-1" key={index}>
                                            <div className="col-sm-3 pr-0 d-flex align-items-center">
                                                <label>{bureau}</label>
                                            </div>
                                            <div className="col-sm-9 pl-0">
                                                <SearchLetters minSearchLength={1} type={LetterSearchTypes.Creditor} defaultValue={props?.model[LetterSearchTypes.Creditor]?.name || ''}
                                                    onSelectedData={(e: any) => onLetterSearch(e, getLetterType(LetterSearchTypes.Creditor))} placeholder="Type to search..." />
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    }
                    <div className="text-center pt-2 pb-2">
                        <ButtonComponent spinnerRight={true} loading={loadingSingle || loadingCred} text={'Generate'}
                            disabled={!props?.model?.letterSource?.sources?.length} className="btn-secondary" onClick={onGenerateTempPreviewLetter} >
                            <i className="fa fa-arrow-right ml-2"></i>
                        </ButtonComponent>
                    </div>
                </div>
            </fieldset>
        </div>
    )
})
