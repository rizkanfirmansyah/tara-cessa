"use client";
import { Button, Card, InputGroup, Modal, RoomGrid } from "@/components";
import QR from "@/components/molecules/QR";
import { useHotelStore } from "@/components/store/hotelStore";
import { useLoungeStore } from "@/components/store/loungeStore";
import { Alert } from "@/helpers/Alert";
import fetchCustom from "@/helpers/FetchCustom";
import setFormEmpty from "@/helpers/FormInputCustom/empty";
import setFormValue from "@/helpers/FormInputCustom/setform";
import { userSession } from "@/helpers/UserData";
import { LoungeType, RoomManageType } from "@/types/RoomType";
import { faPersonShelter, faPlus, faQrcode, faRepeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import '../RoomDetail/style.css';

export default function LoungeDetail() {
    const [modal, setModal] = useState(false);
    const [modalRoom, setModalRoom] = useState(false);
    const [detailRoomID, setDetailRoomID] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const hotelID = useHotelStore((state) => state.hotelID);
    const dataRoom = useLoungeStore((state) => state.data);
    const updateData = useLoungeStore((state) => state.updateData);
    const dataRoomDetail = useLoungeStore((state) => state.dataDetail);
    const updateDataDetail = useLoungeStore((state) => state.updateDataDetail);
    let user = userSession;
    let bearerToken = user?.token ?? "";
    const itemsPerPage = 20;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        getData();
    }, [hotelID]);

    const getData = () => {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/tables`, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error(result.data.message);
                } else {
                    const res = result.data.data.sort((a: any, b: any) => {
                        // Convert 'no' field to numbers for proper numerical sorting
                        let noA = parseInt(a.no);
                        let noB = parseInt(b.no);

                        if (noA < noB) {
                            return -1;
                        }
                        if (noA > noB) {
                            return 1;
                        }
                        return 0;
                    });
                    updateData(res);
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

    const getDataRoom = (id: number) => {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/tables/${id}`, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error(result.data.message);
                } else {
                    updateDataDetail(result.data.data);
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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataRoom && dataRoom.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const tableName = formData.get("tableName") as string;
        const tableNo = formData.get("tableNo") as string;
        const location = formData.get("location") as string;

        const dataRoom = JSON.stringify({ tableName, tableNo, location });

        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/tables`;
        if (detailRoomID > 0) {
            url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/tables/${detailRoomID}`;
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);

        const requestOptions = {
            method: detailRoomID > 0 ? "PUT" : "POST",
            headers: myHeaders,
            body: dataRoom,
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
                setFormEmpty();
                setDetailRoomID(0);
                setModalRoom(false);
                setModal(false)
            })
            .catch((error) => {
                Alert({
                    title: 'Warning',
                    desc: error,
                    icon: 'warning'
                })
            });
    };

    async function handleDeleteRoom(idHotel?: number, idRoom?: number) {
        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/${idHotel}/tables/${idRoom}`;

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            body: null,
        };

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
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
                    Alert({
                        title: 'Success',
                        desc: "Data has been remove",
                        icon: 'success'
                    })
                    setModalRoom(false);
                    setModal(false)
                })
                .catch((error) => {
                    Alert({
                        title: 'Warning',
                        desc: error,
                        icon: 'warning'
                    })
                });
        } else {
            Swal.fire("Cancelled", "Your item is safe :)", "info");
        }
    }

    const getQR = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);
        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
        };
        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/tables/link`;
        fetch(url, requestOptions)
            .then(async (response) => {
                const data = await response.json();
                return data;
            })
            .then((result) => {
                if (result.response_code > 0) {
                    throw new Error(result.message);
                }
            })
            .catch((error) => {
                Alert({
                    title: 'Warning',
                    desc: error,
                    icon: 'warning'
                })
            });
    };

    return (
        <>
            <Card>
                <div className="flex justify-between items-center">
                    <h1 className="text-h5 font-semibold">List Table (Lounge)</h1>
                    <div className="flex ml-10 mr-2 space-x-3">
                        <Button theme="primary" onClick={() => setModalRoom(modalRoom ? false : true)}>
                            <FontAwesomeIcon icon={faPlus} />
                        </Button>
                        <Button theme="secondary" onClick={() => getData()}>
                            <FontAwesomeIcon icon={faRepeat} />
                        </Button>
                        <Button title="Generated QR" theme="dark" onClick={() => getQR()}>
                            <FontAwesomeIcon icon={faQrcode} />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-12 mt-10">
                    {currentItems?.map((rooms: LoungeType) => (
                        <RoomGrid
                            key={rooms.id}
                            name={rooms.tableNo}
                            // active={rooms.active}
                            // onClick={() => updateRowState(rooms.id)}
                            onClick={() => {
                                setModal(modal ? false : true);
                                getDataRoom(rooms.id);
                            }}
                            icon={faPersonShelter}
                        />
                    ))}
                </div>
            </Card>

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

            <Modal title={`${detailRoomID > 0 ? "Update Room" : "Insert Room"}`} show={modalRoom} onClosed={() => {
                setFormEmpty();
                setDetailRoomID(0);
                setModalRoom(false);
                setModal(false)
            }} onSave={(event: FormEvent<HTMLFormElement>) => handleSubmit(event)}>
                <InputGroup
                    theme="horizontal"
                    label={"Table Name"}
                    type={"text"}
                    name="tableName"
                />
                <InputGroup theme="horizontal" label={"Table No"} type={"text"} name="tableNo" />
                <InputGroup theme="horizontal" label={"Location"} type={"text"} name="location" />
            </Modal>

            <Modal title={`Room: ${dataRoomDetail?.tableNo}`} show={modal} onClosed={() => setModal(modal ? false : true)} onEdit={() => {
                setDetailRoomID(dataRoomDetail?.id || 0)
                setFormValue("tableName", dataRoomDetail?.tableName)
                setFormValue("tableNo", dataRoomDetail?.tableNo)
                setFormValue("location", dataRoomDetail?.location)
                setModalRoom(true);
                setModal(false);
            }}>
                <div className="flex justify-between" id="mediaPrint">
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <p className="text-gray-400">TABLE NAME</p>
                            <h5 className="dark:text-white">{dataRoomDetail?.tableName}</h5>
                        </div>
                        <div className="space-y-1">
                            <p className="text-gray-400">TABLE NO</p>
                            <h5 className="dark:text-white">{dataRoomDetail?.tableNo}</h5>
                        </div>

                        <div className="space-y-1">
                            <p className="text-gray-400">LOCATION</p>
                            <h5 className="dark:text-white">{dataRoomDetail?.location}</h5>
                        </div>
                    </div>
                    <div>
                        {dataRoomDetail?.link && (
                            <QR text={dataRoomDetail?.link} />
                        )}
                    </div>
                </div>

                <div className="flex justify-between">
                    <Button theme="danger" onClick={() => handleDeleteRoom(dataRoomDetail?.hotelId, dataRoomDetail?.id)} >Delete Lounge</Button>

                    <Button theme="primary" onClick={() => window.print()} >Print Data</Button>
                </div>
            </Modal>
        </>
    );
}
