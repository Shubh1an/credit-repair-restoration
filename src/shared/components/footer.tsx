import React from 'react';

export const FooterComponent = (props: any) => {
    return (
        <footer className={"main-footer " + (!props?.isLoggedIn ? 'ml-0' : '')} >
            <strong>Copyright © 2020-2021 AccountProgress.</strong> All rights reserved.
        </footer>
    );
};