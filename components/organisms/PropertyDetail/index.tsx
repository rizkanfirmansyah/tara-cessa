"use client";
import { Button, Dropdown, InputColor, InputGroup, Modal } from "@/components";
import { useHotelStore } from "@/components/store/hotelStore";
import { Alert } from "@/helpers/Alert";
import fetchCustom from "@/helpers/FetchCustom";
import setFormValue from "@/helpers/FormInputCustom/setform";
import { userSession } from "@/helpers/UserData";
import { HotelType } from "@/types";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
let user = userSession;
let bearerToken = user?.token;

interface PropertyDetailProps {
    className?: string;
    data?: HotelType;
    onClick?: () => void;
}

export default function PropertyDetail({ className, data }: PropertyDetailProps) {
    const router = useRouter();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleDropdownClick = (dropdownId: string) => {
        setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
    };

    const [modalProperty, setModalProperty] = useState(false);
    const [modalProfile, setModalProfile] = useState(false);
    const [color, setColor] = useState("");
    const [logo, setLogo] = useState<File | null>(null);
    const [logoDark, setLogoDark] = useState<File | null>(null);
    const [logoWhite, setLogoWhite] = useState<File | null>(null);
    const hotelID = useHotelStore((state) => state.hotelID);
    const dataHotel = useHotelStore((state) => state.dataRow);
    const dataProfile = useHotelStore((state) => state.dataProfile);
    const updateData = useHotelStore((state) => state.updateDataRow);
    const updateDataProfile = useHotelStore((state) => state.updateDataProfile);

    useEffect(() => {
        setFormValue("property", dataHotel?.name);
        setFormValue("branch", dataHotel?.branch);
        setFormValue("city", dataHotel?.city);
        setFormValue("province", dataHotel?.province);
        setFormValue("state", dataHotel?.state);
        setFormValue("defaultLink", dataHotel?.defaultLink);
        setFormValue("defaultGreeting", dataHotel?.defaultGreeting);
        setFormValue("apiKey", dataHotel?.apiKey, "textarea");
    }, [dataHotel, dataHotel?.apiKey, dataHotel?.branch, dataHotel?.city, dataHotel?.defaultLink, dataHotel?.name, dataHotel?.province, dataHotel?.state]);

    useEffect(() => {
        loadProfile();
    }, [hotelID]);

    const handleUpdate = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const property = formData.get("property") as string;
        const branch = formData.get("branch") as string;
        const city = formData.get("city") as string;
        const province = formData.get("province") as string;
        const state = formData.get("state") as string;
        const defaultLink = formData.get("defaultLink") as string;
        const defaultGreeting = formData.get("defaultGreeting") as string;

        const propertyData = JSON.stringify({
            id: hotelID,
            name: property,
            branch: branch,
            city: city,
            province: province,
            state: state,
            groupId: 0,
            defaultGreeting: defaultGreeting,
            defaultLink: defaultLink,
        });

        let url = `${process.env.NEXT_PUBLIC_URL}/hotels`;

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${bearerToken}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: propertyData,
        };

        fetch(url, requestOptions)
            .then(async (response) => {
                const data = await response.json();
                return data;
            })
            .then((result) => {
                if (result.response_code > 0) {
                    throw new Error(result.message);
                }
                setModalProperty(false);
            })
            .catch((error) => {
                Alert({
                    title: 'Warning',
                    desc: error,
                    icon: 'warning'
                });
            });
    };

    function loadProfile() {
        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/profile`;
        let bearerToken = user.token;
        fetchCustom<any>(url, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error(result.data.message);
                } else {
                    updateDataProfile(result.data.data);
                }
            })
            .catch((error) => {
                Alert({
                    title: 'Warning',
                    desc: error,
                    icon: 'warning'
                });
            });
    }

    function loadHotel() {
        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}`;
        let bearerToken = user.token;
        fetchCustom<any>(url, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error("500 Server Error");
                } else {
                    updateData(result.data.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    const handleSubmitProfile = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const description = formData.get("description") as string;
        const color = formData.get("color") as string;

        const datasProfile = JSON.stringify({
            primaryColor: color,
            description: description,
            logoColor: logo && logo.name,
            logoWhite: logoWhite && logoWhite.name,
            logoBlack: logoDark && logoDark.name,
        });

        const formdata = new FormData();
        formdata.append("data", datasProfile);
        formdata.append("logo_color", logo ?? "");
        formdata.append("logo_white", logoWhite ?? "");
        formdata.append("logo_black", logoDark ?? "");

        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/profile`;

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${bearerToken}`);
        // myHeaders.append("Content-Type", "multipart/form-data");

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: formdata,
        };

        fetch(url, requestOptions)
            .then(async (response) => {
                const data = await response.json();
                return data;
            })
            .then((result) => {
                if (result.response_code > 0) {
                    throw new Error(result.message);
                }
                loadProfile();
                setModalProfile(false);
            })
            .catch((error) => {
                Alert({
                    title: 'Warning',
                    desc: error,
                    icon: 'warning'
                });
            });
    };

    const handleKey = () => {
        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/key`;

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${bearerToken}`);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
        };

        fetch(url, requestOptions)
            .then(async (response) => {
                const data = await response.json();
                return data;
            })
            .then((result) => {
                if (result.response_code > 0) {
                    throw new Error("500 Server Error");
                }
                loadHotel();
            })
            .catch((error) => console.error(error));
    };

    return (
        <div className={`${className}`}>
            <div id="header" className="space-x-2  border-b-2 border-light px-6 pb-2">
                <Dropdown title="Basic Info" className="border-none" icon={faEllipsisVertical} isOpen={openDropdown === 'basic-info'}
                    onDropdownClick={() => handleDropdownClick('basic-info')}>
                    <a href="#" className="dark:hover:text-dark hover:bg-light block px-4 py-2 text-sm" role="menuitem" onClick={() => setModalProperty(modalProperty ? false : true)} >
                        Property
                    </a>
                    <a href="#" className="dark:hover:text-dark hover:bg-light block px-4 py-2 text-sm" role="menuitem" onClick={() => setModalProfile(modalProfile ? false : true)} id="menu-item-1">
                        Profile
                    </a>
                </Dropdown>
                <Dropdown title="Hotel Services" className="border-none" icon={faEllipsisVertical} isOpen={openDropdown === 'hotel-services'}
                    onDropdownClick={() => handleDropdownClick('hotel-services')}>
                    {/* <a href="#" className="dark:hover:text-dark hover:bg-light block px-4 py-2 text-sm" role="menuitem" onClick={() => router.push("/property/ameneties")}>
                        Amenities
                    </a> */}
                    <a href="#" className="dark:hover:text-dark hover:bg-light block px-4 py-2 text-sm" role="menuitem" onClick={() => router.push("/property/inroomdining")} id="menu-item-1">
                        Foods
                    </a>
                    {/* <a href="#" className="dark:hover:text-dark hover:bg-light block px-4 py-2 text-sm" role="menuitem" onClick={() => router.push("/property/facilities")} id="menu-item-2">
                        Facilities
                    </a> */}
                </Dropdown>
                <div className="inline-block relative">
                    <h1 className="flex font-regular text-muted dark:bg-gray-900 bg-white dark:text-light px-4 py-1 cursor-pointer items-center rounded-3xl border-muted text-sm capitalize" onClick={() => router.push("/property/event")}>
                        Events
                    </h1>
                </div>
                <div className="inline-block relative">
                    <h1 className="flex font-regular text-muted dark:bg-gray-900 bg-white dark:text-light px-4 py-1 cursor-pointer items-center rounded-3xl border-muted text-sm capitalize" onClick={() => router.push("/property/feedback")}>
                        FeedBack
                    </h1>
                </div>
            </div>
            <div id="body">
                <div className="from-primary bg-gradient-to-br to-primary-70 dark:from-slate-900 dark:to-slate-700 p-6 rounded-lg m-6">
                    <h1 className="text-sm text-light  capitalize">
                        {data?.city}, {data?.province}, {data?.state}
                    </h1>
                    <div className="flex justify-between my-2 space-x-6">
                        <div>
                            <h1 className="text-title text-light font-semibold">{data?.name}</h1>
                            <p className="text-sm text-light w-full">{dataProfile?.description}</p>
                        </div>
                        <div className="flex flex-col">
                            {/* {dataProfile?.logoColor && <Image src={process.env.NEXT_PUBLIC_URL + '/files/'+dataProfile.logoColor} alt="image hotel aryaduta" className="rounded-full w-[70px]" />} */}
                            <div className="w-[100px] h-4 mt-4" style={{ backgroundColor: dataProfile?.primaryColor }}></div>
                            <span className="text-center text-sm font-medium text-light"></span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-10 px- h-60 mx-32">
                    <div className="p-2 border-semidark h-full rounded border-[0.5px] flex items-end flex-col justify-between bg-light">
                        {dataProfile?.logoColor && <Image src={process.env.NEXT_PUBLIC_URL + "/files/" + dataProfile.logoColor} alt="Logo Primary" width={200} height={200} className="w-full" />}
                        <Button className="w-full">Main Logo</Button>
                    </div>
                    <div className="p-2 border-semidark h-full rounded border-[0.5px] flex items-end flex-col justify-between bg-dark">
                        {dataProfile?.logoBlack && <Image src={process.env.NEXT_PUBLIC_URL + "/files/" + dataProfile.logoBlack} alt="Logo Primary" width={200} height={200} className="w-full" />}
                        <Button className="w-full" theme="light">
                            Logo Dark
                        </Button>
                    </div>
                    <div className="p-2 border-semidark h-full rounded border-[0.5px] flex items-end flex-col justify-between bg-light">
                        {dataProfile?.logoWhite && <Image src={process.env.NEXT_PUBLIC_URL + "/files/" + dataProfile.logoWhite} alt="Logo Primary" width={200} height={200} className="w-full" />}
                        <Button className="w-full" theme="dark">
                            Logo Light
                        </Button>
                    </div>
                    {/* <div className="p-2 flex flex-col justify-between border-semidark rounded border-[0.5px] bg-light">
                        <Image src={imageHotel1} alt="Logo Primary" className="w-full h-28 mt-8 object-cover rounded" />
                        <Button className="w-full">Thumbnail</Button>
                    </div> */}
                </div>
            </div>

            <Modal
                title="Update Property"
                show={modalProperty}
                onClosed={() => {
                    setModalProperty(modalProperty ? false : true);
                    // setFormEmpty();
                }}
                onSave={(event: FormEvent<HTMLFormElement>) => handleUpdate(event)}
            >
                <InputGroup theme="horizontal" label={"Property Name"} type={"text"} name="property" />
                <InputGroup theme="horizontal" label={"Branch"} type={"text"} name="branch" />
                <InputGroup theme="horizontal" label={"City"} type={"text"} name="city" />
                <InputGroup theme="horizontal" label={"Province"} type={"text"} name="province" />
                <InputGroup theme="horizontal" label={"State"} type={"text"} name="state" />
                <InputGroup theme="horizontal" label={"Default Link"} type={"text"} name="defaultLink" />
                <InputGroup
                    theme="horizontal"
                    label={"Default Greetings"}
                    type={"textarea"}
                    name="defaultGreeting"
                />
                <InputGroup label={"API Key"} type={"textarea"} name="apiKey" disabled={true} />
                <Button type="button" theme="default" className="text-light border-[1px] bg-primary py-2 px-12 rounded-lg hover:bg-light hover:text-primary hover:border-primary transition-all duration-300 font-medium" onClick={() => handleKey()}>
                    Generate API Key
                </Button>
            </Modal>

            <Modal title="Update Profile" show={modalProfile} onClosed={() => setModalProfile(modalProfile ? false : true)} onSave={(event: FormEvent<HTMLFormElement>) => handleSubmitProfile(event)}>
                <InputGroup
                    theme="horizontal"
                    label={"Description"}
                    type={"text"}
                    name="description"
                />
                <InputColor
                    label={"Primary Color"}
                    name="color"
                    value={color}
                    onChange={(e) => {
                        setColor(e.target.value);
                    }}
                />
                <InputGroup theme="horizontal" label={"Logo Color"} type={"file"} name="logo" onChange={(e) => setLogo(e.target?.files?.[0] ?? null)} />
                <InputGroup theme="horizontal" label={"Logo White"} type={"file"} name="logoWhite" onChange={(e) => setLogoDark(e.target?.files?.[0] ?? null)} />
                <InputGroup theme="horizontal" label={"Logo Dark"} type={"file"} name="logoDark" onChange={(e) => setLogoWhite(e.target?.files?.[0] ?? null)} />
            </Modal>
        </div >
    );
}
