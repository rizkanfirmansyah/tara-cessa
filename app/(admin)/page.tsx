'use client'
import { Card, CardChart, Dropdown, EventRow, RoomRow } from "@/components";
import { useEventStore } from "@/components/store/eventStore";
import { useFoodStore } from "@/components/store/foodStore";
import { useHotelStore } from "@/components/store/hotelStore";
import { useLoungeStore } from "@/components/store/loungeStore";
import { usePoolStore } from "@/components/store/poolStore";
import { useRoomStore } from "@/components/store/roomStore";
import { Alert } from "@/helpers/Alert";
import fetchCustom from "@/helpers/FetchCustom";
import { hotelID, userSession } from "@/helpers/UserData";
import { EventType } from "@/types";
import { RoomManageType } from "@/types/RoomType";
import { faBellConcierge, faBuilding, faDoorClosed, faPersonShelter, faRestroom } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const [event, setEvent] = useState("today");
    const [feedback, setFeedback] = useState("today");

    const dataHotels = useHotelStore((state) => state.data);
    const updateDataHotel = useHotelStore((state) => state.updateData);
    const dataRooms = useRoomStore((state) => state.data);
    const dataTables = useLoungeStore((state) => state.data);
    const updateDataLounge = useLoungeStore((state) => state.updateData);
    const dataPoolTables = usePoolStore((state) => state.data);
    const updateDataPoolTables = usePoolStore((state) => state.updateData);
    const updateDataRoom = useRoomStore((state) => state.updateData);
    const dataFoods = useFoodStore((state) => state.data);
    const updateDataFood = useFoodStore((state) => state.updateData);
    let user = userSession;
    let bearerToken = user?.token ?? "";

    useEffect(() => {
        getDataHotel();
        getDataRoom();
        getDataTable();
        getDataPoolTable();
        getDataFoods();
    }, []);

    function getDataHotel() {
        let url = `${process.env.NEXT_PUBLIC_URL}/hotels`;
        if (user.hotelID) {
            url = `${process.env.NEXT_PUBLIC_URL}/hotels/${user.hotelID}`;
        }
        if (dataHotels) {
            fetchCustom<any>(url, bearerToken)
                .then((result) => {
                    if (result.error) {
                        throw new Error("500 Server Error");
                    } else {
                        updateDataHotel(result.data.data);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        }
    };

    function getDataRoom() {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/manage/hotels/${hotelID}/rooms`, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error(result.data.message);
                } else {
                    const res = result.data.data;
                    updateDataRoom(res);
                }
            })
            .catch((error) => {
                Alert({
                    title: 'Warning',
                    desc: error,
                    icon: 'warning'
                });
            });
    };

    function getDataTable() {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/tables`, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error(result.data.message);
                } else {
                    const res = result.data.data;
                    updateDataLounge(res);
                }
            })
            .catch((error) => {
                Alert({
                    title: 'Warning',
                    desc: error,
                    icon: 'warning'
                });
            });
    };

    function getDataPoolTable() {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/pool-tables`, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error(result.data.message);
                } else {
                    const res = result.data.data;
                    updateDataPoolTables(res);
                }
            })
            .catch((error) => {
                // Alert({
                //     title: 'Warning',
                //     desc: error,
                //     icon: 'warning'
                // });
            });
    };


    const getDataFoods = () => {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/foods`, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error("Error fteching");
                } else {
                    updateDataFood(result.data.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };



    return (
        <div>
            <div className="grid grid-cols-4 gap-4">
                {/* <CardChart theme="danger" icon={faCity} up={true} title={"Branchs"} value={"0"} /> */}
                <CardChart theme="primary" icon={faDoorClosed} up={false} title={"Rooms/Table"} value={`${dataRooms?.length}`} />
                <CardChart theme="secondary" icon={faPersonShelter} up={true} title={"Table"} value={`${dataTables?.length}`} />
                <CardChart icon={faRestroom} up={true} title={"Pool Table"} value={`${dataPoolTables?.length ?? 0}`} />
                <CardChart icon={faBellConcierge} up={false} title={"Food"} value={`${dataFoods?.length}`} />
            </div>
            <div className="grid grid-cols-5 gap-4 mt-6">
                <Card className="col-span-2">
                    <div className="grid">
                        <div className="header flex justify-between">
                            <h1 className="text-h5 font-semibold text-dark dark:text-light">List Room/Table</h1>
                            <Dropdown title={event} >
                                <a href="#" className="dark:hover:text-dark hover:bg-light block px-4 py-2 text-sm" role="menuitem" onClick={() => setEvent("today")} id="menu-item-0">Today</a>
                                <a href="#" className="dark:hover:text-dark hover:bg-light block px-4 py-2 text-sm" role="menuitem" onClick={() => setEvent("weeks")} id="menu-item-1">Weeks</a>
                                <a href="#" className="dark:hover:text-dark hover:bg-light block px-4 py-2 text-sm" role="menuitem" onClick={() => setEvent("see all")} id="menu-item-2">See All</a>
                            </Dropdown>
                        </div>

                        <div id="body" className="w-full mt-4">
                            <table className="w-full">
                                <thead>
                                    <tr className="ext-start border-b-[1px] text-muted dark:text-light border-light">
                                        <td className="py-3 text-start font-medium">No</td>
                                        <td className="py-3 text-start font-medium">Info Room</td>
                                        <td className="py-3 text-start font-medium">Created At</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataRooms &&
                                        dataRooms.map((room: RoomManageType, index: number) => (
                                            <RoomRow
                                                key={room.id}
                                                index={index + 1}
                                                room={room}
                                            />
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>
                {/* <Card className="col-span-3">
                    <div className="grid">
                        <div className="header flex justify-between">
                            <h1 className="text-h5 font-semibold text-dark dark:text-light">Recent Feedback</h1>
                            <Dropdown title={feedback} >
                                <a href="#" className="dark:hover:text-dark hover:bg-light block px-4 py-2 text-sm" role="menuitem" onClick={() => setFeedback("today")} id="menu-item-0">Today</a>
                                <a href="#" className="dark:hover:text-dark hover:bg-light block px-4 py-2 text-sm" role="menuitem" onClick={() => setFeedback("weeks")} id="menu-item-1">Weeks</a>
                                <a href="#" className="dark:hover:text-dark hover:bg-light block px-4 py-2 text-sm" role="menuitem" onClick={() => setFeedback("see all")} id="menu-item-2">See All</a>
                            </Dropdown>
                        </div>

                        <div id="body" className="w-full mt-4">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-start border-b-[1px] text-muted dark:text-light border-light">
                                        <td className="py-3 text-start font-medium">No.</td>
                                        <td className="py-3 text-start font-medium">Guest</td>
                                        <td className="py-3 text-start font-medium">Comment</td>
                                        <td className="py-3 text-start font-medium">Rate</td>
                                        <td className="py-3 text-start font-medium">Action</td>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card> */}
            </div >
        </div >
    );
}