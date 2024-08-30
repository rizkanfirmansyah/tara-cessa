"use client";
import { useAuth } from "@/app/AuthProvider";
import { logoBlack, logoWhite } from "@/components/atoms/Images";
import { useSessionUser } from "@/components/store/userStore";
import { faBoxArchive, faDoorOpen, faHotel, faMessage, faShop, faSquareCaretLeft, faSquarePollVertical, faUsers, faPersonShelter, faRestroom } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "next-themes";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Sidebar() {
    const router = useRouter();
    const { systemTheme, theme, setTheme } = useTheme();
    const pathName = usePathname();
    const idPath = pathName.split("/").slice(0, 2).join("/");
    const user = useSessionUser((state) => state.user);
    const { logout } = useAuth();
    const menuData = [
        {
            text: "Main Menu",
            access: user.role.canManageData || 0,
        },
        {
            path: "/",
            icon: faSquarePollVertical,
            access: user.role.canManageData || 0,
            text: "Dashboard",
        },
        {
            path: "/property",
            icon: faBoxArchive,
            access: user.role.canManageHotels || 0,
            text: "Property",
        },
        {
            path: "/room_management",
            icon: faDoorOpen,
            access: user.role.canManageData,
            text: "Room Management",
        },
        {
            path: "/lounge_management",
            icon: faPersonShelter,
            access: user.role.canManageData,
            text: "Lounge Management",
        },
        {
            path: "/pooltable_management",
            icon: faRestroom,
            access: user.role.canManageData,
            text: "Pooltable Management",
        },
        {
            access: user.role.order || 0,
            text: "Apps",
        },
        {
            path: "/guest_order",
            icon: faShop,
            access: user.role.order || 0,
            text: "Order",
        },
        {
            path: "/chat",
            icon: faMessage,
            // access: user.role.frontdesk || 0,
            access: 0,
            text: "Chat",
        },
        {
            path: "/frontdesk",
            icon: faHotel,
            // access: user.role.frontdesk || 0,
            access: 0,
            text: "Front Desk",
        },
        {
            access: user.role.canManageUser,
            text: "Settings",
        },
        {
            path: "/user_management",
            icon: faUsers,
            access: user.role.canManageUser || 0,
            text: "User Management",
        },
        // {
        //     path: '/configuration',
        //     icon: faCog,
        //     access: user.role.canManageDevices || 0,
        //     text: 'Configuration',
        // },
    ];

    useEffect(() => {
        // if (idPath == "/" && user.role.canManageData == 0) {
        //     Alert({ icon: "warning", title: "ACCESS DENIED!" });
        //     setTimeout(() => {
        //         router.replace("/400");
        //     }, 2000);
        // }
        // if (idPath == "/property" && user.role.canManageHotels == 0) {
        //     Alert({ icon: "warning", title: "ACCESS DENIED!" });
        //     setTimeout(() => {
        //         router.replace("/400");
        //     }, 2000);
        // }
        // if (idPath == "/guest_order" && user.role.frontdesk == 0) {
        //     Alert({ icon: "warning", title: "ACCESS DENIED!" });
        //     setTimeout(() => {
        //         router.replace("/400");
        //     }, 2000);
        // }
        // if (idPath == "/user_management" && user.role.canManageUser == 0) {
        //     Alert({ icon: "warning", title: "ACCESS DENIED!" });
        //     setTimeout(() => {
        //         router.replace("/400");
        //     }, 2000);
        // }
    }, []);
    const currentTheme = theme === "system" ? systemTheme : theme;

    return (
        <aside className={`dark:bg-gray-900 transition-all duration-500 bg-white flex flex-col min-h-screen col-span-2 border-r-[1px] border-light dark:border-gray-700 no-print`}>
            {/* <div className="flex justify-between items-center desktop-lg:px-12 desktop-xl:px-16 desktop-2xl:px-20 py-[14px]"> */}
            <div className="p-5">
                <h1 className="text-subtitle font-semibold text-dark ps-3 dark:text-light">
                    {/* {currentTheme == "dark" && <Image src={logoWhite} width={250} height={100} alt="logo" />}
                    {currentTheme !== "dark" && <Image src={logoBlack} width={250} height={100} alt="logo" />} */}
                    <h1 className="uppercase text-center text-h4 text-dark dark:text-white">Thara Canggu</h1>
                </h1>
            </div>

            {user && (
                <div className="overflow-y-auto flex-grow">
                    <ul className="pl-6 pr-4 py-[14px]">
                        {menuData.map((menuItem) => {
                            if (menuItem.access === 1) {
                                return menuItem.path ? (
                                    <li key={menuItem.path} className={`${idPath === menuItem.path ? "text-dark bg-light" : "text-muted"} rounded-lg hover:bg-light text-body font-medium`}>
                                        <div className="cursor-pointer flex my-2 py-3 ps-2 items-center" onClick={() => router.push(menuItem.path)}>
                                            <FontAwesomeIcon icon={menuItem.icon} className="w-4 font-medium mx-2" />
                                            <span className="ps-1 capitalize">{menuItem.text}</span>
                                        </div>
                                    </li>
                                ) : (
                                    <span className="text-sm text-semimuted" key={menuItem.text}>
                                        {menuItem.text}
                                    </span>
                                );
                            }
                            return null;
                        })}
                    </ul>
                </div>
            )}

            <div className="flex justify-between items-center  px-6 pb-10">
                <div
                    className="flex text-muted cursor-pointer hover:text-dark dark:hover:text-light"
                    onClick={() => {
                        logout();
                        router.push("/login");
                    }}
                >
                    <FontAwesomeIcon icon={faSquareCaretLeft} className="w-4 font-bold mx-4" />
                    <h1 className="text-body">Logout</h1>
                </div>
            </div>
        </aside>
    );
}
