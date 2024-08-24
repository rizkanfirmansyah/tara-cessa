"use client";

import { MetaContext } from "@/app/MetaProvider";
import { Button, ButtonActions, Card, Dropdown, EventRow, InputGroup, Modal } from "@/components";
import { useEventStore } from "@/components/store/eventStore";
import { useHotelStore } from "@/components/store/hotelStore";
import fetchCustom from "@/helpers/FetchCustom";
import setFormValue from "@/helpers/FormInputCustom/setform";
import { userSession } from "@/helpers/UserData";
import { EventCategoryType, EventType } from "@/types";
import { faEdit, faPlus, faRepeat, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function EventPage() {
    const { updateTitle } = useContext(MetaContext);
    const [Category, setCategory] = useState(0);
    const [search, setSearch] = useState("");
    const [modal, setModal] = useState(false);
    const [update, setUpdate] = useState(false);
    const [addCategory, setAddCategory] = useState(false);
    const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [dataEvent, setdataEvent] = useState<EventType[] | []>([]);
    const [eventID, setEventID] = useState(0);
    const [eventCategoryID, setEventCategoryID] = useState(0);
    const hotelID = useHotelStore((state) => state.hotelID);
    const datas = useEventStore((state) => state.data);
    const dataEventCategory = useEventStore((state) => state.dataCategory);
    const updateEvent = useEventStore((state) => state.updateData);
    const updateEventCategory = useEventStore((state) => state.updateDataCategory);
    let user = userSession;
    let bearerToken = user?.token ?? "";

    useEffect(() => {
        updateTitle("Event Page");
        return () => {
            updateTitle("Dashboard");
        };
    }, [updateTitle]);

    useEffect(() => {
        getDataEvent();
        getDataEventCategory();
    }, []);

    function searchEvent(searchCriteria: string) {
        if (datas) {
            const res: EventType[] = datas.filter(event =>
                (searchCriteria ? event.name.toLowerCase().includes(searchCriteria.toLowerCase()) : true)
            );
            setdataEvent(res);
        }
    }

    const getDataEventCategory = () => {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/event_categories`, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error("Error fteching");
                } else {
                    updateEventCategory(result.data.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const getDataEvent = () => {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/events`, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error("Error fteching");
                } else {
                    updateEvent(result.data.data);
                    setdataEvent(result.data.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const image = formData.get("image") as Blob;
        const category = parseInt(formData.get("category") as string);

        const jsonData = JSON.stringify({ name, description });

        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/events/${eventID > 0 ? eventID : category}`;
        if (eventID > 0) {
            url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/events/${category}/${eventID > 0 ? eventID : category}`;
        }

        const formdata = new FormData();
        formdata.append("data", jsonData);
        formdata.append("image", image);

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);

        const requestOptions = {
            method: eventID > 0 ? "PUT" : "POST",
            headers: myHeaders,
            body: formdata,
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
                getDataEvent();
                setModal(false);
                setEventID(0);
            })
            .catch((error) => console.error(error));
    };

    const handleUpdateEvent = (event: EventType) => {
        setUpdate(true);
        setEventID(event.id);
        setFormValue("name", event.name);
        setFormValue("description", event.description);
    };

    const handleDeleteEvent = async (id: number, category: number) => {
        const url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/events/${category}/${id}`;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
        };

        if (result.isConfirmed) {
            // Handle confirmed action here
            fetch(url, requestOptions)
                .then((response) => {
                    getDataEvent();
                })
                .then((result) => {
                    Swal.fire("Deleted!", "Your item has been deleted.", "success");
                })
                .catch((error) => console.error(error));
        } else {
            Swal.fire("Cancelled", "Your item is safe :)", "info");
        }
    };

    const handleSubmitCategory = async () => {
        const jsonData = JSON.stringify({
            name: newCategory,
        });

        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/event_categories`;
        if (eventCategoryID && eventCategoryID > 0) {
            url += "/" + eventCategoryID;
        }

        const formdata = new FormData();
        formdata.append("data", jsonData);
        formdata.append("image", newCategoryImage ?? "");
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);

        const requestOptions = {
            method: eventCategoryID > 0 ? "PUT" : "POST",
            headers: myHeaders,
            body: formdata,
        };

        setIsLoading(true);
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, save it!",
        });

        if (result.isConfirmed) {
            fetch(url, requestOptions)
                .then(async (response) => {
                    const data = await response.json();
                    return data;
                })
                .then((result) => {
                    if (result.response_code > 0) {
                        throw new Error("500 Server Error");
                    }
                    getDataEventCategory();
                    setAddCategory(false);
                })
                .catch((error) => console.error(error))
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            Swal.fire("Cancelled", "Your item is safe :)", "info");
        }
    };

    const handleDeleteCategory = async () => {
        if (eventCategoryID === 0) {
            Swal.fire("Warning!", "Please select a category to delete", "info");
            return;
        }

        const url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/event_categories/${eventCategoryID}`;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
        };

        if (result.isConfirmed) {
            // Handle confirmed action here
            fetch(url, requestOptions)
                .then((response) => {
                    getDataEventCategory();
                })
                .then((result) => {
                    Swal.fire("Deleted!", "Your item has been deleted.", "success");
                })
                .catch((error) => console.error(error));
        } else {
            Swal.fire("Cancelled", "Your item is safe :)", "info");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewCategoryImage(file);
        }
    };

    return (
        <div className="grid gap-6">
            <Card className="col-span-2">
                <div className="flex justify-between items-center">
                    <h1 className="text-h5 font-semibold">List Event</h1>
                    <Dropdown
                        title={
                            Category > 0
                                ? (dataEventCategory &&
                                    dataEventCategory
                                        .filter((category: EventCategoryType) => category.id === Category)
                                        .map((filteredCategory: EventCategoryType) => filteredCategory.name)
                                        .join(", ")) ||
                                "No Category Found"
                                : "Select Category"
                        }
                    >
                        <a
                            href="#"
                            className="dark:hover:text-dark hover:bg-light block px-6 py-2 text-sm"
                            role="menuitem"
                            onClick={() => {
                                setCategory(0);
                            }}
                            id="menu-item-0"
                        >
                            All
                        </a>
                        {dataEventCategory &&
                            dataEventCategory.map((category: EventCategoryType, index: number) => (
                                <a
                                    href="#"
                                    key={index + 100}
                                    className="dark:hover:text-dark hover:bg-light block px-6 py-2 text-sm"
                                    role="menuitem"
                                    onClick={() => {
                                        setCategory(category.id);
                                    }}
                                    id="menu-item-1"
                                >
                                    {category.name}
                                </a>
                            ))}
                    </Dropdown>
                </div>
                <ButtonActions onSearch={(e) => searchEvent(e.target.value)} valueSearch={search} onClickAdd={() => setModal(modal ? false : true)} onClickRepeat={() => getDataEvent()} />
                <table className="w-full mt-5">
                    <thead>
                        <tr className="text-start border-b-[1px] text-muted dark:text-light border-light">
                            <td className="py-3 text-start font-medium">No.</td>
                            <td className="py-3 text-start font-medium">Event Name</td>
                            <td className="py-3 text-start font-medium">Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {dataEvent &&
                            dataEvent.map((event: EventType, index: number) => (
                                <EventRow
                                    key={event.id}
                                    index={index + 1}
                                    event={event}
                                    onDelete={() => handleDeleteEvent(event.id, event.categoryId)}
                                    onEdit={() => {
                                        handleUpdateEvent(event);
                                        setModal(true);
                                    }}
                                />
                            ))}
                    </tbody>
                </table>
            </Card>

            <Modal
                title={update ? "Update Event" : "Insert Event"}
                show={modal}
                onClosed={() => {
                    setModal(modal ? false : true);
                    setUpdate(false);
                    setEventCategoryID(0);
                }}
                onSave={(event: FormEvent<HTMLFormElement>) => handleSubmit(event)}
            >
                <div className="grid grid-cols-12 gap-2">
                    <InputGroup
                        theme="horizontal"
                        options={
                            dataEventCategory &&
                            dataEventCategory.map((item) => ({
                                value: item.id,
                                name: item.name,
                            }))
                        }
                        placeholder="Choice Category"
                        label={"Category"}
                        type={"select"}
                        name="category"
                        className="col-span-10"
                        onChange={(event) => {
                            const value = parseInt(event.target.value);
                            setEventCategoryID(value);
                        }}
                    />
                    <div className="col-span-2">
                        {addCategory ? (
                            <Button theme="danger" onClick={() => setAddCategory(false)}>
                                <FontAwesomeIcon icon={faRepeat} />
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button size="sm" className="px-1.5" onClick={() => setAddCategory(true)}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </Button>
                                <Button size="sm" theme={Category ? "warning" : "secondary"} className={`px-1.5 ${Category ? "" : "cursor-default"}`} onClick={() => setAddCategory(true)}>
                                    <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button size="sm" theme={Category ? "danger" : "secondary"} className={`px-1.5 ${Category ? "" : "cursor-default"}`} onClick={() => handleDeleteCategory()}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                {addCategory && (
                    <div className="grid grid-cols-12 gap-2">
                        <InputGroup
                            theme="horizontal"
                            label={"New Category"}
                            type={"text"}
                            value={newCategory}
                            className="col-span-11"
                            onChange={(e) => {
                                setNewCategory(e.target.value);
                            }}
                        />
                        <InputGroup theme="horizontal" label={"New Category Image"} type={"file"} className="col-span-11" onChange={(e) => handleImageChange(e)} />
                        <div className="col-span-1 mt-1">
                            <Button theme="success" onClick={() => handleSubmitCategory()}>
                                <FontAwesomeIcon icon={faSave} />
                            </Button>
                        </div>
                    </div>
                )}
                <InputGroup
                    theme="horizontal"
                    label={"Event Name"}
                    type={"text"}
                    name="name"
                />
                <InputGroup
                    theme="horizontal"
                    label={"Description"}
                    type={"text"}
                    name="description"
                />
                <InputGroup
                    theme="horizontal"
                    label={"Image"}
                    type={"file"}
                    name="image"
                />
            </Modal>
        </div>
    );
}
