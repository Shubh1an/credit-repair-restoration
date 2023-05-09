import React, { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';

export const asyncComponent = (importComponent: any) => {

    const AsyncComponent = (props: any) => {
        const [state, setState] = useState({
            component: null,
            isLoading: true,
            unloaded: false
        })
        // adding feature of loading/spinner until component gets loaded
        useEffect(() => {
            if (!state?.unloaded) {
                setState({
                    isLoading: true,
                    component: null,
                    unloaded: false
                });
            }
            const proms = importComponent().then(({ default: component }: any) => {
                if (!state?.unloaded) {
                    setState({
                        component,
                        isLoading: false,
                        unloaded: false

                    });
                }
            }).catch((err: any) => {
                if (!state?.unloaded) {
                    setState({
                        component: null,
                        isLoading: false,
                        unloaded: false
                    });
                }
            });
            return () => {
                setState({
                    component: null,
                    isLoading: false,
                    unloaded: false
                })
                return proms;
            }
        }, [])

        const { component: D, isLoading }: any = state;

        return (D ? <D {...props} /> : isLoading
            ? <div className='async-loading'> <Spinner size='sm' className='text-secodary mr-1' /> loading ...</div> : null);

    }
    return AsyncComponent;
}