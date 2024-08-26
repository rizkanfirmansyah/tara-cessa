"use client";
import { MetaContext } from "@/app/MetaProvider";
import { Card, InputGroup, LoungeDetail, Modal, PropertyNotSelect, RoomDetail } from "@/components";
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

    useEffect(() => {
        updateTitle("Lounge Management");
        return () => {
            updateTitle("Dashboard");
        };
    }, [updateTitle]);


    return (
        <div className="grid grid-cols-3">
            <Card className="col-span-6 p-0">{(hotelID && hotelID > 0) ? <LoungeDetail /> : <PropertyNotSelect />}</Card>
        </div>
    );
}
