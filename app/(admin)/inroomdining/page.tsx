"use client";
import { MetaContext } from "@/app/MetaProvider";
import { Button, ButtonActions, Card, FoodRow, InputGroup, Modal } from "@/components";
import { useHotelStore } from "@/components/store/hotelStore";
import fetchCustom from "@/helpers/FetchCustom";
import { userSession } from "@/helpers/UserData";
import { FoodType } from "@/types";
import { FoodAdditionalType, FoodCategoryType } from "@/types/FoodType";
import { faEdit, faPlus, faRepeat, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useContext, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

const initialAdditional: FoodAdditionalType = {
    foodId: 0,
    id: 0,
    name: '',
    price: 0,
};

const initialCategory: FoodCategoryType = {
    hotelId: 0,
    id: 0,
    img: '',
    name: '',
};

const initialFood: FoodType = {
    availability: false,
    categoryId: 0,
    description: '',
    favorite: 0,
    foodCategory: {
        hotelId: 0,
        id: 0,
        img: '',
        name: '',
    },
    id: 0,
    img: '',
    name: '',
    price: 0,
    stock: 0,
};

export default function InRoomDiningPage() {
    const [additional, setAdditional] = useState<FoodAdditionalType>(initialAdditional);
    const [additionals, setAdditionals] = useState<FoodAdditionalType[]>([]);
    const [category, setCategory] = useState<FoodCategoryType | null>();
    const [categories, setCategories] = useState<FoodCategoryType[]>([]);
    const [food, setFood] = useState<FoodType>(initialFood);
    const [foods, setFoods] = useState<FoodType[] | []>([]);
    const [img, setImg] = useState<File | null>();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [searchCategoryId, setSearchCategoryId] = useState(0);
    const [showEditFood, setShowEditFood] = useState(false);
    const [showEditCategory, setShowEditCategory] = useState(false);

    const { updateTitle } = useContext(MetaContext);
    const hotelID = useHotelStore((state) => state.hotelID);
    let user = userSession;
    let bearerToken = user?.token ?? '';

    const rows = useMemo(() => {
        return foods
            .filter(v => search ? v.name.toLowerCase().includes(search.toLowerCase()) : true)
            .filter(v => searchCategoryId === 0 ? true : v.categoryId === searchCategoryId);
    }, [foods, search, searchCategoryId]);

    useEffect(() => {
        updateTitle("Food Page");
        return () => {
            updateTitle("Dashboard");
        };
    }, [updateTitle]);

    useEffect(() => {
        getDataFoods();
        getDataFoodsCategory();
    }, []);

    const getDataFoodsCategory = () => {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/food_categories`, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error("Error fteching");
                } else {
                    setCategories(result.data.data);
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
                    setFoods(result.data.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const getAdditionalData = (foodID: number) => {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/${foodID}/food_add`, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error("Error fteching");
                } else {
                    setAdditionals(result.data.data);
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

        setLoading(true);
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
                })
                .catch((error) => console.error(error))
                .finally(() => {
                    setLoading(false);
                });
        } else {
            Swal.fire("Cancelled", "Your item is safe :)", "info");
        }
    };

    const handleEditFoods = (food: FoodType) => {
        clearForm();
        getAdditionalData(food.id);
        setFood(food);
        setCategory(food.foodCategory);
        setAdditional(initialAdditional);
        setShowEditFood(true);
    };

    function clearForm() {
        setFood(initialFood);
        setCategory(null);
        setAdditional(initialAdditional);
        setImg(null);
    }

    const handleInsertFood = async (event: FormEvent<HTMLFormElement>) => {
        event && event.preventDefault();

        const f = { ...food };
        if (img == null) {
            f.img = '';
        }
        const jsonData = JSON.stringify(f);

        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/foods/${food.categoryId}`;
        if (food.id > 0) {
            url += "/" + food.id;
        }

        const formdata = new FormData();
        formdata.append("data", jsonData);
        if (img != null) {
            formdata.append("image", img);
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${bearerToken}`);

        const requestOptions = {
            method: food.id > 0 ? "PUT" : "POST",
            headers: myHeaders,
            body: formdata,
        };

        setLoading(true);
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
                setShowEditFood(false);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                setLoading(false);
            });
    };

    const handleInsertAdditional = () => {
        if (additional == null) {
            return;
        }

        const additionalData = JSON.stringify({
            foodID: food.id,
            name: additional.name,
            price: additional.price,
        });

        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/${food.id}/food_add`;
        if (additional.id > 0) {
            url += "/" + additional.id;
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${bearerToken}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: additional.id > 0 ? "PUT" : "POST",
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
                getAdditionalData(food.id);
            })
            .catch((error) => console.error(error));

        setAdditional(initialAdditional);
    };

    const handleEditAdditional = (value: FoodAdditionalType) => {
        setAdditional(value);
    };

    const handleDeleteAdditional = async (foodId: number, id: number) => {
        const url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/${foodId}/food_add/${id}`;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
        };

        setLoading(true);
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
                    getAdditionalData(foodId);
                })
                .catch((error) => console.error(error))
                .finally(() => {
                    setLoading(false);
                });
        } else {
            Swal.fire("Cancelled", "Your item is safe :)", "info");
        }
    };

    const handleSubmitCategory = async () => {
        if (category == null) {
            return;
        }

        const jsonData = JSON.stringify({
            name: category.name,
        });

        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/food_categories`;
        if (category.id > 0) {
            url += "/" + category.id;
        }

        const formdata = new FormData();
        formdata.append("data", jsonData);
        if (img != null) {
            formdata.append("image", img);
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);

        const requestOptions = {
            method: category.id > 0 ? "PUT" : "POST",
            headers: myHeaders,
            body: formdata,
        };

        setLoading(true);
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
                    setShowEditCategory(false);
                })
                .catch((error) => console.error(error))
                .finally(() => {
                    setLoading(false);
                });
        } else {
            Swal.fire("Cancelled", "Your item is safe :)", "info");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length !== 1) {
            return;
        }

        const file = files[0];        
        setImg(file);
        if (showEditCategory && category != null) {
            setCategory({ ...category, img: file.name });
        } else {
            setFood({ ...food, img: file.name });
        }
    };

    const handleDeleteCategory = async () => {
        if (category == null || category.id === 0) {
            Swal.fire("Warning!", "Please select a category to delete", "info");
            return;
        }

        const url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/food_categories/${category.id}`;
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
                <div className="w-full">
                    <div className="flex justify-between items-center">
                        <h1 className="text-h5 font-semibold">Food List</h1>
                    </div>
                    <ButtonActions
                        valueSearch={search}
                        onSearch={(e) => setSearch(e.target.value)}
                        onClickRepeat={() => getDataFoods()}
                        onClickAdd={() => {
                            clearForm();
                            setCategory(categories[0]);
                            setShowEditFood(true);
                        }}
                    />
                </div>
                <div className="flex mt-5 gap-2">
                    <div
                        className={`${searchCategoryId === 0 && 'bg-primary-15'} flex text-dark dark:text-light border-[1px] rounded-full py-1 px-2 hover:bg-primary-15 cursor-pointer`}
                        onClick={() =>  setSearchCategoryId(0)}
                    >
                        All Categories
                    </div>
                    {categories.map(v => (
                        <div
                            key={v.id}
                            className={`${searchCategoryId === v.id && 'bg-primary-15'} flex text-dark dark:text-light border-[1px] rounded-full py-1 px-2 hover:bg-primary-15 cursor-pointer`}
                            onClick={() =>  setSearchCategoryId(v.id)}
                        >
                            {v.name}
                        </div>
                    ))}
                </div>
                <table className="w-full mt-5">
                    <thead>
                        <tr className="text-start border-b-[1px] text-muted dark:text-light border-light">
                            <td className="py-3 px-3 w-[50px] text-center font-medium">No.</td>
                            <td className="py-3 px-3 text-start font-medium">Food Name</td>
                            <td className="py-3 px-3 w-[100px] text-end font-medium">Price</td>
                            <td className="py-3 px-3 w-[80px] text-end font-medium">Stock</td>
                            <td className="py-3 px-3 w-[150px] text-center font-medium">Availability</td>
                            <td className="py-3 px-3 w-[180px] text-start font-medium">Category</td>
                            <td className="py-3 px-3 w-[50px] text-start font-medium">Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((food: FoodType, index: number) => (
                            <FoodRow
                                key={food.id}
                                index={index + 1}
                                food={food}
                                onDelete={() => handleDeleteFood(food.id, food.categoryId)}
                                onEdit={() => handleEditFoods(food)}
                            />
                        ))}
                    </tbody>
                </table>
            </Card>

            <Modal
                title={food.id > 0 ? "Update Food" : "Insert Food"}
                show={showEditFood || showEditCategory}
                isLoading={loading}
                onSave={(event: FormEvent<HTMLFormElement>) => handleInsertFood(event)}
                onClosed={() => {
                    setShowEditFood(false);
                    setShowEditCategory(false);
                    clearForm();
                }}
            >
                <div className="grid grid-cols-12 gap-2">
                    <InputGroup
                        theme="horizontal"
                        options={categories.map(v => ({ value: v.id, name: v.name }))}
                        placeholder="Choose Category"
                        label={"Category"}
                        type={"select"}
                        name="category"
                        className="col-span-10"
                        value={food.categoryId}
                        onChangeSelect={(event) => {
                            const value = parseInt(event.target.value);
                            setFood({ ...food, categoryId: value });
                            setCategory(categories.find(v => v.id === value));
                        }}
                    />
                    <div className="col-span-2">
                        {showEditCategory ? (
                            <Button
                                theme="danger"
                                onClick={() => {
                                    if (food.id > 0) {
                                        setCategory(food.foodCategory);
                                    } else if (categories.length > 0) {
                                        setCategory(categories[0]);
                                    }
                                    setShowEditCategory(false);
                                }}
                            >
                                <FontAwesomeIcon icon={faRepeat} />
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    className="px-2"
                                    onClick={() => {
                                        setCategory({ ...initialCategory, hotelId: hotelID! });
                                        setShowEditCategory(true);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                </Button>
                                <Button
                                    size="sm"
                                    theme="warning"
                                    className="px-2"
                                    disabled={category == null || category.id <= 0}
                                    onClick={() => setShowEditCategory(true)}
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button
                                    size="sm"
                                    theme="danger"
                                    className="px-2"
                                    disabled={category == null || category.id <= 0}
                                    onClick={() => handleDeleteCategory()}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {showEditCategory && (
                    <div className="grid grid-cols-12 gap-2">
                        <InputGroup
                            theme="horizontal"
                            label={"New Category"}
                            type={"text"}
                            value={category?.name}
                            className="col-span-11"
                            onChange={(e) => {
                                if (category != null) {
                                    setCategory({ ...category, name: e.target.value });
                                }
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

                {!showEditCategory && (
                    <>
                        <InputGroup
                            theme="horizontal"
                            label="Food Name"
                            type="text"
                            name="name"
                            value={food.name}
                            onChange={e => setFood({ ...food, name: e.target.value })}
                        />
                        <InputGroup
                            theme="horizontal"
                            label="Description"
                            type="text"
                            name="description"
                            value={food.description}
                            onChange={e => setFood({ ...food, description: e.target.value })}
                        />
                        <InputGroup
                            theme="horizontal"
                            label={"Image"}
                            type={"file"}
                            name="image"
                            onChange={handleImageChange}
                        />
                        <InputGroup
                            theme="horizontal"
                            label="Price"
                            type="text"
                            name="price"
                            value={food.price}
                            onChange={e => setFood({ ...food, price: parseFloat(e.target.value) })}
                        />
                        <InputGroup
                            theme="horizontal"
                            label={"Favourite"}
                            type={"switch"}
                            checked={food.favorite != 1}
                            name="favorite"
                            onChange={() => setFood({ ...food, favorite: food.favorite ? 0 : 1 })}
                        />
                        <InputGroup
                            theme="horizontal"
                            label="Stock"
                            type="text"
                            name="stock"
                            value={food.stock}
                            onChange={e => setFood({ ...food, stock: parseInt(e.target.value) })}
                        />
                        <InputGroup
                            theme="horizontal"
                            label={"Availability"}
                            type={"switch"}
                            checked={food.availability}
                            name="availability"
                            onChange={() => setFood({ ...food, availability: !food.availability })}
                        />

                        {food.id > 0 && (
                            <>
                                <div className="grid grid-cols-12 gap-2">
                                    <InputGroup
                                        theme="horizontal"
                                        placeholder="Additional Name"
                                        label={"Additional"}
                                        type={"text"}
                                        className="col-span-11"
                                        value={additional.name}
                                        onChange={(e) => setAdditional({ ...additional, name: e.target.value })}
                                    />
                                    <InputGroup
                                        theme="horizontal"
                                        placeholder="Additional Price"
                                        label={""}
                                        type={"number"}
                                        className="col-span-11"
                                        value={additional.price}
                                        onChange={(e) => setAdditional({ ...additional, price: parseInt(e.target.value) })}
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
                                        {additionals.length > 0 ? (
                                            <tr>
                                                <th>No</th>
                                                <th>Name</th>
                                                <th>Price</th>
                                                <th>Action</th>
                                            </tr>
                                        ) : (
                                            <div></div>
                                        )}
                                        {additionals.map((value: FoodAdditionalType, index: number) => (
                                            <tr key={index}>
                                                <td className="p-2 text-center">{index + 1}</td>
                                                <td className="p-2 text-center">{value.name}</td>
                                                <td className="p-2 text-center">{value.price}</td>
                                                <td className="p-2 space-x-3 text-center">
                                                    <Button theme="warning" className={`px-2`} onClick={() => handleEditAdditional(value)}>
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </Button>
                                                    <Button theme="danger" className={`px-2`} onClick={() => handleDeleteAdditional(food.id, value.id)}>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </table>
                                </div>
                            </>
                        )}
                    </>
                )}
            </Modal>
        </div>
    );
}
