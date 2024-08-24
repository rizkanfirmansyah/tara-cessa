"use client";
import { MetaContext } from "@/app/MetaProvider";
import { AmenetiesRow, Button, ButtonActions, Card, Dropdown, InputGroup, Modal } from "@/components";
import { useAmenetyStore } from "@/components/store/amenetyStore";
import { useHotelStore } from "@/components/store/hotelStore";
import fetchCustom from "@/helpers/FetchCustom";
import setFormEmpty from "@/helpers/FormInputCustom/empty";
import setFormValue from "@/helpers/FormInputCustom/setform";
import { userSession } from "@/helpers/UserData";
import { AmenityCategoryType, AmenityType } from "@/types";
import { AmenityItemType } from "@/types/GuestOrder";
import { faEdit, faRepeat, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function AmenetiesPage() {
    const { updateTitle } = useContext(MetaContext);
    const [modalAmeneties, setModalAmeneties] = useState(false);
    const [search, setSearch] = useState("");
    const [amenetyID, setAmenetyID] = useState(0);
    const [addCategory, setAddCategory] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [availability, setAvailability] = useState(false);
    const [dataAmenety, setdataAmenety] = useState<AmenityType[] | []>([]);
    const [Category, setCategory] = useState(0);
    const [update, setUpdate] = useState(false);
    const [IsLoading, setIsLoading] = useState(false);
    const [amenetyCategoryID, setAmenetyCategoryID] = useState(0);
    const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
    const datas = useAmenetyStore((state) => state.data);
    const hotelID = useHotelStore((state) => state.hotelID);
    const updateData = useAmenetyStore((state) => state.updateData);
    const dataAmenetyCategory = useAmenetyStore((state) => state.dataCategory);
    let user = userSession;
    let bearerToken = user?.token ?? "";
    const updateDataCategory = useAmenetyStore((state) => state.updateDataCategory);

    useEffect(() => {
        updateTitle("Amenities Page");
        return () => {
            updateTitle("Dashboard");
        };
    }, [updateTitle]);

    useEffect(() => {
        if (datas) {
            setdataAmenety(datas)
        }
        getDataAmenety();
        getDataAmenetyCategory();
    }, []);

    function searchAmeneties(searchCriteria: string) {
        if (datas) {
            const res: AmenityType[] = datas.filter(amenety =>
                (searchCriteria ? amenety.name.toLowerCase().includes(searchCriteria.toLowerCase()) : true)
            );
            setdataAmenety(res);
        }
    }

    const getDataAmenety = () => {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/amenities`, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error("Error fteching");
                } else {
                    updateData(result.data.data);
                    setdataAmenety(result.data.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const getDataAmenetyCategory = () => {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/amenity_categories`, bearerToken)
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

    // http://9.9.9.2:8000/hotels/24/amenities/165/8
    const deleteDataAmenety = async (id: number, category: number) => {
        const url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/amenities/${category}/${id}`;
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
                    getDataAmenety();
                })
                .then((result) => {
                    Swal.fire("Deleted!", "Your item has been deleted.", "success");
                })
                .catch((error) => console.error(error));
        } else {
            Swal.fire("Cancelled", "Your item is safe :)", "info");
        }
    };

    const onEditAmenety = (amenety: AmenityType) => {
        setFormEmpty();
        setUpdate(true);
        setAmenetyID(amenety.id);
        setFormValue("name", amenety.name);
        setFormValue("price", amenety.price);
        setFormValue("stock", amenety.stock);
        setFormValue("category", amenety.categoryId, "select");
        setAvailability(amenety.availability);
        setFormValue("description", amenety.description);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const stock = parseInt(formData.get("stock") as string);
        const price = parseInt(formData.get("price") as string);
        const category = parseInt(formData.get("category") as string);

        const image = formData.get("image") as Blob;

        const jsonData = JSON.stringify({
            name,
            description,
            stock,
            price,
            availability,
        });

        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/24/amenities/${category}`;
        if (amenetyID && amenetyID > 0) {
            url += "/" + amenetyID;
        }
        const formdata = new FormData();
        // const image = formdata.get("image") as Blob;
        formdata.append("data", jsonData);
        formdata.append("image", image);
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);

        const requestOptions = {
            method: amenetyID > 0 ? "PUT" : "POST",
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
                getDataAmenety();
                setModalAmeneties(false);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewCategoryImage(file);
        }
    };

    const handleSubmitCategory = async () => {
        const jsonData = JSON.stringify({
            name: newCategory,
        });

        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/amenity_categories`;
        if (amenetyCategoryID && amenetyCategoryID > 0) {
            url += "/" + amenetyCategoryID;
        }

        const formdata = new FormData();
        formdata.append("data", jsonData);
        formdata.append("image", newCategoryImage ?? "");
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);

        const requestOptions = {
            method: amenetyCategoryID > 0 ? "PUT" : "POST",
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
                    getDataAmenetyCategory();
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
        if (amenetyCategoryID === 0) {
            Swal.fire("Warning!", "Please select a category to delete", "info");
            return;
        }

        const url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/amenity_categories/${amenetyCategoryID}`;
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
                    getDataAmenetyCategory();
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
        <div className="grid grid-cols gap-6">
            <Card className="col-span-2">
                <div className="flex justify-between items-center">
                    <h1 className="text-h5 font-semibold">List Amenities</h1>
                    <Dropdown
                        title={
                            Category > 0
                                ? (dataAmenetyCategory &&
                                    dataAmenetyCategory
                                        .filter((category: AmenityCategoryType) => category.id === Category)
                                        .map((filteredCategory: AmenityCategoryType) => filteredCategory.name)
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
                        {dataAmenetyCategory &&
                            dataAmenetyCategory.map((category: AmenityCategoryType, index: number) => (
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
                <ButtonActions
                    onSearch={(e) => searchAmeneties(e.target.value)}
                    valueSearch={search}
                    onClickRepeat={() => getDataAmenety()}
                    onClickAdd={() => {
                        setModalAmeneties(modalAmeneties ? false : true);
                        setFormEmpty();
                    }}
                />
                <table className="w-full mt-5">
                    <thead>
                        <tr className="text-start border-b-[1px] text-muted dark:text-light border-light">
                            <td className="py-3 text-start font-medium">No.</td>
                            <td className="py-3 text-start font-medium">Amenities Name</td>
                            <td className="py-3 text-start font-medium">Price</td>
                            <td className="py-3 text-start font-medium">Stock</td>
                            <td className="py-3 text-start font-medium">Category</td>
                            <td className="py-3 text-start font-medium">Availability</td>
                            <td className="py-3 text-start font-medium">Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {dataAmenety &&
                            dataAmenety.map((amenety: AmenityType, index: number) => (
                                <AmenetiesRow
                                    key={amenety.id}
                                    index={index + 1}
                                    amenety={amenety}
                                    onDelete={() => {
                                        deleteDataAmenety(amenety.id, amenety.categoryId);
                                    }}
                                    onEdit={() => {
                                        onEditAmenety(amenety);
                                        setModalAmeneties(true);
                                    }}
                                />
                            ))}
                    </tbody>
                </table>
            </Card>

            <Modal
                title={update ? "Update Amenities" : "Insert Amenities"}
                show={modalAmeneties}
                onSave={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}
                onClosed={() => {
                    setModalAmeneties(modalAmeneties ? false : true);
                    setUpdate(false);
                    setAmenetyCategoryID(0);
                    setAmenetyID(0);
                }}
                isLoading={IsLoading}
            >
                <div className="grid grid-cols-12 gap-2">
                    <InputGroup
                        theme="horizontal"
                        options={
                            dataAmenetyCategory &&
                            dataAmenetyCategory.map((item) => ({
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
                            setAmenetyCategoryID(value);
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
                <InputGroup theme="horizontal" label={"Amenities Name"} type={"text"} name="name" />
                <InputGroup theme="horizontal" label={"Price"} type={"number"} name="price" />
                <InputGroup theme="horizontal" label={"Stock"} type={"number"} name="stock" />
                <InputGroup theme="horizontal" label={"Description"} type={"text"} name="description" />
                <InputGroup theme="horizontal" label={"Image"} type={"file"} name="image" />
                <InputGroup
                    theme="horizontal"
                    label={"Availability"}
                    type={"switch"}
                    checked={availability}
                    name="availability"
                    onChange={() => {
                        setAvailability(availability ? false : true);
                        console.log("CLICKED");
                    }}
                />
            </Modal>
        </div>
    );
}
