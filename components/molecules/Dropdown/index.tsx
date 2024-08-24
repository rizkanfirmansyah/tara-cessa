'use client'
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useEffect, useState } from "react";

interface DropdownProps {
    title: string;
    className?: string;
    children: ReactNode;
    header?: any;
    isOpen?: boolean;
    onDropdownClick?: any;
    icon?: IconProp;
}

export default function Dropdown({ title, children, header, className, icon, onDropdownClick, isOpen }: DropdownProps) {
    // useEffect(() => {
    //     if (title) {
    //         onDropdownClick(null);
    //     }
    // }, [title, onDropdownClick]);

    return (
        <div className="relative inline-block text-left">
            <div className={`flex font-regular text-muted dark:bg-gray-900 bg-white dark:text-light px-4 py-1 cursor-pointer border-[1px] items-center rounded-3xl border-muted text-sm capitalize ${className}`} onClick={onDropdownClick}>
                {!header && (
                    <>
                        {title}
                        < FontAwesomeIcon icon={icon ?? faAngleDown} className="w-4 ps-1" />
                    </>
                )}
                {header}
            </div>

            <div className={`${isOpen ? 'block' : 'hidden'} absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-600`} role="menu" aria-orientation="vertical" aria-labelledby="menu-button" data-id="-1">
                <div className="py-1 dark:text-light " role="none">
                    {children}
                </div>
            </div>
        </div >
    )
}