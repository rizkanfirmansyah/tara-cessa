"use client"
import { useAuth } from "@/app/AuthProvider";
import { MetaContext } from "@/app/MetaProvider";
import { Dropdown, ToogleMode } from "@/components";
import { UserType } from "@/types";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Header({ }) {
    const metaContext = useContext(MetaContext);
    const router = useRouter();
    const [nameUser, setNameUser] = useState("")
    let user: UserType | null = null;
    const { logout } = useAuth();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleDropdownClick = (dropdownId: string) => {
        setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && window !== null) {
            const userData = localStorage.getItem('user');
            user = userData ? JSON.parse(userData) : '{ "name": "Unknown"}';
            if (user) {
                setNameUser(user?.name)
            }
        }
        let isLoggedIn = typeof window !== null && localStorage.getItem('token');
        if (!isLoggedIn) {
            router.replace('/login');
        }
    }, [router])

    const title = metaContext ? metaContext.title : "Dashboard";
    const imgElement = <><img src="https://i.ibb.co/gd5RRwz/Ellipse-7.png" className="rounded-full w-[35px]" alt="An example image" width="50" height={50} /><span className="ml-3">{nameUser}</span></>;
    const notificationEl = <button>
        <FontAwesomeIcon icon={faBell} className="w-6 dark:text-light" />
    </button>;
    return (
        <header className="flex py-6 px-8 border-b-2 shadow-md border-light dark:border-gray-700 z-20 relative no-print">
            <div className="flex justify-between items-center w-full">
                <h1 className="text-subtitle font-medium">{title} { }</h1>
                <div className="flex justify-between w-44">
                    <Dropdown title="awdaw" header={imgElement} className="h-9 border-primary px-0 py-0 border-none w-44" isOpen={openDropdown === 'basic-info'}
                        onDropdownClick={() => handleDropdownClick('basic-info')}>
                        <a href="#" className=" dark:hover:text-dark hover:bg-light block px-4 py-2 text-sm" role="menuitem" id="menu-item-0">Profile</a>
                        <a href="#" className=" dark:hover:text-dark hover:bg-light block px-4 py-2 text-sm" role="menuitem" id="menu-item-1">Settings</a>
                        <ToogleMode />
                        <a href="#" onClick={() => {
                            logout()
                            router.push('/login')
                        }} className=" dark:hover:text-dark hover:bg-light block px-4 py-2 text-sm" role="menuitem" id="menu-item-2">Logout</a>
                    </Dropdown>
                </div>
            </div>
        </header>
    )
}