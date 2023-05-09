import classnames from 'classnames';
import React from 'react';

import { IAlphabetProps } from '../../models/interfaces/shared';

export const AlphabetLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
    'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

export const AlphabetComponent = (props: IAlphabetProps) => {
    return (
        <div className="alphas">
            <span className='label'>
                {
                    props?.text
                }
            </span>
            {
                AlphabetLetters.map((text: string) => {
                    return (
                        <span className={classnames('letters', { 'active': text?.toLowerCase() === props?.selected?.toLowerCase() })}
                            key={text} onClick={() => props.onSelect(text)}>
                            {text}
                        </span>
                    );
                })
            }
        </div>
    );
}