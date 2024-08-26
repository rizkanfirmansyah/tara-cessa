"use client";
import { MetaContext } from "@/app/MetaProvider";
import { Card, InputGroup, Modal, PropertyNotSelect, RoomDetail } from "@/components";
import { useHotelStore } from "@/components/store/hotelStore";
import fetchCustom from "@/helpers/FetchCustom";
import { userSession } from "@/helpers/UserData";
import { useContext, useEffect, useState } from "react";
import "./style.css";

export default function RoomManagementPage() {
    const { updateTitle } = useContext(MetaContext);
    const [modal, setModal] = useState(false);
    const [property, setProperty] = useState("");
    const [branch, setBranch] = useState("");
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [state, setState] = useState("");
    const dataHotel = useHotelStore((state) => state.data);
    const hotelID = useHotelStore((state) => state.hotelID);
    const updateData = useHotelStore((state) => state.updateData);
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
        <div className="grid grid-cols-3">
            <Card className="col-span-6 p-0">{(hotelID && hotelID > 0) ? <RoomDetail /> : <PropertyNotSelect />}</Card>

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
