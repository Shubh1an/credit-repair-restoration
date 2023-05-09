import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import ReactAutocomplete from 'react-autocomplete';
import { Spinner } from 'reactstrap';
import { useDebounce } from 'use-debounce';

import { IDropdown } from '../../models/interfaces/shared';
import { Messages } from '../constants';

export const AutoComplete = (props: {
    value: string | IDropdown,
    minSearchLength?: number;
    asyncData: (searchText: string, source: CancelTokenSource) => Promise<IDropdown[]>;
    onSelect?: (data: any) => any,
    onChange?: (data: any) => any,
    placeholder?: string;
    showSubmitArrow?: boolean;
    isTextArea?: boolean;
    avoidMergeChangeWithSelectEvent?: boolean;
    autoFocus?: boolean;
}) => {

    const [text, setText] = useState('' as string);
    const [debouncedText] = useDebounce(text, 500);
    const [minSearchLength] = useState(props?.minSearchLength || 3);
    const inputRef: any = useRef();
    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [loading, setLoading] = useState(false);
    const [disableSearch, setDisableSearch] = useState(true);
    const [suggestions, setSuggestions] = useState([] as IDropdown[]);


    useEffect(() => {
        return () => {
            if (axiosSource?.cancel)
                axiosSource?.cancel(Messages.APIAborted);
        }
    }, []);
    useEffect(() => {
        const t = typeof (props?.value) === 'object' ? props?.value?.name : props?.value;
        setText(t || '');
        inputRef.current.value = t;
    }, [props.value]);

    const onChange = (typedString: string) => {
        setDisableSearch(false);
        setText(typedString);
        if (props.onSelect && !props.avoidMergeChangeWithSelectEvent)
            props.onSelect(typedString);
        if (props?.onChange) {
            props?.onChange(typedString);
        }
    }
    useEffect(() => {
        if (disableSearch) {
            return;
        }
        if (axiosSource) {
            axiosSource.cancel();
            setLoading(false);
        }
        if (props?.onChange) {
            props?.onChange(debouncedText);
        }
        const source = axios.CancelToken.source();
        setAxiosSource(source);
        if (debouncedText?.length >= minSearchLength) {
            setLoading(true);
            props?.asyncData(debouncedText, source)
                .then((suggs: IDropdown[]) => {
                    setLoading(false);
                    setSuggestions(suggs);
                }).catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setLoading(false);
                    }
                })

        }
    }, [debouncedText]);
    const onSelect = (value: string, item: IDropdown) => {
        setDisableSearch(true);
        setText(item?.name ?? '');
        if (props.onSelect)
            props.onSelect(item);
        if (props?.onChange) {
            props?.onChange(item);
        }
    }
    const makeQueries = (displayText?: string): string => {
        try {
            if (text) {
                return displayText?.replace(new RegExp(text, 'gi'), '<b>' + text + '</b>') ?? '';
            } else {
                return displayText ?? '';
            }
        } catch (e) {
            return displayText ?? '';
        }
    }
    return (
        <div className="auto-complete-container position-relative" title={text}>
            <span className="search-icon">
                <i className="fa fa-search" aria-hidden="true"></i>
            </span>
            <ReactAutocomplete
                getItemValue={(item: IDropdown) => item.name || ''}
                items={suggestions}
                renderInput={(prop: any) => {
                    return (props?.isTextArea
                        ? <textarea {...prop} className="form-control"></textarea>
                        : <input {...prop} />);
                }}
                renderItem={(item: IDropdown, isHighlighted: boolean) =>
                    <div className="line-item" key={item?.abbreviation}
                        style={{ background: isHighlighted ? 'lightgray' : 'white' }}
                        dangerouslySetInnerHTML={{
                            __html: makeQueries(item.name)
                        }}
                    ></div>
                }
                inputProps={{
                    style: {
                        display: 'block',
                        width: '100%',
                        padding: '7px 8px 7px 25px',
                        fontSize: '12px',
                        height: (props?.isTextArea ? '85px' : 'auto'),
                        lineHeight: 'normal',
                        borderBottomColor: ((text ? text?.trim() : '') ? '#aaa' : '#ccc')
                    },
                    placeholder: props?.placeholder ?? 'Search ...',
                    autoFocus: props?.autoFocus
                }}
                ref={inputRef}
                value={text?.trimStart()}
                onChange={(e: any) => onChange(e.target.value)}
                onSelect={onSelect}
                menuStyle={{
                    display: (loading ? 'none' : 'block'),
                    borderRadius: '3px',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '90%',
                    position: 'fixed',
                    zIndex: 99999,
                    overflow: 'auto',
                    maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
                }}
            />
            {
                loading &&
                <span className="loading-icon">
                    <Spinner size="sm" color="secondary" />
                </span>
            }
            {
                !loading && !!text?.length &&
                <span className="cross-icon" >
                    <i className="fa fa-times pointer text-danger f-14 " onClick={() => {
                        inputRef.current.value = '';
                        setText('');
                        onChange('');
                    }} aria-hidden="true"></i>
                    {
                        props?.showSubmitArrow &&
                        <i className="fa fa-arrow-right pointer text-success ml-2" onClick={() => !!props?.onSelect && props.onSelect(text)}></i>
                    }
                </span>
            }
        </div>
    );
}