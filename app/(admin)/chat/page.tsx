"use client";
import { Button, ContactChat, InputBox, InputGroup, MessageChat, Modal, imageHotel1 } from "@/components";
import { useChatStore } from "@/components/store/chatStore";
import { useHotelStore } from "@/components/store/hotelStore";
import fetchCustom from "@/helpers/FetchCustom";
import { userSession } from "@/helpers/UserData";
import { ChatDepartementType, ChatType, EventTargetType, GroupedMessages } from "@/types";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { WebSocketCallbackType, useWebSocket } from "@quicksocket/usewebsocket";
import Image from "next/image";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import "./style.css";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function ChatPage() {
    const containerRef: RefObject<any | null> = useRef(null);
    const [messageChat, setMessageChat] = useState("");
    const [modal, setModal] = useState(false);
    const [viewChat, setViewChat] = useState(false);
    const [department, setDepartment] = useState("");
    const [departmentID, setDepartmentID] = useState(0);
    const [roomID, setRoomID] = useState("0");
    const [groupedData, setGroupedData] = useState<GroupedMessages>({});
    const [icon, setIcon] = useState("");
    const updateData = useChatStore((state) => state.updateData);
    const updateDataChat = useChatStore((state) => state.updateDataChat);
    const dataChatDepartment = useChatStore((state) => state.data);
    const roomTimestamps: { [key: string]: number } = {};
    const hotelID = useHotelStore((state) => state.hotelID);
    let user = userSession;
    let bearerToken = user?.token ?? "";

    useEffect(() => {
        if (containerRef && containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [groupedData]);

    useEffect(() => {
        getDataDepartment();
    }, []);

    useEffect(() => {
        if (dataChatDepartment && dataChatDepartment.length > 0) {
            setDepartmentID(dataChatDepartment[0].id);
        }
    }, [dataChatDepartment]);

    useEffect(() => {
        if (departmentID !== null) {
            getDataChat();
        }
    }, [departmentID]);

    // WebSocket segments
    const [messageHistory, setMessageHistory] = useState<string[]>([]);
    const [status, setStatus] = useState<string>('Disconnected');

    const handleWebSocketCallback = useCallback((type: WebSocketCallbackType, message?: unknown) => {
        switch (type) {
            case WebSocketCallbackType.Connected:
                setStatus('Connected');
                break;
            case WebSocketCallbackType.Disconnected:
                setStatus('Disconnected');
                break;
            case WebSocketCallbackType.Error:
                setStatus('Error');
                break;
            case WebSocketCallbackType.Message:
                if (typeof message === 'string') {
                    setMessageHistory(prev => [...prev, message]);
                }
                break;
            default:
                break;
        }
    }, []);

    const { sendMessage, disconnect } = useWebSocket(handleWebSocketCallback, 'wss://api.siorta.com/chat');

    const handleSendMessage = () => {
        const messageBody = {
            departmentId: 4,
            roomNo: "7",
            guestName: "Udin",
            message: "Apalah"
        };

        sendMessage(JSON.stringify(messageBody));

        const data = JSON.stringify({
            departmentId: 4,
            roomNo: "7",
            message: "Apalah"
        });

        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/chat`;

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
                    throw new Error("500 Server Error");
                }
                getDataDepartment();
                setModal(false);
            })
            .catch((error) => {
                console.error("Error sending chat:", error);
            });
    };

    // Data fetching segments
    const getDataDepartment = () => {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/department`, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error("Error fetching");
                } else {
                    updateData(result.data.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const getDataChat = () => {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/chat`, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error("Error fetching");
                } else {
                    updateDataChat(result.data.data);
                    if (result.data?.data.length > 0) {
                        const groupedData: GroupedMessages = {};
                        const data: ChatType[] = result.data.data;
                        data.forEach((item: ChatType) => {
                            const { departmentId, roomNo, timestamp } = item;

                            // Convert timestamp to a number if it's not already
                            const numericTimestamp = +timestamp; // Using unary plus to convert to a number

                            if (!groupedData[departmentId]) {
                                groupedData[departmentId] = {};
                            }

                            if (!groupedData[departmentId][roomNo]) {
                                groupedData[departmentId][roomNo] = [];
                                roomTimestamps[`${departmentId}-${roomNo}`] = numericTimestamp; // Initialize with the converted timestamp
                            }

                            groupedData[departmentId][roomNo].push(item);

                            // Update the latest timestamp if the current one is newer
                            if (numericTimestamp > roomTimestamps[`${departmentId}-${roomNo}`]) {
                                roomTimestamps[`${departmentId}-${roomNo}`] = numericTimestamp;
                            }
                        });

                        setGroupedData(groupedData);
                    }
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const data = JSON.stringify({
            department: department,
            icon: icon,
        });

        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/department`;

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
                    throw new Error("500 Server Error");
                }
                getDataDepartment();
                setModal(false);
            })
            .catch((error) => console.error(error));
    };

    function ViewChat() {
        setViewChat(true);
        setTimeout(() => {
            if (containerRef && containerRef.current) {
                containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
        }, 500);
    }

    return (
        <div className="grid grid-cols-12 min-h-[calc(100vh-120px)] max-h-[calc(100vh-120px)]  rounded-xl">
            <div className="col-span-3 bg-white relative">
                <div className="text-dark shadow dark:shadow-2xl w-full h-20 bg-white absolute top-0 p-6 left-0 right-0 z-10 border-r-2 border-white dark:bg-slate-700 dark:text-light">
                    <h1 className="px-4 pb-2 text-h5 font-medium">LIST CHAT</h1>
                </div>
                <div className="pt-24 overflow-y-scroll scroll-mx-2 min-h-[calc(100vh-120px)] max-h-[calc(100vh-120px)] dark:bg-slate-800 px-2">
                    <div className="flex justify-end mb-5">
                        <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary w-full col-span-3 p-2.5 dark:bg-light dark:border-dark dark:placeholder-dark dark:text-dark dark:focus:ring-primary dark:focus:border-primary" onChange={(e) => {
                            setDepartmentID(parseInt(e.target.value));
                        }}>
                            {dataChatDepartment &&
                                dataChatDepartment.map((data: ChatDepartementType, key: number) => (
                                    <option className="w-full" value={data.id} key={key}>
                                        {data.department}
                                    </option>
                                ))}
                        </select>
                        <Button theme="primary" className="mx-2"><FontAwesomeIcon icon={faPlus} /></Button>
                        <Button disabled theme="danger" className=""><FontAwesomeIcon icon={faTrash} /></Button>
                    </div>
                    {
                        departmentID !== null && groupedData[departmentID] &&
                        Object.keys(groupedData[departmentID])
                            .sort((a, b) => roomTimestamps[`${departmentID}-${b}`] - roomTimestamps[`${departmentID}-${a}`])
                            .map(roomNo => (
                                <>
                                    <hr className="h-[1px] bg-semimuted mt-1" />
                                    <ContactChat key={roomNo + 100} name={"Room " + roomNo} chat="" onClick={() => {
                                        setRoomID(roomNo);
                                        ViewChat();
                                    }} />
                                </>
                            ))
                    }
                </div>
            </div>

            <div className="col-span-9 bg-white relative dark:bg-slate-800 dark:text-light">
                <div className="w-full h-20 bg-white absolute top-0 p-6 left-0 right-0 z-10 flex items-center dark:bg-slate-700 dark:text-light shadow dark:shadow-2xl cursor-pointer">
                    {viewChat && (
                        <>
                            <Image priority src={imageHotel1} alt={`Image`} className="mr-2 w-12 object-cover rounded-full" />
                            <div className="pl-2">
                                <p>Room {roomID}</p>
                                <span className="text-sm text-muted">Klik disini untuk melihat contact</span>
                            </div>
                        </>
                    )}
                </div>

                {viewChat && (
                    <>
                        <div className="absolute bottom-0 p-6 left-0 right-0 overflow-y-scroll min-h-[calc(100vh-120px)] max-h-[calc(100vh-120px)] transition-all duration-500" ref={containerRef}>
                            <div className="flex flex-col my-16">
                                {groupedData[departmentID] && groupedData[departmentID][roomID] && groupedData[departmentID][roomID].map((message: ChatType, index: number) => (
                                    <MessageChat
                                        key={`${message.id}-${index}`}
                                        name={message.guestName}
                                        sender={message.guestName ? false : true}
                                        text={message.message}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="w-full h-20 bg-white absolute bottom-0 p-6 left-0 right-0 z-10 flex items-center dark:bg-slate-700 dark:text-light shadow dark:shadow-2xl">
                            <div className="flex w-full">
                                <InputBox type={"text"} className="max-w-[calc(100%-40px)] mx-auto block" onChange={(e: EventTargetType) => setMessageChat(e.target.value)} value={messageChat} placeholder="Text message On Here" />
                                <button className="w-10" onClick={handleSendMessage}>
                                    <FontAwesomeIcon icon={faPaperPlane} className="w-10" />
                                </button>
                            </div>
                        </div>
                    </>
                )}

            </div>

            <Modal title="Insert Property" show={modal} onClosed={() => setModal(modal ? false : true)} onSave={handleSubmit}>
                <InputGroup
                    theme="horizontal"
                    label={"Department Name"}
                    type={"text"}
                    value={department}
                    onChange={(e) => {
                        setDepartment(e.target.value);
                    }}
                />
                <InputGroup
                    theme="horizontal"
                    label={"Icon"}
                    type={"text"}
                    value={icon}
                    onChange={(e) => {
                        setIcon(e.target.value);
                    }}
                />
            </Modal>
        </div>
    );
}
