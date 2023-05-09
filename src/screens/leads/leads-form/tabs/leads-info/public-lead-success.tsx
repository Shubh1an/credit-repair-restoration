import React from 'react'

export const PublicLeadSuccessComponent = () => {
    return (
        <div className='d-flex align-items-center flex-column justify-content-center w-100 h-100'>
            <div className='text-success f-200'>
                <i className='fa fa-check-circle'></i>
            </div>
            <div className='text-success f-25'>
                Thank you! One of our agents will be in touch soon.
            </div>
        </div>
    )
}
