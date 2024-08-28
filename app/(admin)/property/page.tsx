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
    const [dataHotel, setDataHotel] = useState<HotelType[] | []>([]);
    const [state, setState] = useState("");
    const [defaultLink, setDefaultLink] = useState("");
    const [active, setActive] = useState(0);
    const datas = useHotelStore((state) => state.data);
    const updateData = useHotelStore((state) => state.updateData);
    const updateDataRow = useHotelStore((state) => state.updateDataRow);
    const setHotelID = useHotelStore((state) => state.setHotelID);
    let user = userSession;
    let bearerToken = user?.token ?? "";
    // let bearerToken = Session

    useEffect(() => {
        updateTitle("Property");
        if (datas) {
            setDataHotel(datas)
        }
        return () => {
            updateTitle("Dashboard");
        };
    }, [datas, updateTitle]);

    function searchHotels(searchCriteria: string) {
        if (datas) {
            const res: HotelType[] = datas.filter(hotel =>
                (searchCriteria ? hotel.name.toLowerCase().includes(searchCriteria.toLowerCase()) : true)
            );
            setDataHotel(res);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    function getData() {
        let url = `${process.env.NEXT_PUBLIC_URL}/hotels`;
        if (user.hotelID) {
            url = `${process.env.NEXT_PUBLIC_URL}/hotels/${user.hotelID}`;
        }
        if (dataHotel) {
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
        <div className="grid grid-cols-3 gap-6">
            <Card>
                <h1 className="text-h5 font-semibold">Profile Hotel</h1>
                <ButtonActions onSearch={(e) => searchHotels(e.target.value)} onClickRepeat={() => getData()} />
                <table className="w-full mt-5">
                    <thead>
                        <tr className="text-start border-b-[1px] text-muted dark:text-light border-light">
                            <td className="py-3 text-start font-medium">No.</td>
                            <td className="py-3 text-start font-medium">Property Name</td>
                            <td className="py-3 text-start font-medium">Location</td>
                        </tr>
                    </thead>
                    <tbody>
                        {dataHotel &&
                            dataHotel?.length > 0 &&
                            dataHotel.map((property: HotelType, index: number) => (
                                <PropertyRow
                                    key={property.id + property.id + 10000}
                                    index={index + 1}
                                    name={property.name}
                                    location={property.city}
                                    branch={property.branch}
                                    active={active == property.id ? true : false}
                                    onClick={() => {
                                        setActive(property.id);
                                        setHotelID(property.id);
                                        updateDataRow(property);
                                    }}
                                />
                            ))}
                    </tbody>
                </table>
            </Card>
            <Card className="col-span-2 ">{active > 0 && dataHotel ? <PropertyDetail className="-mx-6" data={dataHotel.find((property) => property.id === active)} /> : <PropertyNotSelect />}</Card>

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
