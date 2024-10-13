"use client";
import { MetaContext } from "@/app/MetaProvider";
import { Card, CardFood, Toggle } from "@/components";
import { imageFood, imageFood2, imageFood3, imageFood4 } from "@/components/atoms/Images";
import { useOrderStore } from "@/components/store/guestOrderStore";
import { useHotelStore } from "@/components/store/hotelStore";
import { Alert } from "@/helpers/Alert";
import fetchCustom from "@/helpers/FetchCustom";
import FormatPrice from "@/helpers/FormatPrice";
import { userSession } from "@/helpers/UserData";
import { OrderType } from "@/types";
import { faBed, faCheckCircle, faList, faShoppingBasket, faUtensils, faWaterLadder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import './style.css';
import Button from "@/components/atoms/Button";
type Status = 'Completed' | 'Paid' | 'Arrived' | 'Delivery' | 'Preparing' | 'Verified' | 'In Order';
type OrderSource = 'all' | 'room' | 'table' | 'pooltable';

const getStatus = (order: OrderType, num?: number): Status => {
    if (num === 1) {
        if (order.paid === 1) return "Completed";
        if (order.arrived === 1) return "Paid";
        if (order.delivery === 1) return "Arrived";
        if (order.preparing === 1) return "Delivery";
        if (order.verified === 1) return "Preparing";

        return "Verified";
    } else {
        if (order.paid === 1) return "Paid";
        if (order.arrived === 1) return "Arrived";
        if (order.delivery === 1) return "Delivery";
        if (order.preparing === 1) return "Preparing";
        if (order.verified === 1) return "Verified";

        return "In Order";
    }
};

const getColor = (order: OrderType): string => {
    if (order.paid === 1) return "success";
    if (order.arrived === 1) return "blue-500";
    if (order.delivery === 1) return "yellow-700";
    if (order.preparing === 1) return "primary";
    if (order.verified === 1) return "transparent";

    return "white";
};

const getTextColor = (order: OrderType): string => {
    if (order.paid === 1) return "light";
    if (order.arrived === 1) return "light";
    if (order.delivery === 1) return "dark dark:text-light";
    if (order.preparing === 1) return "light";
    if (order.verified === 1) return "dark dark:text-light";

    return "dark dark:text-light";
};

const zeroPad = (n: number) => {
    return n.toLocaleString('id', { minimumIntegerDigits: 2 });
};

const getTimeDate = (timestamp: string) => {
    const dateObject = new Date(timestamp);
    const time = `${zeroPad(dateObject.getHours())}:${zeroPad(dateObject.getMinutes())}`;
    const date = `${dateObject.getFullYear()}-${zeroPad(dateObject.getMonth() + 1)}-${zeroPad(dateObject.getDate())}`;

    return `${date} ${time}`;
}

export default function GuestOrderPage({ }) {
    const [tab, setTab] = useState("list");
    const [subHarga, setSubHarga] = useState(0);
    const [PPN, setPPN] = useState(0);
    const [History, setHistory] = useState(0);
    const [Category, setCategory] = useState("all");
    const [detail, setDetail] = useState(0);
    const [dataDetail, setDataDetail] = useState<OrderType | null>(null);
    const [dataOrder, setdataOrder] = useState<OrderType[] | []>([]);
    const [filterStatus, setFilterStatus] = useState<Status[]>(['Verified', 'Preparing', 'In Order']);
    const [filterSource, setFilterSource] = useState<OrderSource>('all');
    const [newOrderId, setNewOrderId] = useState(0)
    const { updateTitle } = useContext(MetaContext);
    const datas = useOrderStore((state) => state.data);
    // const dataDetail = useOrderStore((state) => state.dataDetail);
    const hotelID = useHotelStore((state) => state.hotelID);
    const updateData = useOrderStore((state) => state.updateData);
    const dataHotel = useHotelStore((state) => state.data);
    const updateDataHotel = useHotelStore((state) => state.updateData);
    let user = userSession;
    let bearerToken = user?.token ?? "";
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const audioRef = useRef<HTMLAudioElement>(null);

    const dataFiltered = dataOrder.filter(v => {
        const status = filterStatus.length === 0 || filterStatus.indexOf(getStatus(v)) >= 0;

        let source = true;
        switch (filterSource) {
            case 'all':
                source = true;
                break;
            case 'pooltable':
                source = v.poolNo != null;
                break;
            case 'room':
                source = v.roomNo != null;
                break;
            case 'table':
                source = v.tableNo != null;
                break;
        }
        return status && source;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataFiltered.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const getDataOrder = (hotelID: number, history: number = 0, category = "all") => {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/order`, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error("Error fetching");
                } else {
                    let res = result.data.data.sort((a: any, b: any) => {
                        const dateA = new Date(a.orderDate);
                        const dateB = new Date(b.orderDate);

                        return dateB.getTime() - dateA.getTime();
                    }).filter((item: any) => item.id > 0);

                    if (category === "room") {
                        res = res.filter((item: any) => item.roomNo !== null && item.roomNo !== 0);
                    } else if (category === "table") {
                        res = res.filter((item: any) => item.tableNo !== null && item.tableNo !== 0);
                    } else if (category === "pooltable") {
                        res = res.filter((item: any) => item.poolNo !== null && item.poolNo !== 0);
                    }

                    setHistory(History);
                    setCategory(category);

                    let lastId = res[0]?.id;
                    if (newOrderId === 0) {
                        setNewOrderId(lastId);
                    }

                    if (lastId && lastId !== newOrderId && newOrderId !== 0) {
                        Alert({ title: 'Notification', type: 'info', desc: 'Ada pesanan baru!' });
                        if (audioRef.current != null) {
                            audioRef.current.play();
                        }
                        setNewOrderId(lastId);
                    }
                    updateData(res);
                    setdataOrder(res);
                }
            })
            .catch((error) => {
                if (error.message === "Error fetching" || error.response?.status === 500) {
                    fetch('/assets/data/unitdata.json')
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error("Failed to fetch local data");
                            }
                            return response.json();
                        })
                        .then((localData) => {
                            let res = localData.data.sort((a: any, b: any) => {
                                const dateA = new Date(a.orderDate);
                                const dateB = new Date(b.orderDate);

                                return dateB.getTime() - dateA.getTime();
                            }).filter((item: any) => item.id > 0);

                            if (category === "room") {
                                res = res.filter((item: any) => item.roomNo !== null && item.roomNo !== 0);
                            } else if (category === "table") {
                                res = res.filter((item: any) => item.tableNo !== null && item.tableNo !== 0);
                            } else if (category === "pooltable") {
                                res = res.filter((item: any) => item.poolNo !== null && item.poolNo !== 0);
                            }

                            setCategory(category);
                            setHistory(history);

                            let lastId = res[0]?.id;
                            if (newOrderId === 0) {
                                setNewOrderId(lastId);
                            }

                            if (lastId && lastId !== newOrderId && newOrderId !== 0) {
                                Alert({ title: 'Notification', type: 'info', desc: 'Ada pesanan baru!' });
                                if (audioRef.current != null) {
                                    audioRef.current.play();
                                }
                                setNewOrderId(lastId);
                            }

                            updateData(res);
                            setdataOrder(res);
                        })
                        .catch((localError) => {
                            console.error("Error fetching local data:", localError);
                        });
                }
            });

    };

    function searchOrder(searchCriteria: string) {
        if (datas) {
            const res: OrderType[] = datas.filter(order => {
                if (searchCriteria) {
                    if (order.roomNo?.includes(searchCriteria)) {
                        return true;
                    }
                    if (order.tableNo?.includes(searchCriteria)) {
                        return true;
                    }
                    if (order.poolNo?.includes(searchCriteria)) {
                        return true;
                    }
                    if (order.guestName?.includes(searchCriteria)) {
                        return true;
                    }
                    return false;
                }
                return true;
            });
            setdataOrder(res);
        }
    }

    const getdataDetail = (value: OrderType) => {
        setDataDetail(value);
        countSubHarga(value)
    };

    const getDataHotel = () => {
        let url = `${process.env.NEXT_PUBLIC_URL}/hotels`;
        let bearerToken = user.token;
        if (dataHotel && dataHotel?.length < 1) {
            fetchCustom<any>(url, bearerToken)
                .then((result) => {
                    if (result.error) {
                    } else {
                        updateDataHotel(result.data.data);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        }
    };

    function countSubHarga(value: OrderType) {
        let dataHarga = 0;
        setPPN(0);
        setSubHarga(0);
        if (value?.foodItems && value.foodItems.length > 0) {
            dataHarga += value.foodItems.reduce((acc, food) => acc + food.qty * food.price, 0)
        }

        setSubHarga(dataHarga)
        setTimeout(() => {
            let dataPPN = dataHarga ? dataHarga * 0.1 : 0;
            setPPN(dataPPN)
        }, 10);

    }

    const handleChangeStatus = async (order: OrderType) => {
        let data: Object = {};
        if (order.preparing === 0) data = { preparing: 1 };
        else if (order.delivery === 0) data = { delivery: 1 };
        else if (order.arrived === 0) data = { arrived: 1 };
        else if (order.paid === 0) data = { paid: 1 };
        else if (order.verified === 0) data = { verified: 1 };
        const jsonData = JSON.stringify(data);

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Ingin mengubah status pesanan?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, save it!",
        });

        if (result.isConfirmed) {
            let url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/order/${order.id}`;

            // const formdata = new FormData();
            // formdata.append("data", jsonData);
            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + bearerToken);
            myHeaders.append("Content-Type", "application/json");
            const requestOptions = {
                method: "PUT",
                headers: myHeaders,
                body: jsonData,
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
                    getDataOrder(hotelID ?? 0);
                })
                .catch((error) => console.error(error))
                .finally(() => {
                });
        } else {
            Swal.fire("Cancelled", "Cancelled!!", "info");
        }
    };

    const handleChangeStatusOpenResto = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Ingin mengubah status order?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, save it!",
        });

        if (result.isConfirmed) {
            let url = `${process.env.NEXT_PUBLIC_URL}/hotels/resto`;

            let data: Object = {
                "id": hotelID,
                "restoOpen": 1,
            };
            const jsonData = JSON.stringify(data);
            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + bearerToken);
            myHeaders.append("Content-Type", "application/json");
            const requestOptions = {
                method: "PUT",
                headers: myHeaders,
                body: jsonData,
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
                    getDataOrder(hotelID ?? 0);
                })
                .catch((error) => console.error(error))
                .finally(() => {
                    getDataHotel();
                });
        } else {
            Swal.fire("Cancelled", "Cancelled!!", "info");
        }
    };


    useEffect(() => {
        updateTitle("Order");
        getDataHotel();
        return () => {
            updateTitle("Dashboard");
        };

    }, [updateTitle]);


    useEffect(() => {
        const intervalId = setInterval(() => {
            getDataOrder(hotelID ?? 0, History, Category);
        }, 2000);

        return () => clearInterval(intervalId);
    }, [hotelID, History, Category, newOrderId]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus, filterSource]);

    return (
        <div className="grid grid-cols-3 gap-5">
            <audio ref={audioRef} src="/assets/notification-alert.mp3" />
            <div className={`${detail ? "col-span-2" : "col-span-3"} no-print`}>
                <Card>
                    <div className="flex gap-5 items-center justify-between -my-2 -mx-2">
                        <div className="flex space-x-10">
                            <div className="flex border-muted border-[1px] rounded-full">
                                <div
                                    className={`${filterSource === "all" ? "bg-primary-15 text-dark dark:text-light" : "bg-transparent hover:text-primary text-muted hover:bg-primary-15"} transition-all duration-300 cursor-pointer rounded-l-full p-3 pl-5`}
                                    onClick={() => setFilterSource('all')}
                                    title="All Data"
                                >
                                    <div className="flex items-center gap-2 px-1">
                                        <FontAwesomeIcon icon={faList} className="h-3.5" />
                                        All
                                    </div>
                                </div>
                                <div
                                    className={`${filterSource === "room" ? 'bg-primary-15 text-dark dark:text-light' : 'bg-transparent hover:text-primary text-muted hover:bg-primary-15'} cursor-pointer p-3`}
                                    onClick={() => setFilterSource('room')}
                                    title="Room Data"
                                >
                                    <div className="flex items-center gap-2 px-1">
                                        <FontAwesomeIcon icon={faBed} className="h-3.5" />
                                        Room
                                    </div>
                                </div>
                                <div
                                    className={`${filterSource === "table" ? 'bg-primary-15 text-dark dark:text-light' : 'bg-transparent hover:text-primary text-muted hover:bg-primary-15'} cursor-pointer p-3`}
                                    onClick={() => setFilterSource('table')}
                                    title="Lounge Data"
                                >
                                    <div className="flex items-center gap-2 px-1">
                                        <FontAwesomeIcon icon={faUtensils} className="h-3.5" />
                                        Lounge
                                    </div>
                                </div>
                                <div
                                    className={`${filterSource === "pooltable" ? 'bg-primary-15 text-dark dark:text-light' : 'bg-transparent hover:text-primary text-muted hover:bg-primary-15'} cursor-pointer rounded-r-full p-3 pr-5`}
                                    onClick={() => setFilterSource('pooltable')}
                                    title="Pool Table Data">
                                    <div className="flex items-center gap-2 px-1">
                                        <FontAwesomeIcon icon={faWaterLadder} className="h-3.5" />
                                        Pool
                                    </div>
                                </div>
                            </div>

                            <div className="flex border-muted border-[1px] rounded-full">
                                <div
                                    className={`${filterStatus.length === 0 ? "bg-primary-15 text-dark dark:text-light" : "bg-transparent hover:text-primary text-muted hover:bg-primary-15"} transition-all duration-300 cursor-pointer rounded-l-full p-3 pl-5`}
                                    onClick={() => setFilterStatus([])}
                                >
                                    All
                                </div>
                                <div
                                    className={`${filterStatus.indexOf('Preparing') >= 0 ? "bg-primary-15 text-dark dark:text-light" : "bg-transparent hover:text-primary text-muted hover:bg-primary-15"} transition-all duration-300 cursor-pointer p-3`}
                                    onClick={() => setFilterStatus(['In Order', 'Preparing', 'Verified'])}
                                >
                                    Kitchen
                                </div>
                                <div
                                    className={`${filterStatus.indexOf('Delivery') >= 0 ? 'bg-primary-15 text-dark dark:text-light' : 'bg-transparent hover:text-primary text-muted hover:bg-primary-15'} cursor-pointer p-3`}
                                    onClick={() => setFilterStatus(['Delivery'])}
                                >
                                    Delivery
                                </div>
                                <div
                                    className={`${filterStatus.indexOf('Arrived') >= 0 ? 'bg-primary-15 text-dark dark:text-light' : 'bg-transparent hover:text-primary text-muted hover:bg-primary-15'} cursor-pointer p-3`}
                                    onClick={() => setFilterStatus(['Arrived'])}
                                >
                                    Payment
                                </div>
                                <div
                                    className={`${filterStatus.indexOf('Completed') >= 0 ? 'bg-primary-15 text-dark dark:text-light' : 'bg-transparent hover:text-primary text-muted hover:bg-primary-15'} cursor-pointer p-3 pr-5 rounded-r-full`}
                                    onClick={() => setFilterStatus(['Paid', 'Completed'])}
                                >
                                    Completed
                                </div>
                            </div>
                        </div>

                        <Toggle title="Services Order" onChange={handleChangeStatusOpenResto} hotel={dataHotel} />
                    </div>
                </Card>
                {tab === "order" && (
                    <div className="grid grid-cols-4 gap-6 mt-5">
                        <CardFood title={"Pretzel Chicken Noodle Soup - Regular"} image={imageFood} />
                        <CardFood title={"Cucumber Avo Bites"} image={imageFood2} />
                        <CardFood title={"Naked Jackfruit Burrito Bow"} image={imageFood3} />
                        <CardFood title={"Pasta Alla Gricia"} image={imageFood4} />
                        <CardFood title={"Pretzel Chicken Noodle Soup - Regular"} image={imageFood} />
                        <CardFood title={"Cucumber Avo Bites"} image={imageFood2} />
                        <CardFood title={"Naked Jackfruit Burrito Bow"} image={imageFood3} />
                        <CardFood title={"Pasta Alla Gricia"} image={imageFood4} />
                        <CardFood title={"Pretzel Chicken Noodle Soup - Regular"} image={imageFood} />
                        <CardFood title={"Cucumber Avo Bites"} image={imageFood2} />
                        <CardFood title={"Naked Jackfruit Burrito Bow"} image={imageFood3} />
                        <CardFood title={"Pasta Alla Gricia"} image={imageFood4} />
                    </div>
                )}
                {tab === "list" && (
                    <Card className="mt-5">
                        <h1 className="text-h5 font-semibold">Order {History ? 'History' : 'List'}</h1>
                        <table className="w-full mt-5">
                            <thead>
                                <tr className="text-start border-b-[1px] text-muted dark:text-light border-light">
                                    <th className="py-3 text-start font-medium">No.</th>
                                    <th className="py-3 text-start font-medium">Order Number</th>
                                    <th className="py-3 text-start font-medium">Guest Name</th>
                                    <th className="py-3 text-start font-medium">Status</th>
                                    <th className="py-3 text-start font-medium">Order Date</th>
                                    <th className="py-3 text-start font-medium">Change Status</th>
                                    <th className="py-3 text-start font-medium">Charge In</th>
                                    <th className="py-3 text-start font-medium">Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems?.map((value, index) => (
                                    <tr className="text-start border-b-[1px] text-dark dark:text-light border-light" key={"order" + index + value.id}>
                                        <td className="py-3 text-start font-medium text-sm ">{index + 1 + indexOfFirstItem}</td>
                                        <td className="py-3 text-start font-medium text-sm">
                                            <div className="flex gap-2 items-center">
                                                {value.roomNo && `Room -  ${value.roomNo}`}
                                                {value.tableNo && `Lounge Table - ${value.tableNo}`}
                                                {value.poolNo && `Pool Table - ${value.poolNo}`}
                                                {getStatus(value) === 'Verified' && newOrderId === value.id && ((new Date(value.orderDate)).getTime() > ((new Date()).getTime() - (1000 * 60 * 5))) && (
                                                    <div className="bg-primary text-xs text-light rounded-full py-1 px-2">
                                                        New
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 text-start font-medium text-sm ">{value.guestName} </td>
                                        <td className={`py-3 text-start font-medium text-sm text-${getColor(value)}`}>{getStatus(value)}</td>
                                        <td className="py-3 text-start font-medium text-sm ">{getTimeDate(value.orderDate)}</td>
                                        <td className="py-3 text-start font-medium text-sm ">
                                            <button
                                                className={`bg-${getColor(value)} text-${getTextColor(value)} hover:bg-primary-15' transition-all duration-300 cursor-pointer rounded pe-4 ps-3 pt-2.5 pb-2`}
                                                onClick={() => {
                                                    handleChangeStatus(value);
                                                }}
                                            >
                                                {getStatus(value, 1)} &nbsp;
                                                <FontAwesomeIcon icon={faCheckCircle} />
                                            </button>
                                        </td>
                                        <td className="py-3 text-start font-medium text-sm capitalize">{value.paymentMethod}</td>
                                        <td className="py-3 text-start font-medium text-sm text-green-600">
                                            <button
                                                className={`hover:bg-primary-15 bg-transparent hover:text-primary text-muted hover:bg-primary-15' transition-all duration-300 cursor-pointer rounded pe-4 ps-3 pt-2.5 pb-2`}
                                                onClick={() => {
                                                    getdataDetail(value);
                                                    if (detail === value.id) {
                                                        setDetail(0);
                                                    } else {
                                                        setDetail(value.id);
                                                    }
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faList} className="w-10 h-[20px]" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>



                        {dataFiltered.length > itemsPerPage && (
                            <div className="flex justify-center mt-4">
                                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className={`dark:bg-gray-700 px-3 py-1 rounded-l ${currentPage === 1 ? "border-[1px] dark:border-gray-700 border-gray-200 text-gray-400 cursor-not-allowed" : "border-[1px] dark:border-gray-700 border-gray-200 hover:bg-gray-200 hover:dark:bg-gray-500"}`}>
                                    Prev
                                </button>
                                {dataFiltered.length > 0 &&
                                    [...Array(Math.ceil(dataFiltered.length / itemsPerPage))].map((_, index) => (
                                        <button key={index} onClick={() => paginate(index + 1)} className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "border-[1px] border-gray-200 hover:dark:bg-gray-500 hover:bg-gray-200"}`}>
                                            {index + 1}
                                        </button>
                                    ))}
                                <button onClick={() => paginate(currentPage + 1)} disabled={!dataFiltered || currentPage === Math.ceil(dataFiltered.length / itemsPerPage)} className={`dark:bg-gray-700 px-3 py-1 rounded-r ${!dataFiltered || currentPage === Math.ceil(dataFiltered.length / itemsPerPage) ? "border-[1px] dark:border-gray-700 border-gray-200 text-gray-400 cursor-not-allowed" : "border-[1px] dark:border-gray-700 border-gray-200 hover:bg-gray-200 hover:dark:bg-gray-500"}`}>
                                    Next
                                </button>
                            </div>
                        )}
                    </Card>
                )}
            </div>
            <div className={`${detail ? "col-span-1" : "hidden"}`} id="mediaPrint" >
                <Card className="h-full">
                    <div className="border-b-[1px] border-semigray -mx-6 px-6 pb-3">
                        <h1 className="font-semibold text-subtitle">Order Detail</h1>
                    </div>

                    <div className="mt-6">
                        <div className="mb-2">{dataDetail && getTimeDate(dataDetail.orderDate)}</div>
                        <div className="font-semibold">{dataDetail?.guestName}</div>
                        {dataDetail?.roomNo && <div>Room -  {dataDetail.roomNo}</div>}
                        {dataDetail?.tableNo && <div>Lounge Table - {dataDetail.tableNo}</div>}
                        {dataDetail?.poolNo && <div>Pool Table - {dataDetail.poolNo}</div>}
                    </div>

                    {dataDetail?.foodItems == null ? (
                        <div className="flex justify-center items-center h-full flex-col">
                            <FontAwesomeIcon icon={faShoppingBasket} className="text-muted text-[100px]" />
                            <h1 className="text-subtitle font-medium text-semigray mt-4">No Item Added</h1>
                        </div>
                    ) : (
                        <div className="w-full mt-2">
                            {dataDetail.foodItems &&
                                dataDetail.foodItems.map((food, index: number) => (
                                    <div key={index + 1} className={`flex justify-between items-start border-b-[1px] border-semigray py-6 ${index === dataDetail.foodItems.length - 1 ? "border-dashed mb-10" : ""}`}>
                                        <div>
                                            <p style={{ marginBottom: 10 }}><b>{food.name}</b></p>
                                            {food.note == null || food.note.length === 0 && (
                                                <p>Note: -</p>
                                            )}
                                            {food.note.split('\n').map((line, index) => {
                                                const keyVal = line.split(':');

                                                if (keyVal[0] === '' || keyVal[0] === 'Quantity') {
                                                    return null;
                                                }

                                                if (keyVal[0] !== 'Note' && keyVal[0] !== 'Additional') {
                                                    return (
                                                        <p key={index}>Note:<br />{keyVal[0]}</p>
                                                    )
                                                }

                                                return (
                                                    <p key={index}>
                                                        {keyVal[0]}: &nbsp;
                                                        {keyVal.length > 1 && keyVal[1].trim() !== '' ? (
                                                            <span
                                                                dangerouslySetInnerHTML={{
                                                                    __html: keyVal[1],
                                                                }}
                                                            />
                                                        ) : '-'}
                                                    </p>
                                                );
                                            })}
                                        </div>
                                        <p className="border border-semigray px-4 py-1">{food.qty}</p>
                                        <p>{FormatPrice(food.price)}</p>
                                    </div>
                                ))}
                            {subHarga && (
                                <div>
                                    <div className="flex items-center justify-between font-semibold">
                                        <p>Total</p>
                                        <p>{FormatPrice(subHarga)}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <p>Charge In</p>
                                        <p className="capitalize">{dataDetail.paymentMethod}</p>
                                    </div>
                                </div>
                            )}
                            <Button theme="primary" className="w-full mt-5 py-4 hover:bg-light hover:text-primary hover:border-primary no-print" onClick={() => window.print()}>
                                Print Transaction
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
