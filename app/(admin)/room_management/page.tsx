"use client";
import { MetaContext } from "@/app/MetaProvider";
import { ButtonActions, Card, InputGroup, Modal, PropertyNotSelect, PropertyRow, RoomDetail } from "@/components";
import { useHotelStore } from "@/components/store/hotelStore";
import fetchCustom from "@/helpers/FetchCustom";
import { HotelType } from "@/types";
import { useContext, useEffect, useState } from "react";
import "./style.css";
import { userSession } from "@/helpers/UserData";

export default function RoomManagementPage() {
    const { updateTitle } = useContext(MetaContext);
    const [modal, setModal] = useState(false);
    const [property, setProperty] = useState("");
    const [branch, setBranch] = useState("");
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [active, setActive] = useState(0);
    const [state, setState] = useState("");
    const dataHotel = useHotelStore((state) => state.data);
    const updateData = useHotelStore((state) => state.updateData);
    const setHotelID = useHotelStore((state) => state.setHotelID);
    let user = userSession;
    let bearerToken = user?.token ?? "";

    useEffect(() => {
        updateTitle("Room Management");
        return () => {
            updateTitle("Dashboard");
        };
    }, [updateTitle]);

    useEffect(() => {
        let url = `${process.env.NEXT_PUBLIC_URL}/hotels`;
        if (dataHotel && dataHotel?.length < 1) {
            fetchCustom<any>(url, bearerToken)
                .then((result) => {
                    if (result.error) {
                        // alert(result.error ?? "Error fetching");
                        throw new Error("500 Server Error");
                    } else {
                        updateData(result.data.data);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        }
    }, []);

    return (
        <div className="grid grid-cols-3 gap-6">
            <Card>
                <h1 className="text-h5 font-semibold">List Properties</h1>
                {/* <ButtonActions onClickAdd={() => setModal(modal ? false : true)} /> */}
                <table className="w-full mt-5">
                    <thead>
                        <tr className="text-start border-b-[1px] text-muted dark:text-light border-light">
                            <td className="py-3 text-start font-medium">No.</td>
                            <td className="py-3 text-start font-medium">Property Name</td>
                            <td className="py-3 text-start font-medium">Branch</td>
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
                                    }}
                                />
                            ))}
                    </tbody>
                </table>
            </Card>
            <Card className="col-span-2">{active > 0 ? <RoomDetail /> : <PropertyNotSelect />}</Card>

            <Modal title="Insert Property" show={modal} onClosed={() => setModal(modal ? false : true)}>
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
            </Modal>
        </div>
    );
}
