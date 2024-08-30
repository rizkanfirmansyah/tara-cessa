"use client";
import { MetaContext } from "@/app/MetaProvider";
import { Button, Card, CardFood, InputBox } from "@/components";
import { imageFood, imageFood2, imageFood3, imageFood4 } from "@/components/atoms/Images";
import { useOrderStore } from "@/components/store/guestOrderStore";
import { useHotelStore } from "@/components/store/hotelStore";
import fetchCustom from "@/helpers/FetchCustom";
import FormatPrice from "@/helpers/FormatPrice";
import { userSession } from "@/helpers/UserData";
import { OrderType } from "@/types";
import { faBookOpen, faCheckCircle, faDoorOpen, faList, faPersonShelter, faRepeat, faRestroom, faSearch, faShoppingBasket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import './style.css';
import { Alert } from "@/helpers/Alert";

export default function GuestOrderPage({ }) {
    const [tab, setTab] = useState("list");
    const [subHarga, setSubHarga] = useState(0);
    const [PPN, setPPN] = useState(0);
    const [History, setHistory] = useState(0);
    const [Category, setCategory] = useState("all");
    const [detail, setDetail] = useState(0);
    const [dataDetail, setDataDetail] = useState<OrderType | null>(null);
    const [dataOrder, setdataOrder] = useState<OrderType[] | []>([]);
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
    const itemsPerPage = 15;
    let idLastOrder = 0;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataOrder && dataOrder.slice(indexOfFirstItem, indexOfLastItem);

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
                    }).filter((item: any) => item.paid === history);

                    if (category === "room") {
                        res = res.filter((item: any) => item.roomNo !== null && item.roomNo !== 0);
                    } else if (category === "table") {
                        res = res.filter((item: any) => item.tableNo !== null && item.tableNo !== 0);
                    } else if (category === "pooltable") {
                        res = res.filter((item: any) => item.poolNo !== null && item.poolNo !== 0);
                    }

                    setHistory(history);
                    setCategory(category);

                    let idOrderLast = res[res?.length - 1]?.id;
                    if (idOrderLast && idOrderLast !== idLastOrder && idLastOrder !== 0) {
                        Alert({ title: 'Notification', type: 'info', desc: 'Ada pesanan baru!' });
                        idLastOrder = idOrderLast;
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
                            }).filter((item: any) => item.paid === history);

                            if (category === "room") {
                                res = res.filter((item: any) => item.roomNo !== null && item.roomNo !== 0);
                            } else if (category === "table") {
                                res = res.filter((item: any) => item.tableNo !== null && item.tableNo !== 0);
                            } else if (category === "pooltable") {
                                res = res.filter((item: any) => item.poolNo !== null && item.poolNo !== 0);
                            }

                            setCategory(category);
                            setHistory(history);

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

    useEffect(() => {
        getDataHotel();
        let hotelIDnum = hotelID ? hotelID : dataHotel?.[0].id;

        const interval = setInterval(() => {
            getDataOrder(hotelIDnum ?? parseInt(hotelIDnum ?? "0"));
        }, (60 * 2) * 1000);

        return () => clearInterval(interval);
    }, [dataHotel, getDataOrder, hotelID]);

    useEffect(() => {
        let hotelIDnum = hotelID ? hotelID : dataHotel?.[0].id;
        getDataOrder(hotelIDnum ?? parseInt(hotelIDnum ?? "0"));

    }, [])


    const getStatus = (order: OrderType, num?: number): string => {
        if (num === 1) {
            if (order.paid === 1) return "Completed";
            if (order.arrived === 1) return "Paid";
            if (order.delivery === 1) return "Arrived";
            if (order.preparing === 1) return "Delivery";
            if (order.verified === 1) return "Prepairing";

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

    const getTimeDate = (timestamp: string) => {
        const dateObject = new Date(timestamp);
        const formattedDate = dateObject.toISOString().slice(0, 16).replace('T', ' ');

        return formattedDate;
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


    useEffect(() => {
        setInterval(() => {
            getDataOrder(hotelID ?? 0)
        }, 2000);
        updateTitle("Order");
        return () => {
            updateTitle("Dashboard");
        };

    }, [updateTitle]);

    return (
        <div className="grid grid-cols-3 gap-5">
            <div className={`${detail ? "col-span-2" : "col-span-3"} no-print`}>
                <Card>
                    <div className="flex gap-10 justify-between items-center -my-2 -mx-2">
                        <div className="flex items-center w-1/3 mr-10">
                            <InputBox type={"text"} className="inline" onChange={(e: { target: { value: string; }; }) => searchOrder(e.target.value)} />
                            <FontAwesomeIcon icon={faSearch} className="w-6 text-h5 -ml-8 cursor-pointer" />
                        </div>
                        <div className="flex border-muted border-[1px] rounded-lg">
                            <div className={`${!History && Category === "all" ? "bg-primary-15 text-white" : "bg-transparent hover:text-primary text-muted hover:bg-primary-15"} transition-all duration-300 cursor-pointer rounded-tr-[7px] rounded-br-[7px] pe-4 ps-3 pt-2.5 pb-2`} onClick={() => {
                                getDataOrder(hotelID ?? 0)
                            }} title="All Data">
                                <FontAwesomeIcon icon={faRepeat} className="w-10 h-[20px]" />
                            </div>
                            <div className={`${Category === "room" ? 'bg-primary-15 text-primary' : 'bg-transparent hover:text-primary text-muted hover:bg-primary-15'} cursor-pointer rounded-tl-[7px] rounded-bl-[7px] ps-4 pe-3 pt-2.5 pb-2`} onClick={() => {
                                getDataOrder(hotelID ?? 0, 0, "room")
                            }} title="Room Data">
                                <FontAwesomeIcon icon={faDoorOpen} className="w-10  h-[20px]" />
                            </div>
                            <div className={`${Category === "table" ? 'bg-primary-15 text-primary' : 'bg-transparent hover:text-primary text-muted hover:bg-primary-15'} cursor-pointer rounded-tl-[7px] rounded-bl-[7px] ps-4 pe-3 pt-2.5 pb-2`} onClick={() => {
                                getDataOrder(hotelID ?? 0, 0, "table")
                            }} title="Lounge Data">
                                <FontAwesomeIcon icon={faPersonShelter} className="w-10  h-[20px]" />
                            </div>
                            <div className={`${Category === "pooltable" ? 'bg-primary-15 text-primary' : 'bg-transparent hover:text-primary text-muted hover:bg-primary-15'} cursor-pointer rounded-tl-[7px] rounded-bl-[7px] ps-4 pe-3 pt-2.5 pb-2`} onClick={() => {
                                getDataOrder(hotelID ?? 0, 0, "pooltable")
                            }} title="Pool Table Data">
                                <FontAwesomeIcon icon={faRestroom} className="w-10  h-[20px]" />
                            </div>
                            <div className={`${History ? 'bg-primary-15 text-primary' : 'bg-transparent hover:text-primary text-muted hover:bg-primary-15'} cursor-pointer rounded-tl-[7px] rounded-bl-[7px] ps-4 pe-3 pt-2.5 pb-2`} onClick={() => {
                                getDataOrder(hotelID ?? 0, 1)
                            }} title="History Data">
                                <FontAwesomeIcon icon={faBookOpen} className="w-10  h-[20px]" />
                            </div>
                        </div>
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
                                    <td className="py-3 text-start font-medium">No.</td>
                                    <td className="py-3 text-start font-medium">Order Number</td>
                                    <td className="py-3 text-start font-medium">Guest Name</td>
                                    <td className="py-3 text-start font-medium">Status</td>
                                    <td className="py-3 text-start font-medium">Order Date</td>
                                    <td className="py-3 text-start font-medium">Change Status</td>
                                    <td className="py-3 text-start font-medium">Detail</td>
                                </tr>
                            </thead>
                            <tbody className="">
                                {currentItems?.map((value, index) => (
                                    <tr className="text-start border-b-[1px] text-dark dark:text-light border-light" key={"order" + index + value.id}>
                                        <td className="py-3 text-start font-medium text-sm ">{index + 1 + indexOfFirstItem}</td>
                                        <td className="py-3 text-start font-medium text-sm ">{value.roomNo} {value.tableNo} {value.poolNo}
                                            {value.roomNo && " (Room)"}
                                            {value.tableNo && " (Lounge)"}
                                            {value.poolNo && " (PoolTable)"}

                                        </td>
                                        <td className="py-3 text-start font-medium text-sm ">{value.guestName} </td>
                                        <td className={`py-3 text-start font-medium text-sm text-${getColor(value)}`}>{getStatus(value)}</td>
                                        <td className="py-3 text-start font-medium text-sm ">{getTimeDate(value.orderDate)}</td>
                                        <td className="py-3 text-start font-medium text-sm ">
                                            <button
                                                className={`bg-${getColor(value)} text-${getColor(value) == 'white' ? 'dark' : 'white'} hover:bg-primary-15' transition-all duration-300 cursor-pointer rounded pe-4 ps-3 pt-2.5 pb-2`}
                                                onClick={() => {
                                                    handleChangeStatus(value);
                                                }}
                                            >
                                                {getStatus(value, 1)} &nbsp;
                                                <FontAwesomeIcon icon={faCheckCircle} />
                                            </button>
                                        </td>
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



                        {dataOrder && dataOrder.length > itemsPerPage && (
                            <div className="flex justify-center mt-4">
                                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className={`dark:bg-gray-700 px-3 py-1 rounded-l ${currentPage === 1 ? "border-[1px] dark:border-gray-700 border-gray-200 text-gray-400 cursor-not-allowed" : "border-[1px] dark:border-gray-700 border-gray-200 hover:bg-gray-200 hover:dark:bg-gray-500"}`}>
                                    Prev
                                </button>
                                {dataOrder &&
                                    dataOrder.length > 0 &&
                                    [...Array(Math.ceil(dataOrder.length / itemsPerPage))].map((_, index) => (
                                        <button key={index} onClick={() => paginate(index + 1)} className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "border-[1px] border-gray-200 hover:dark:bg-gray-500 hover:bg-gray-200"}`}>
                                            {index + 1}
                                        </button>
                                    ))}
                                <button onClick={() => paginate(currentPage + 1)} disabled={!dataOrder || currentPage === Math.ceil(dataOrder.length / itemsPerPage)} className={`dark:bg-gray-700 px-3 py-1 rounded-r ${!dataOrder || currentPage === Math.ceil(dataOrder.length / itemsPerPage) ? "border-[1px] dark:border-gray-700 border-gray-200 text-gray-400 cursor-not-allowed" : "border-[1px] dark:border-gray-700 border-gray-200 hover:bg-gray-200 hover:dark:bg-gray-500"}`}>
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
                    {dataDetail?.foodItems == null ? (
                        <div className="flex justify-center items-center h-full flex-col">
                            <FontAwesomeIcon icon={faShoppingBasket} className="text-muted text-[100px]" />
                            <h1 className="text-subtitle font-medium text-semigray mt-4">No Item Added</h1>
                        </div>
                    ) : (
                        <div className="w-full mt-5">
                            {dataDetail.foodItems &&
                                dataDetail.foodItems.map((food, index: number) => (
                                    <div key={index + 1} className={`flex justify-between items-center border-b-[1px] border-semigray py-6 ${index === dataDetail.foodItems.length - 1 ? "border-dashed mb-10" : ""}`}>
                                        <div>
                                            <p>{food.name}</p>
                                            <p dangerouslySetInnerHTML={{ __html: food.note.replace(/(:|,)/g, '$1<br/>') }}></p>
                                        </div>
                                        <p className="border border-semigray px-4 py-1">{food.qty}</p>
                                        <p>{FormatPrice(food.price)}</p>
                                    </div>
                                ))}
                            {subHarga && (
                                <div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-gray-300">Sub Total</p>
                                        <p>{FormatPrice(subHarga)}</p>
                                    </div>
                                    <div className="flex items-center justify-between py-3">
                                        <p className="text-gray-300">Ppn</p>
                                        <p>{FormatPrice(PPN)}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p>Total</p>
                                        <p>{FormatPrice(subHarga + PPN)}</p>
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
