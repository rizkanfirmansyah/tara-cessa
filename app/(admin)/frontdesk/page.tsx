"use client";

import { MetaContext } from "@/app/MetaProvider";
import { Card, InputBox, InputGroup, Modal } from "@/components";
import FrontDeskRow from "@/components/organisms/FrontDeskRow";
import { useHotelStore } from "@/components/store/hotelStore";
import { useRoomStore } from "@/components/store/roomStore";
import fetchCustom from "@/helpers/FetchCustom";
import setFormEmpty from "@/helpers/FormInputCustom/empty";
import setFormValue from "@/helpers/FormInputCustom/setform";
import { userSession } from "@/helpers/UserData";
import { OptionType } from "@/types";
import { RoomManageType } from "@/types/RoomType";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

const selectOptions: OptionType[] = [
    {
        name: "Template",
        value: "template",
    },
    {
        name: "Customize",
        value: "customize",
    },
];

export default function FrontDeskPage() {
    const { updateTitle } = useContext(MetaContext);
    const [modal, setModal] = useState(false);
    const [roomID, setRoomID] = useState(0);
    const [checkout, setCheckout] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [greetings, setGreetings] = useState("");
    const [roomNumber, setroomNumber] = useState("0");
    const [dataRoom, setDataRoom] = useState<RoomManageType[] | []>([]);
    const [Opt, setOpt] = useState("template");
    const hotelID = useHotelStore((state) => state.hotelID);
    const datas = useRoomStore((state) => state.data);
    const updateData = useRoomStore((state) => state.updateData);
    let user = userSession;
    let bearerToken = user?.token ?? "";
    const dataHotels = useHotelStore((state) => state.data);
    const dataHotel = useHotelStore((state) => state.dataRow);
    const updateDataHotels = useHotelStore((state) => state.updateData);
    const updateDataHotel = useHotelStore((state) => state.updateDataRow);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = currentDate.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataRoom && dataRoom.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const getData = () => {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/manage/hotels/${hotelID}/rooms`, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error("Error fteching");
                } else {
                    updateData(result.data.data);
                    setDataRoom(result.data.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    function searchRoom(searchCriteria: string) {
        if (datas) {
            const res: RoomManageType[] = datas.filter((room) => (searchCriteria ? room.no.includes(searchCriteria) : true));
            setDataRoom(res);
        }
    }

    useEffect(() => {
        getData();
        updateTitle("Front Desk Page");
        getDataHotel();
        return () => {
            updateTitle("Dashboard");
        };
    }, [updateTitle]);

    const onCheckin = (frondesk: RoomManageType) => {
        setModal(true);
        setRoomID(frondesk.id);
        setFormValue("roomNumber", frondesk.no);
    };

    const getDataHotel = () => {
        let url = `${process.env.NEXT_PUBLIC_URL}/hotels`;
        let bearerToken = user.token;
        if (dataHotels && dataHotels?.length < 1) {
            fetchCustom<any>(url, bearerToken)
                .then((result) => {
                    if (result.error) {
                    } else {
                        updateDataHotels(result.data.data);
                        result.data.data.map((value: any, key: any) => {
                            if (value.id == hotelID) {
                                updateDataHotel(value);
                                setGreetings(value?.defaultGreeting || "");
                            }
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e && e.preventDefault();
        const formData = new FormData(e && e.currentTarget);

        // const roomNumber = formData.get("roomNumber") as string;
        const name = formData.get("name") as string;
        const sender = formData.get("sender") as string;
        const senderPosition = formData.get("senderPosition") as string;
        const date = formData.get("date") as string;
        const time = formData.get("time") as string;
        const dateCheckOut = formData.get("dateCheckOut") as string;
        const timeCheckOut = formData.get("timeCheckOut") as string;

        const image = formData.get("image") as File;
        const imageName = image.name;
        const data = {
            id: roomID,
            roomNumber: roomNumber,
            no: roomNumber,
            guestName: name,
            senderPosition: senderPosition,
            greetings,
        } as { [key: string]: any };

        if (!checkout) {
            data.sender = sender;
        }

        if (date !== "" && time !== "") {
            const dateTimeString = date + "T" + time + ":00Z";
            data.checkInTime = dateTimeString;
        }
        if (dateCheckOut !== "" && timeCheckOut !== "") {
            const dateTimeString = dateCheckOut + "T" + timeCheckOut + ":00Z";
            data.checkOutTime = dateTimeString;
        }

        if (image) {
            data.guestPhoto = imageName;
        }

        const jsonData = JSON.stringify(data);

        let url = `${process.env.NEXT_PUBLIC_URL}/manage/hotels/${hotelID}/rooms/${roomID}/guest`;

        const formdata = new FormData();
        formdata.append("data", jsonData);
        if (image) {
            formdata.append("image", image);
        }
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: formdata,
        };

        setIsLoading(true);
        fetch(url, requestOptions)
            .then(async (response) => {
                const data = await response.json();
                return data;
            })
            .then((result) => {
                if (result.response_code > 0) {
                    throw new Error("500 Server Error");
                }
                getData();
                setModal(false);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleSubmitCheckOut = async (datas: RoomManageType) => {
        const data = {
            id: datas.id,
            roomNumber: datas.no,
            no: datas.no,
            guestName: "Guest",
            checkInTime: null,
            guestPhoto: "",
        } as { [key: string]: any };
        const today = new Date();
        const date = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const formattedDate = `${today.getFullYear()}-${month}-${date}`;
        const hours = String(today.getHours()).padStart(2, "0");
        const minutes = String(today.getMinutes()).padStart(2, "0");
        const formattedTime = `${hours}:${minutes}`;
        const dateTimeString = formattedDate + "T" + formattedTime + ":00Z";
        data.checkOutTime = null;

        const jsonData = JSON.stringify(data);

        let url = `${process.env.NEXT_PUBLIC_URL}/manage/hotels/${hotelID}/rooms/${datas.id}/guest`;

        const formdata = new FormData();
        formdata.append("data", jsonData);
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: formdata,
        };

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Checkout Room Ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, save it!",
        });

        if (result.isConfirmed) {
            setIsLoading(true);
            fetch(url, requestOptions)
                .then(async (response) => {
                    const data = await response.json();
                    return data;
                })
                .then((result) => {
                    if (result.response_code > 0) {
                        throw new Error("500 Server Error");
                    }
                    getData();
                    setModal(false);
                })
                .catch((error) => console.error(error))
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            Swal.fire("Cancelled", "Your item is safe :)", "info");
        }
    };

    function setForm(frontdesk: RoomManageType) {
        setFormValue("name", frontdesk.guestName);
        setFormValue("senderPosition", frontdesk.senderPosition);
        setFormValue("greetings", frontdesk.greetings);
    }

    return (
        <>
            {/* <div className="grid grid-cols-3 gap-4">
                <CardChart icon={faBed} theme="primary" title="Total Room" value="100" />
                <CardChart icon={faHouseCircleCheck} up={true} theme="success" title="Room Available" value="20" />
                <CardChart icon={faHouseLock} up={true} theme="warning" title="Room Occupied" value="80" />
            </div> */}
            <div className="mt-3">
                <Card>
                    <div className="flex justify-between items-center">
                        <h1 className="text-h5 font-semibold">Recent Room</h1>
                        <div className="flex items-center w-2/3 mr-10">
                            <InputBox type={"text"} className="inline" onChange={(e: { target: { value: string } }) => searchRoom(e.target.value)} />
                            <FontAwesomeIcon icon={faSearch} className="w-6 text-h5 -ml-8 cursor-pointer" />
                        </div>
                    </div>
                    <table className="w-full mt-5">
                        <thead>
                            <tr className="text-start border-b-[1px] text-muted dark:text-light border-light">
                                <td className="py-3 text-start font-medium pe-4">No.</td>
                                <td className="py-3 text-start font-medium">Room Number</td>
                                <td className="py-3 text-start font-medium pe-4">Name</td>
                                <td className="py-3 text-start font-medium pe-4">Sender</td>
                                <td className="py-3 text-start font-medium">Sender Position</td>
                                <td className="py-3 text-start font-medium">Greeting</td>
                                <td className="py-3 text-start font-medium">Check-In</td>
                                <td className="py-3 text-start font-medium">Check-Out</td>
                                <td className="py-3 text-start font-medium">Detail</td>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems &&
                                currentItems.map((frontdesk: RoomManageType, index: number) => (
                                    <FrontDeskRow
                                        key={frontdesk.id}
                                        index={index + 1}
                                        frontdesk={frontdesk}
                                        onCheckIn={() => {
                                            setFormEmpty();
                                            onCheckin(frontdesk);
                                            setForm(frontdesk);
                                            setroomNumber(frontdesk.no);
                                            setFormValue("date", formattedDate);
                                            setFormValue("dateCheckOut", formattedDate);
                                            setFormValue("time", formattedTime);
                                            setFormValue("timeCheckOut", formattedTime);
                                            setFormValue("sender", dataHotel?.name);
                                            setGreetings(dataHotel?.defaultGreeting || "");
                                        }}
                                        onCheckOut={() => {
                                            if (frontdesk) {
                                                handleSubmitCheckOut(frontdesk);
                                            }
                                        }}
                                        onDetail={() => console.log("test")}
                                    />
                                ))}
                        </tbody>
                    </table>

                    {dataRoom && dataRoom.length > itemsPerPage && (
                        <div className="flex justify-center mt-4">
                            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className={`dark:bg-gray-700 px-3 py-1 rounded-l ${currentPage === 1 ? "border-[1px] dark:border-gray-700 border-gray-200 text-gray-400 cursor-not-allowed" : "border-[1px] dark:border-gray-700 border-gray-200 hover:bg-gray-200 hover:dark:bg-gray-500"}`}>
                                Prev
                            </button>
                            {dataRoom &&
                                dataRoom.length > 0 &&
                                [...Array(Math.ceil(dataRoom.length / itemsPerPage))].map((_, index) => (
                                    <button key={index} onClick={() => paginate(index + 1)} className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "border-[1px] border-gray-200 hover:dark:bg-gray-500 hover:bg-gray-200"}`}>
                                        {index + 1}
                                    </button>
                                ))}
                            <button onClick={() => paginate(currentPage + 1)} disabled={!dataRoom || currentPage === Math.ceil(dataRoom.length / itemsPerPage)} className={`dark:bg-gray-700 px-3 py-1 rounded-r ${!dataRoom || currentPage === Math.ceil(dataRoom.length / itemsPerPage) ? "border-[1px] dark:border-gray-700 border-gray-200 text-gray-400 cursor-not-allowed" : "border-[1px] dark:border-gray-700 border-gray-200 hover:bg-gray-200 hover:dark:bg-gray-500"}`}>
                                Next
                            </button>
                        </div>
                    )}
                </Card>

                <Modal
                    title={checkout ? "Check-Out" : "Check-In"}
                    show={modal}
                    onSave={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}
                    onClosed={() => {
                        setModal(modal ? false : true);
                        setCheckout(false);
                        setGreetings("");
                    }}
                    saveTitle={checkout ? "Check-Out" : "Check-In"}
                >
                    <InputGroup theme="horizontal" label={"Room Number"} type={"text"} disabled={true} name="roomNumber" />
                    <InputGroup theme="horizontal" label={"Guest Name"} type={"text"} name="name" />
                    <InputGroup theme="horizontal" label={"Guest Photo"} type={"file"} name="image" />
                    <InputGroup theme="horizontal" label={"Date Check In"} type={"date"} name="date" />
                    <InputGroup theme="horizontal" label={"Time Check In"} type={"time"} name="time" />
                    <InputGroup theme="horizontal" label={"Date Check Out"} type={"date"} name="dateCheckOut" />
                    <InputGroup theme="horizontal" label={"Time Check Out"} type={"time"} name="timeCheckOut" />
                    <InputGroup theme="horizontal" label={"Sender"} type={"text"} name="sender" />
                    <InputGroup theme="horizontal" label={"Sender Position"} type={"text"} name="senderPosition" />
                    <InputGroup
                        theme="horizontal"
                        label={"Greetings"}
                        type={"select"}
                        options={selectOptions}
                        value={Opt}
                        onChange={(e) => {
                            if (e.target.value == "template") {
                                setGreetings(dataHotel?.defaultGreeting || "");
                                setOpt("template");
                            } else {
                                setOpt("customize");
                                setGreetings("");
                            }
                        }}
                    />
                    <InputGroup
                        theme="horizontal"
                        label={""}
                        type={"textarea"}
                        value={greetings}
                        onChange={(e) => {
                            setGreetings(e.target.value);
                        }}
                        disabled={Opt == "template"}
                    />
                </Modal>
            </div>
        </>
    );
}
