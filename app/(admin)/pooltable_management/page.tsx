"use client";
import { MetaContext } from "@/app/MetaProvider";
import { Card, PropertyNotSelect } from "@/components";
import PoolTableDetail from "@/components/organisms/PoolTableDetail";
import { useHotelStore } from "@/components/store/hotelStore";
import { userSession } from "@/helpers/UserData";
import { useContext, useEffect } from "react";
import "./style.css";

export default function RoomManagementPage() {
    const { updateTitle } = useContext(MetaContext);
    const hotelID = useHotelStore((state) => state.hotelID);
    let user = userSession;

    useEffect(() => {
        updateTitle("Pool Table Management");
        return () => {
            updateTitle("Dashboard");
        };
    }, [updateTitle]);


    return (
        <div className="grid grid-cols-3">
            <Card className="col-span-6 p-0">{(hotelID && hotelID > 0) ? <PoolTableDetail /> : <PropertyNotSelect />}</Card>
        </div>
    );
}
