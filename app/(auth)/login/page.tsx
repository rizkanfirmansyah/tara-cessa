"use client";
import { useAuth } from "@/app/AuthProvider";
import { InputGroup } from "@/components";
import { useHotelStore } from "@/components/store/hotelStore";
import { Alert } from "@/helpers/Alert";
import { UserType } from "@/types";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function LoginPage() {
    const { systemTheme, theme, setTheme } = useTheme();
    const { login, isLoggedIn } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const setHotelID = useHotelStore((state) => state.setHotelID);

    useEffect(() => {
        if (isLoggedIn) {
            let data = localStorage.getItem('data') ?? null
            if (data) {
                let datas: UserType = JSON.parse(data);
                if (datas?.role?.canManageData > 0) {
                    router.replace('/');
                }
                else if (datas?.role?.canManageUser > 0) {
                    router.replace('/user_management');
                }
                else if (datas?.role?.canManageHotels > 0) {
                    router.replace('/property');
                }
                else if (datas?.role?.canManageDevices > 0) {
                    router.replace('/room_management');
                }
                else if (datas?.role?.frontdesk > 0) {
                    router.replace('/frontdesk');
                }
            }
        }
    }, [isLoggedIn, router]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        const credentials = `${email}:${password}`;
        const base64Credentials = btoa(credentials);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${base64Credentials}`,
                },
                body: JSON.stringify({}),
            });

            const data = await response.json();
            if (response.ok) {
                login(data.data.token, data.data);
                if (data.data.hotelId) {
                    setHotelID(data.data.hotelId);
                }
                if (data.data.role.canManageData > 0) {
                    router.replace('/');
                }
                if (data.data.role.canManageUser > 0) {
                    router.replace('/user_management');
                }
                if (data.data.role.canManageHotels > 0) {
                    router.replace('/property');
                }
                if (data.data.role.canManageDevices > 0) {
                    router.replace('/room_management');
                }
                if (data.data.role.frontdesk) {
                    router.replace("/");
                }
                if (data.data.role.order) {
                    router.replace("/guest_order");
                }
            } else {
                Alert({ icon: "error", title: data.message });
            }
        } catch (err) {
            Alert({ icon: "error", title: "Cannot login. Please check your internet connection, user or password." });
        }

        setIsLoading(false);
    }

    const currentTheme = theme === "system" ? systemTheme : theme;

    return (
        <div className="text-black dark:text-white dark:bg-slate-950">
            <div className="p-5">
                <h1 className="uppercase font-semibold text-left text-h3 text-dark dark:text-light">Thara Canggu </h1>
            </div>
            <div className="grid grid-cols-2 xl:gap-28 xl:my-8 xl:mx-32">
                <div>
                    <h1 className="text-h2 font-bold mb-2">Login.</h1>
                    <p className="text-body text-muted">Login to access hotel features account</p>

                    <form action="#" className="mt-10 mr-16" onSubmit={handleSubmit}>
                        <InputGroup className="mt-6" label="Username" name="email" value={""} type="text" />
                        <InputGroup className="mt-6" label="Password" name="password" value={""} type="password" />
                        {/* <div className="flex justify-between mt-3">
                            <div className="flex">
                                <input type="checkbox" className="border-dark" />
                                <p className="ms-1">Remember Me</p>
                            </div>
                            <a href="#" className="text-muted font-medium">
                                Forgot Password
                            </a>
                        </div> */}
                        <div className="mt-10">
                            <button type="submit" className="w-full p-3 rounded-lg text-center bg-primary text-white font-medium text-body dark:bg-gray-600" disabled={isLoading ? true : false}>
                                {isLoading ? "Loading...." : "Login"}
                            </button>
                        </div>
                    </form>
                    {/* <div className="mt-5 text-center">
                        <p className="text-muted">
                            Do you have account?{" "}
                            <a href="#" className="underline text-primary ">
                                Sign Up
                            </a>
                        </p>
                    </div> */}
                </div>
                <div className="flex ">
                    <Image className="object-cover object-center h-2/3 rounded-lg" src="/assets/images/logo.jpg" width={600} height={50} alt="awdawd" />
                </div>
            </div>
        </div>
    );
}
