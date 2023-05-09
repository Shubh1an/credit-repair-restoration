import React, { useEffect, useRef, useState } from "react";

export const MenuComponent = (props: any) => {
    const wrapperRef: any = useRef();

    const [open, setOpen] = useState(false);
    const { containerCssClass, iconComponent, subComponents } = props;

    const handleClickOutside = (event: any) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);
    return (
        <>
            <li className={"nav-item dropdown " + containerCssClass}>
                <a ref={wrapperRef} href="/" className="nav-link" onClick={e => {
                    e.preventDefault();
                    setOpen(!open);
                }}>
                    {iconComponent}
                </a>

                <div className={"dropdown-menu drop_down " + (open ? "d-block" : 'd-none')}>
                    <div className="menus">
                        {subComponents}
                    </div>
                </div>
            </li>
        </>
    );

};