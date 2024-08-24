"use client";
import { MetaContext } from "@/app/MetaProvider";
import { Button, ButtonActions, Card, Dropdown, FoodRow, InputGroup, Modal } from "@/components";
import { useFoodStore } from "@/components/store/foodStore";
import { useHotelStore } from "@/components/store/hotelStore";
import fetchCustom from "@/helpers/FetchCustom";
import setFormEmpty from "@/helpers/FormInputCustom/empty";
import setFormValue from "@/helpers/FormInputCustom/setform";
import { userSession } from "@/helpers/UserData";
import { FoodType } from "@/types";
import { FoodAdditionalType, FoodCategoryType } from "@/types/FoodType";
import { faEdit, faPlus, faRepeat, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function InRoomDiningPage() {
    const { updateTitle } = useContext(MetaContext);
    const [modalFood, setModalFood] = useState(false);
    const [foodID, setFoodID] = useState(0);
    const [foodCategoryID, setFoodCategoryID] = useState(0);
    const [additionalID, setAdditionalID] = useState(0);
    const [search, setSearch] = useState("");
    const [Category, setCategory] = useState(0);
    const [favorite, setFavorite] = useState(false);
    const [availability, setAvailability] = useState(false);
    const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
    const [IsLoading, setIsLoading] = useState(false);
    const [update, setUpdate] = useState(false);
    const [addCategory, setAddCategory] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [additional, setAdditional] = useState("");
    const [additionalPrice, setAdditionalPrice] = useState(0);
    const [dataFoods, setDataFood] = useState<FoodType[] | []>([]);
    const hotelID = useHotelStore((state) => state.hotelID);
    const datas = useFoodStore((state) => state.data);
    const dataFoodsCategory = useFoodStore((state) => state.dataCategory);
    const updateData = useFoodStore((state) => state.updateData);
    const updateDataCategory = useFoodStore((state) => state.updateDataCategory);
    const additionalData = useFoodStore((state) => state.additionalData);
    const updateAdditionalData = useFoodStore((state) => state.updateAdditionalData);
    let user = userSession;
    let bearerToken = user?.token ?? "";

    useEffect(() => {
        updateTitle("In Room Dining Page");
        if (datas) {
            setDataFood(datas)
        }
        return () => {
            updateTitle("Dashboard");
        };
    }, [updateTitle]);

    useEffect(() => {
        if (modalFood) {
            getAdditionalData();
        }
    }, [modalFood]);

    useEffect(() => {
        getDataFoods();
        getDataFoodsCategory();
    }, []);

    function searchFood(searchCriteria: string) {
        if (datas) {
            const res: FoodType[] = datas.filter(amenety =>
                (searchCriteria ? amenety.name.toLowerCase().includes(searchCriteria.toLowerCase()) : true)
            );
            setDataFood(res);
        }
    }

    const getDataFoodsCategory = () => {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/food_categories`, bearerToken)
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

    const getDataFoods = () => {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/foods`, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error("Error fteching");
                } else {
                    updateData(result.data.data);
                    setDataFood(result.data.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const getAdditionalData = () => {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/${foodID}/foodAdd`, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error("Error fteching");
                } else {
                    updateAdditionalData(result.data.data);
                    console.log(result.data.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const handleDeleteFood = async (id: number, category: number) => {
        const url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/foods/${category}/${id}`;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
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
                    getDataFoods();
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

    const handleEditFoods = (food: FoodType) => {
        setUpdate(true);
        setFoodID(food.id);
        setFormValue("name", food.name);
        setFormValue("price", food.price);
        setFormValue("stock", food.stock);
        setAvailability(food.availability);
        setFavorite(food.favorite === 1);
        setCategory(food.categoryId);
        setFormValue("description", food.description);
    };

    function clearForm() {
        setFormEmpty();
        setFoodID(0);
        setUpdate(false);
    }

    const handleInsertFood = async (event: FormEvent<HTMLFormElement>) => {
        event && event.preventDefault();

        const formData = new FormData(event && event.currentTarget);
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
            favorite: favorite ? 1 : 0,
            availability,
        });

        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/foods/${category}`;
        if (foodID && foodID > 0) {
            url += "/" + foodID;
        }

        const formdata = new FormData();
        formdata.append("data", jsonData);
        formdata.append("image", image);

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${bearerToken}`);

        const requestOptions = {
            method: foodID > 0 ? "PUT" : "POST",
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
                getDataFoods();
                setModalFood(false);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleInsertAdditional = () => {
        const additionalData = JSON.stringify({
            foodID: foodID,
            name: additional,
            price: additionalPrice,
        });

        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/${foodID}/foodAdd`;
        if (additionalID && additionalID > 0) {
            url += "/" + additionalID;
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${bearerToken}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: additionalID > 0 ? "PUT" : "POST",
            headers: myHeaders,
            body: additionalData,
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
                getAdditionalData();
            })
            .catch((error) => console.error(error));

        setAdditionalID(0);
        setAdditional("");
        setAdditionalPrice(0);
    };

    const handleEditAdditional = (value: FoodAdditionalType) => {
        setAdditionalID(value.id);
        setAdditional(value.name);
        setAdditionalPrice(value.price);
    };

    const handleDeleteAdditional = async (id: number) => {
        const url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/${foodID}/foodAdd/${id}`;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
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
                    getAdditionalData();
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

    const handleSubmitCategory = async () => {
        const jsonData = JSON.stringify({
            name: newCategory,
        });

        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/food_categories`;
        if (foodCategoryID && foodCategoryID > 0) {
            url += "/" + foodCategoryID;
        }

        const formdata = new FormData();
        formdata.append("data", jsonData);
        formdata.append("image", newCategoryImage ?? "");
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);

        const requestOptions = {
            method: foodCategoryID > 0 ? "PUT" : "POST",
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
                    getDataFoodsCategory();
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
        if (foodCategoryID === 0) {
            Swal.fire("Warning!", "Please select a category to delete", "info");
            return;
        }

        const url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/food_categories/${foodCategoryID}`;
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
            fetch(url, requestOptions)
                .then((response) => {
                    getDataFoodsCategory();
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
                    <h1 className="text-h5 font-semibold">List Food</h1>
                    {/* <Dropdown
                        title={
                            Category > 0
                                ? (dataFoodsCategory &&
                                    dataFoodsCategory
                                        .filter((category: FoodCategoryType) => category.id === Category)
                                        .map((filteredCategory: FoodCategoryType) => filteredCategory.name)
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
                        {dataFoodsCategory &&
                            dataFoodsCategory.map((category: FoodCategoryType, index: number) => (
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
                    </Dropdown> */}
                </div>
                <ButtonActions onSearch={(e) => searchFood(e.target.value)} valueSearch={search} onClickAdd={() => {
                    clearForm()
                    setModalFood(modalFood ? false : true)
                }} onClickRepeat={() => getDataFoods()} />
                <table className="w-full mt-5">
                    <thead>
                        <tr className="text-start border-b-[1px] text-muted dark:text-light border-light">
                            <td className="py-3 text-start font-medium">No.</td>
                            <td className="py-3 text-start font-medium">Food Name</td>
                            <td className="py-3 text-start font-medium">Price</td>
                            <td className="py-3 text-start font-medium">Stock</td>
                            <td className="py-3 text-start font-medium">Availability</td>
                            <td className="py-3 text-start font-medium">Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {dataFoods &&
                            dataFoods.map((food: FoodType, index: number) => (
                                <FoodRow
                                    key={food.id}
                                    index={index + 1}
                                    food={food}
                                    onDelete={() => {
                                        handleDeleteFood(food.id, food.categoryId);
                                    }}
                                    onEdit={() => {
                                        handleEditFoods(food);
                                        setModalFood(true);
                                    }}
                                />
                            ))}
                    </tbody>
                </table>
            </Card>

            <Modal
                title={update ? "Update Food" : "Insert Food"}
                show={modalFood}
                onClosed={() => {
                    setModalFood(modalFood ? false : true);
                    setUpdate(false);
                    setFoodCategoryID(0);
                    setFoodID(0);
                }}
                onSave={(event: FormEvent<HTMLFormElement>) => handleInsertFood(event)}
                isLoading={IsLoading}
            >
                <div className="grid grid-cols-12 gap-2">
                    <InputGroup
                        theme="horizontal"
                        options={
                            dataFoodsCategory &&
                            dataFoodsCategory.map((item) => ({
                                value: item.id,
                                name: item.name,
                            }))
                        }
                        placeholder="Choice Category"
                        label={"Category"}
                        type={"select"}
                        name="category"
                        className="col-span-10"
                        onChangeSelect={(event) => {
                            const value = parseInt(event.target.value);
                            const selectedOptionText = event.target.selectedOptions[0].text;
                            setFoodCategoryID(value);
                            setNewCategory(selectedOptionText);
                        }}
                    />
                    <div className="col-span-2">
                        {addCategory ? (
                            <Button theme="danger" onClick={() => setAddCategory(false)}>
                                <FontAwesomeIcon icon={faRepeat} />
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button size="sm" className="px-2" onClick={() => {
                                    setAddCategory(true);
                                    setFoodCategoryID(0);
                                    setNewCategory("");
                                }}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </Button>
                                <Button size="sm" theme={Category ? "warning" : "secondary"} className={`px-2 ${Category ? "" : "cursor-default"}`} onClick={() => setAddCategory(true)}>
                                    <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button size="sm" theme={Category ? "danger" : "secondary"} className={`px-2 ${Category ? "" : "cursor-default"}`} onClick={() => handleDeleteCategory()}>
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
                <InputGroup theme="horizontal" label={"Food Name"} type={"text"} name="name" />
                <InputGroup theme="horizontal" label={"Price"} type={"text"} name="price" />
                <InputGroup theme="horizontal" label={"Stock"} type={"text"} name="stock" />
                <InputGroup theme="horizontal" label={"Description"} type={"text"} name="description" />
                {update && (
                    <>
                        <div className="grid grid-cols-12 gap-2">
                            <InputGroup theme="horizontal" placeholder="Additional Name" label={"Additional"} type={"text"} className="col-span-11" value={additional} onChange={(e) => setAdditional(e.target.value)} />
                            <InputGroup
                                theme="horizontal"
                                placeholder="Additional Price"
                                label={""}
                                type={"number"}
                                className="col-span-11"
                                value={additionalPrice}
                                onChange={(e) => {
                                    setAdditionalPrice(parseInt(e.target.value));
                                }}
                            />
                            <div className="col-span-1 mt-2">
                                <button onClick={() => handleInsertAdditional()} type="button" className="bg-primary text-light py-2 rounded-md px-5">
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-12">
                            <div className="col-span-2"></div>
                            <table className="col-span-10">
                                {additionalData ? (
                                    <tr>
                                        <th>No</th>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Action</th>
                                    </tr>
                                ) : (
                                    <div></div>
                                )}
                                {additionalData &&
                                    additionalData.map((value: FoodAdditionalType, index: number) => (
                                        <tr key={index}>
                                            <td className="p-2 text-center">{index + 1}</td>
                                            <td className="p-2 text-center">{value.name}</td>
                                            <td className="p-2 text-center">{value.price}</td>
                                            <td className="p-2 space-x-3 text-center">
                                                <Button theme="warning" className={`px-2`} onClick={() => handleEditAdditional(value)}>
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </Button>
                                                <Button theme="danger" className={`px-2`} onClick={() => handleDeleteAdditional(value.id)}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                            </table>
                        </div>
                    </>
                )}
                <InputGroup theme="horizontal" label={"Image"} type={"file"} name="image" />
                <InputGroup
                    theme="horizontal"
                    label={"Favourite"}
                    type={"switch"}
                    checked={favorite}
                    name="favorite"
                    onChange={() => {
                        setFavorite(favorite ? false : true);
                    }}
                />
                <InputGroup
                    theme="horizontal"
                    label={"Availability"}
                    type={"switch"}
                    checked={availability}
                    name="availability"
                    onChange={() => {
                        setAvailability(availability ? false : true);
                    }}
                />
            </Modal>
        </div>
    );
}
