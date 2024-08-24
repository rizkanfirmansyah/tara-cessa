"use client";

import { MetaContext } from "@/app/MetaProvider";
import { Button, ButtonActions, Card, Dropdown, FacilityRow, InputGroup, Modal } from "@/components";
import { useFacilityStore } from "@/components/store/facilityStore";
import { useHotelStore } from "@/components/store/hotelStore";
import fetchCustom from "@/helpers/FetchCustom";
import setFormValue from "@/helpers/FormInputCustom/setform";
import { userSession } from "@/helpers/UserData";
import { FacilityCategoryType, FacilityType, OptionType } from "@/types";
import { faEdit, faPlus, faRepeat, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function FacilitiesPage() {
    const { updateTitle } = useContext(MetaContext);
    const [Category, setCategory] = useState(0);
    const [search, setSearch] = useState("");
    const [modal, setModal] = useState(false);
    const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [update, setUpdate] = useState(false);
    const [facilityID, setFacilityID] = useState(0);
    const [facilityCategoryID, setFacilityCategoryID] = useState(0);
    const [addCategory, setAddCategory] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [dataFacility, setDataFacility] = useState<FacilityType[] | []>([]);
    const datas = useFacilityStore((state) => state.data);
    const hotelID = useHotelStore((state) => state.hotelID);
    const updateData = useFacilityStore((state) => state.updateData);
    const dataFacilityCategory = useFacilityStore((state) => state.dataCategory);
    let user = userSession;
    let bearerToken = user?.token ?? "";
    const updateDataCategory = useFacilityStore((state) => state.updateDataCategory);

    useEffect(() => {
        updateTitle("Ameneties Page");
        return () => {
            updateTitle("Dashboard");
        };
    }, [updateTitle]);

    useEffect(() => {
        if (datas) {
            setDataFacility(datas)
        }
        getDataFacility();
        getDataFacilityCategory();
    }, []);

    function searchFacility(searchCriteria: string) {
        if (datas) {
            const res: FacilityType[] = datas.filter(amenety =>
                (searchCriteria ? amenety.name.toLowerCase().includes(searchCriteria.toLowerCase()) : true)
            );
            setDataFacility(res);
        }
    }


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e && e.preventDefault();

        const formData = new FormData(e && e.currentTarget);
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const price = parseInt(formData.get("price") as string);
        const category = parseInt(formData.get("category") as string);

        const image = formData.get("image") as Blob;

        const jsonData = JSON.stringify({
            name,
            description,
            price,
        });

        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/24/facilities/${category}`;
        if (facilityID && facilityID > 0) {
            url += "/" + facilityID;
        }
        const formdata = new FormData();
        formdata.append("data", jsonData);
        formdata.append("image", image);
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);

        const requestOptions = {
            method: facilityID > 0 ? "PUT" : "POST",
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
                getDataFacility();
                setModal(false);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                setIsLoading(false);
            });
    };

    const getDataFacility = () => {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/facilities`, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error("Error fteching");
                } else {
                    updateData(result.data.data);
                    setDataFacility(result.data.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const getDataFacilityCategory = () => {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/facility_categories`, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error("Error fteching");
                } else {
                    updateDataCategory(result.data.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const deleteDataFacility = async (id: number, category: number) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        const url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/facilities/${category}/${id}`;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
        };
        if (result.isConfirmed) {
            // Handle confirmed action here
            fetch(url, requestOptions)
                .then((response) => {
                    getDataFacility();
                })
                .then((result) => console.log(result))
                .catch((error) => console.error(error));
        } else {
            Swal.fire("Cancelled", "Your item is safe :)", "info");
        }
    };

    const onEditFacility = (facility: FacilityType) => {
        setUpdate(true);
        setFacilityID(facility.id);
        setFormValue("name", facility.name);
        setFormValue("price", facility.price);
        setCategory(facility.categoryId);
        setFormValue("description", facility.description);
    };

    useEffect(() => {
        updateTitle("Facilities Page");
        return () => {
            updateTitle("Dashboard");
        };
    }, [updateTitle]);

    const handleSubmitCategory = async () => {
        const jsonData = JSON.stringify({
            name: newCategory,
        });

        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/facility_categories`;
        if (facilityCategoryID && facilityCategoryID > 0) {
            url += "/" + facilityCategoryID;
        }

        const formdata = new FormData();
        formdata.append("data", jsonData);
        formdata.append("image", newCategoryImage ?? "");
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);

        const requestOptions = {
            method: facilityCategoryID > 0 ? "PUT" : "POST",
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
                    getDataFacilityCategory();
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewCategoryImage(file);
        }
    };

    const handleDeleteCategory = async () => {
        if (facilityCategoryID === 0) {
            Swal.fire("Warning!", "Please select a category to delete", "info");
            return;
        }

        const url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/facility_categories/${facilityCategoryID}`;
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
                    getDataFacilityCategory();
                })
                .then((result) => {
                    Swal.fire("Deleted!", "Your item has been deleted.", "success");
                })
                .catch((error) => console.error(error));
        } else {
            Swal.fire("Cancelled", "Your item is safe :)", "info");
        }
    };
    return (
        <div className="grid gap-6">
            <Card className="col-span-2">
                <div className="flex justify-between items-center">
                    <h1 className="text-h5 font-semibold">List Facilities</h1>
                    <Dropdown
                        title={
                            Category > 0
                                ? (dataFacilityCategory &&
                                    dataFacilityCategory
                                        .filter((category: FacilityCategoryType) => category.id === Category)
                                        .map((filteredCategory: FacilityCategoryType) => filteredCategory.name)
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
                            All{" "}
                        </a>
                        {dataFacilityCategory &&
                            dataFacilityCategory.map((facility: FacilityCategoryType, index: number) => (
                                <a
                                    href="#"
                                    key={facility.id + 100}
                                    className="dark:hover:text-dark hover:bg-light block px-6 py-2 text-sm"
                                    role="menuitem"
                                    onClick={() => {
                                        setCategory(facility.id);
                                    }}
                                    id="menu-item-1"
                                >
                                    {facility.name}
                                </a>
                            ))}
                    </Dropdown>
                </div>
                <ButtonActions onSearch={(e) => searchFacility(e.target.value)} valueSearch={search} onClickAdd={() => setModal(modal ? false : true)} onClickRepeat={() => getDataFacility()} />
                <table className="w-full mt-5">
                    <thead>
                        <tr className="text-start border-b-[1px] text-muted dark:text-light border-light">
                            <td className="py-3 text-start font-medium">No.</td>
                            <td className="py-3 text-start font-medium">Facility Name</td>
                            <td className="py-3 text-start font-medium">Price</td>
                            <td className="py-3 text-start font-medium">Description</td>
                            <td className="py-3 text-start font-medium">Category</td>
                            <td className="py-3 text-start font-medium">Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {dataFacility &&
                            dataFacility.map((facility: FacilityType, index: number) => (
                                <FacilityRow
                                    key={facility.id}
                                    index={index + 1}
                                    facility={facility}
                                    onEdit={() => {
                                        onEditFacility(facility);
                                        setModal(true);
                                    }}
                                    onDelete={() => deleteDataFacility(facility.id, facility.categoryId)}
                                />
                            ))}
                    </tbody>
                </table>
            </Card>

            <Modal
                title={update ? "Update Facilities" : "Insert Facilities"}
                show={modal}
                onSave={handleSubmit}
                onClosed={() => {
                    setModal(modal ? false : true);
                    setUpdate(false);
                    setFacilityCategoryID(0);
                    setFacilityID(0);
                }}
                isLoading={isLoading}
            >
                <div className="grid grid-cols-12 gap-2">
                    <InputGroup
                        theme="horizontal"
                        options={
                            dataFacilityCategory &&
                            dataFacilityCategory.map((item) => ({
                                value: item.id,
                                name: item.name,
                            }))
                        }
                        placeholder="Choice Category"
                        label={"Category"}
                        type={"select"}
                        className="col-span-10"
                        name="category"
                        onChange={(event) => {
                            const value = parseInt(event.target.value);
                            setFacilityCategoryID(value);
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
                <InputGroup theme="horizontal" label={"Facility Name"} type={"text"} name="name" />
                <InputGroup theme="horizontal" label={"Description"} type={"text"} name="description" />
                <InputGroup theme="horizontal" label={"Price"} type={"number"} name="price" />
                <InputGroup theme="horizontal" label={"Image"} type={"file"} name="image" />
            </Modal>
        </div>
    );
}
