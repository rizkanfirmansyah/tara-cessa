"use client";
import { MetaContext } from "@/app/MetaProvider";
import { ButtonActions, Card, InputGroup, Modal, PropertyDetail, PropertyNotSelect, PropertyRow } from "@/components";
import { useHotelStore } from "@/components/store/hotelStore";
import fetchCustom from "@/helpers/FetchCustom";
import { userSession } from "@/helpers/UserData";
import { HotelType } from "@/types";
import { useContext, useEffect, useState } from "react";
import "./style.css";
import { Alert } from "@/helpers/Alert";


export default function PropertyPage() {
    const { updateTitle } = useContext(MetaContext);
    const [modal, setModal] = useState(false);
    const [property, setProperty] = useState("");
    const [branch, setBranch] = useState("");
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [Greetings, setGreetings] = useState("");
    const [dataHotel, setDataHotel] = useState<HotelType | null>(null);
    const [state, setState] = useState("");
    const [defaultLink, setDefaultLink] = useState("");
    const [active, setActive] = useState(0);
    const datas = useHotelStore((state) => state.data);
    const updateData = useHotelStore((state) => state.updateData);
    const updateDataRow = useHotelStore((state) => state.updateDataRow);
    const hotelID = useHotelStore((state) => state.hotelID);
    let user = userSession;
    let bearerToken = user?.token ?? "";
    // let bearerToken = Session

    useEffect(() => {
        updateTitle("Property");
        getData();
        return () => {
            updateTitle("Dashboard");
        };
    }, [datas, updateTitle]);

    function searchHotels(searchCriteria: string) {
        if (datas) {
            const res: HotelType[] = datas.filter(hotel =>
                (searchCriteria ? hotel.name.toLowerCase().includes(searchCriteria.toLowerCase()) : true)
            );
            // setDataHotel(res);
        }
    }

    function getData() {
        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}`;
        if (user.hotelID) {
            url = `${process.env.NEXT_PUBLIC_URL}/hotels/${user.hotelID}`;
        }
        if (hotelID) {
            fetchCustom<any>(url, bearerToken)
                .then((result) => {
                    if (result.error) {
                        throw new Error("500 Server Error");
                    } else {
                        setDataHotel(result.data.data);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        }
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const data = JSON.stringify({
            name: property,
            branch: branch,
            city: city,
            province: province,
            state: state,
            defaultLink: defaultLink,
            defaultGreeting: Greetings,
        });

        let url = `${process.env.NEXT_PUBLIC_URL}/hotels`;

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${bearerToken}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: data,
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
                getData();
                setModal(false);
            })
            .catch((error) => {
                Alert({
                    title: 'Warning',
                    desc: error,
                    icon: 'warning'
                });
            });
    };

    return (
        <div className="grid grid-cols-2 gap-6">
            <Card className="col-span-2 h-full">{dataHotel && hotelID ? <PropertyDetail className="-mx-6" data={dataHotel} /> : <PropertyNotSelect />}</Card>

            <Modal title="Insert Property" show={modal} onClosed={() => setModal(modal ? false : true)} onSave={handleSubmit}>
                <InputGroup
                    theme="horizontal"
                    label={"Property Name"}
                    type={"text"}
                    value={property}
                    onChange={(e) => {
                        setProperty(e.target.value);
                    }}
                />
                <InputGroup
                    theme="horizontal"
                    label={"Branch"}
                    type={"text"}
                    value={branch}
                    onChange={(e) => {
                        setBranch(e.target.value);
                    }}
                />
                <InputGroup
                    theme="horizontal"
                    label={"City"}
                    type={"text"}
                    value={city}
                    onChange={(e) => {
                        setCity(e.target.value);
                    }}
                />
                <InputGroup
                    theme="horizontal"
                    label={"Province"}
                    type={"text"}
                    value={province}
                    onChange={(e) => {
                        setProvince(e.target.value);
                    }}
                />
                <InputGroup
                    theme="horizontal"
                    label={"State"}
                    type={"text"}
                    value={state}
                    onChange={(e) => {
                        setState(e.target.value);
                    }}
                />
                <InputGroup
                    theme="horizontal"
                    label={"Default Link"}
                    type={"text"}
                    value={defaultLink}
                    onChange={(e) => {
                        setDefaultLink(e.target.value);
                    }}
                />
                <InputGroup
                    theme="horizontal"
                    label={"Default Greetings"}
                    type={"textarea"}
                    value={Greetings}
                    onChange={(e) => {
                        setGreetings(e.target.value);
                    }}
                />
            </Modal>
        </div>
    );
}
