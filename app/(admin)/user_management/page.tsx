"use client";
import { MetaContext } from "@/app/MetaProvider";
import { Button, ButtonActions, Card, InputBox, InputGroup, Modal } from "@/components";
import { useHotelStore } from "@/components/store/hotelStore";
import { useRoleStore, useUserStore } from "@/components/store/userStore";
import { Alert } from "@/helpers/Alert";
import fetchCustom from "@/helpers/FetchCustom";
import setFormEmpty from "@/helpers/FormInputCustom/empty";
import setFormValue from "@/helpers/FormInputCustom/setform";
import { userSession } from "@/helpers/UserData";
import { RoleType, UserType } from "@/types";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function RoomManagementPage() {
    const { updateTitle } = useContext(MetaContext);
    const [update, setUpdate] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalUser, setModalUser] = useState(false);
    const [page, setPage] = useState("users");
    const [userID, setUserID] = useState(0);
    const [roleId, setRoleId] = useState(0);
    const [dataUsers, setDataUsers] = useState<UserType[] | []>([]);
    const [dataRoles, setDataRoles] = useState<RoleType[] | []>([]);
    const [role, setRole] = useState<RoleType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const updateData = useUserStore((state) => state.updateData);
    const dataroles = useRoleStore((state) => state.roles);
    const updateDataRoles = useRoleStore((state) => state.updateData);
    const datausers = useUserStore((state) => state.users);
    const dataHotel = useHotelStore((state) => state.data);
    const updateDataHotel = useHotelStore((state) => state.updateData);
    let user = userSession;
    let bearerToken = user?.token ?? "";
    const [canManageData, setCanManageData] = useState(0);

    useEffect(() => {
        updateTitle("User Management");
        return () => {
            updateTitle("Dashboard");
        };
    }, [updateTitle]);

    useEffect(() => {
        if (datausers) {
            setDataUsers(datausers);
        }
        if (dataroles) {
            setDataRoles(dataroles);
        }
        getDataUsers();
        getDataRoles();
        getDataHotel();
    }, []);

    function clearForm() {
        setFormEmpty();
        setUserID(0);
        setUpdate(false);
    }

    function searchUsers(searchCriteria: string) {
        if (datausers) {
            const res: UserType[] = datausers.filter((user) => (searchCriteria ? user.name.toLowerCase().includes(searchCriteria.toLowerCase()) : true));
            setDataUsers(res);
        }
    }

    function searchRoles(searchCriteria: string) {
        if (dataroles) {
            const res: RoleType[] = dataroles.filter((user) => (searchCriteria ? user.name.toLowerCase().includes(searchCriteria.toLowerCase()) : true));
            setDataRoles(res);
        }
    }

    const onEditUser = (user: UserType, id: number) => {
        setFormEmpty();
        setUpdate(true);
        setRoleId(user.roleId);
        setFormValue("name", user.name);
        setFormValue("roleId", user.roleId, "select");
        setFormValue("hotelId", user.hotelId, "select");
        setUserID(id);
    };

    async function handleUpdateUser(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get("name") as string;
        const password = btoa(formData.get("password") as string);
        const email = formData.get("email") as string;
        const hotelId = parseInt(formData.get("hotelId") as string);
        const roleId = parseInt(formData.get("roleId") as string);

        const dataUser = JSON.stringify({
            name: name,
            password: password,
            email: email,
            hotelId: hotelId,
            roleId: roleId,
        });

        let url = `${process.env.NEXT_PUBLIC_URL}/register`;
        if (userID > 0) {
            url = `${process.env.NEXT_PUBLIC_URL}/users/${userID}`;
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);

        const requestOptions = {
            method: userID ? "PUT" : "POST",
            headers: myHeaders,
            body: dataUser,
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
                if (userID) {
                    changePassword(event);
                    Alert({ title: "Update Successfully!!" });
                } else {
                    Alert({ title: "Add User Successfully!!" });
                }
                getDataUsers();
                setModalUser(false);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                setIsLoading(false);
            });
    }

    async function changePassword(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const oldPassword = formData.get("oldPassword") as string;
        const newPassword = formData.get("newPassword") as string;
        const currentPassword = formData.get("currentPassword") as string;

        const formdata = new FormData();
        formdata.append("old", oldPassword);
        formdata.append("new", newPassword);
        formdata.append("confirm", currentPassword);

        let url = `${process.env.NEXT_PUBLIC_URL}/users/password`;

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
                    throw new Error(result.message);
                }
                getDataUsers();
                setModal(false);
            })
            .catch((error) => Swal.fire("Warning!", `${error}`, "info"))
            .finally(() => {
                setIsLoading(false);
            });
    }

    async function handleUpdateRole(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get("name") as string;

        const dataUser = JSON.stringify({
            name: name,
            canManageUser: role?.canManageUser,
            canManageData: role?.canManageData,
            canManageHotels: role?.canManageHotels,
            canManageDevices: role?.canManageDevices,
        });

        let url = `${process.env.NEXT_PUBLIC_URL}/roles`;
        if (roleId && roleId > 0) {
            url += "/" + roleId;
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);

        const requestOptions = {
            method: roleId > 0 ? "PUT" : "POST",
            headers: myHeaders,
            body: dataUser,
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
                getDataRoles();
                setModal(false);
                Alert({ title: "Update Successfully!!" });
            })
            .catch((error) => console.error(error))
            .finally(() => {
                setIsLoading(false);
            });
    }

    function getDataUsers() {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/users`, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error("Error fteching");
                } else {
                    updateData(result.data.data);
                    setDataUsers(result.data.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    function getDataHotel() {
        let url = `${process.env.NEXT_PUBLIC_URL}/hotels`;
        fetchCustom<any>(url, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error("500 Server Error");
                } else {
                    updateDataHotel(result.data.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    function getDataRoles() {
        let url = `${process.env.NEXT_PUBLIC_URL}/roles`;
        fetchCustom<any>(url, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error("500 Server Error");
                } else {
                    updateDataRoles(result.data.data);
                    setDataRoles(result.data.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>, roleId: number) => {
        const propertyName = e.target.name;

        const newDataRoles = dataRoles.map((role) => {
            if (role.id === roleId) {
                return { ...role, [propertyName]: e.target.checked ? 1 : 0 };
            }
            return role;
        });

        newDataRoles.map((role) => {
            if (role.id === roleId) {
                let url = `${process.env.NEXT_PUBLIC_URL}/roles/${roleId}`;

                const myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer " + bearerToken);

                const requestOptions = {
                    method: "PUT",
                    headers: myHeaders,
                    body: JSON.stringify(role),
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
                        getDataRoles();
                        setModal(false);
                    })
                    .catch((error) => console.error(error))
                    .finally(() => {
                        setIsLoading(false);
                    });
            }
        });

        updateDataRoles(newDataRoles);
    };

    const handleDeleteUser = async (id: number) => {
        const url = `${process.env.NEXT_PUBLIC_URL}/users/${id}`;
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
                    getDataUsers();
                })
                .catch((error) => console.error(error))
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            Swal.fire("Cancelled", "Your item is safe :)", "info");
        }
    };

    const handleDeleteRole = async (id: number) => {
        const url = `${process.env.NEXT_PUBLIC_URL}/roles/${id}`;
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
                    getDataRoles();
                })
                .catch((error) => console.error(error))
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            Swal.fire("Cancelled", "Your item is safe :)", "info");
        }
    };

    return (
        <div className="grid gap-6">
            <div className="flex -mb-10">
                <div className={`w-max pt-3 rounded-xl cursor-pointer pb-6 px-12 ${page == "users" ? "bg-primary dark:text-slate-800  dark:bg-white text-light" : "bg-white dark:bg-slate-800 dark:text-white text-dark"}`} onClick={() => setPage("users")}>
                    <h1 className="text-h6">Users</h1>
                </div>
                <div className={`w-max pt-3 rounded-xl cursor-pointer pb-6 px-10 ${page == "roles" ? "bg-primary dark:text-slate-800 dark:bg-white  text-light" : "bg-white dark:bg-slate-800 dark:text-white text-dark"}`} onClick={() => setPage("roles")}>
                    <h1 className="text-h6">Roles</h1>
                </div>
            </div>

            {page === "users" ? (
                <Card>
                    <h1 className="text-h5 font-semibold">List Users</h1>
                    <ButtonActions
                        onClickAdd={() => {
                            setFormEmpty();
                            setModalUser(modal ? false : true);
                        }}
                        onSearch={(e) => searchUsers(e.target.value)}
                        onClickRepeat={() => getDataUsers()}
                    />
                    <table className="w-full mt-5">
                        <thead>
                            <tr className="text-start border-b-[1px] text-muted dark:text-light border-light">
                                <td className="py-3 text-start font-medium">No.</td>
                                <td className="py-3 text-start font-medium">Name</td>
                                <td className="py-3 text-start font-medium">Email</td>
                                <td className="py-3 text-start font-medium">Role</td>
                                {/* <td className="py-3 text-start font-medium">User</td> */}
                                <td className="py-3 text-start font-medium">Action</td>
                            </tr>
                        </thead>
                        <tbody>
                            {dataUsers &&
                                dataUsers.map((user: UserType, index: number) => (
                                    <tr key={index} className={`text-start border-b-[1px] border-light hover:bg-primary dark:hover:bg-gray-700 px-4 hover:text-light rounded transition-all duration-300 `}>
                                        <td className="py-2 ">{index + 1}</td>
                                        <td className="py-2 ">{user.name}</td>
                                        <td className="py-2 ">{user.email}</td>
                                        <td className="py-2 ">{user.role.name}</td>
                                        {/* <td className="py-2 ">{user.property}</td> */}
                                        <td className="py-2 space-x-2">
                                            <Button
                                                theme="warning"
                                                onClick={() => {
                                                    onEditUser(user, user.id);
                                                    setModalUser(true);
                                                    setFormValue("name", user.name);
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Button>
                                            <Button
                                                theme="danger"
                                                onClick={() => {
                                                    handleDeleteUser(user.id);
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </Card>
            ) : (
                <Card>
                    <h1 className="text-h5 font-semibold">List Roles</h1>
                    <ButtonActions
                        onClickAdd={() => {
                            setModal(modal ? false : true);
                            setUpdate(false);
                            setFormValue("name", " ");
                        }}
                        onSearch={(e) => searchRoles(e.target.value)}
                        onClickRepeat={() => getDataRoles()}
                    />
                    <table className="w-full mt-5">
                        <thead>
                            <tr className="text-start border-b-[1px] text-muted dark:text-light border-light">
                                <td className="py-3 text-start font-medium">No.</td>
                                <td className="py-3 text-start font-medium">Name Role</td>
                                <td className="py-3 text-start font-medium">Can Manage Data</td>
                                <td className="py-3 text-start font-medium">Can Manage Property</td>
                                <td className="py-3 text-start font-medium">Can Manage User</td>
                                <td className="py-3 text-start font-medium">Action</td>
                            </tr>
                        </thead>
                        <tbody>
                            {dataRoles &&
                                dataRoles.map((role: RoleType, index: number) => (
                                    <tr key={index} className={`text-start border-b-[1px] border-light `}>
                                        <td className="py-2 ">{index + 1}</td>
                                        <td className="py-2 ">{role.name}</td>
                                        <td className="py-2">
                                            <InputBox className="col-span-3" checked={role.canManageData === 1} type="switch" name={"canManageData"} onChange={(e: ChangeEvent<HTMLInputElement>) => handleSwitchChange(e, role.id)} />
                                        </td>
                                        <td className="py-2 ">
                                            <InputBox className="col-span-3" checked={role.canManageHotels === 1} type="switch" name={"canManageHotels"} onChange={(e: ChangeEvent<HTMLInputElement>) => handleSwitchChange(e, role.id)} />
                                        </td>
                                        <td className="py-2 ">
                                            <InputBox className="col-span-3" checked={role.canManageUser === 1} type="switch" name={"canManageUser"} onChange={(e: ChangeEvent<HTMLInputElement>) => handleSwitchChange(e, role.id)} />
                                        </td>
                                        <td className="py-2 space-x-2">
                                            <Button
                                                theme="warning"
                                                onClick={() => {
                                                    setUpdate(true);
                                                    setModal(true);
                                                    setRole(role);
                                                    setRoleId(role.id);
                                                    setFormValue("name", role.name);
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Button>
                                            <Button
                                                theme="danger"
                                                onClick={() => {
                                                    handleDeleteRole(role.id);
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </Card>
            )}

            <Modal
                title={update ? "Update Role" : "Insert Role"}
                show={modal}
                onClosed={() => {
                    clearForm();
                    setRoleId(0);
                    setModal(modal ? false : true);
                }}
                onSave={(event: FormEvent<HTMLFormElement>) => handleUpdateRole(event)}
            >
                <InputGroup theme="horizontal" label={"Name "} placeholder="Role Name" type={"text"} name="name" />
            </Modal>

            <Modal
                title={update ? "Update Users" : "Insert Users"}
                show={modalUser}
                onClosed={() => {
                    setModalUser(modalUser ? false : true), clearForm();
                }}
                onSave={(event: FormEvent<HTMLFormElement>) => handleUpdateUser(event)}
            >
                {update || (
                    <>
                        <InputGroup theme="horizontal" label={"Email"} type={"text"} name="email" />
                        <InputGroup theme="horizontal" label={"Password"} type={"password"} name="password" />
                    </>
                )}
                <InputGroup theme="horizontal" label={"Name"} type={"text"} name="name" />
                <InputGroup
                    theme="horizontal"
                    options={
                        dataHotel &&
                        dataHotel.map((hotel) => ({
                            value: hotel.id,
                            name: hotel.name,
                        }))
                    }
                    placeholder="Choice Hotel"
                    label={"Hotel"}
                    type={"select"}
                    className="col-span-10"
                    name="hotelId"
                />
                <InputGroup
                    theme="horizontal"
                    options={
                        dataRoles &&
                        dataRoles.map((item) => ({
                            value: item.id,
                            name: item.name,
                        }))
                    }
                    placeholder="Choice Role"
                    label={"Role"}
                    type={"select"}
                    className="col-span-10"
                    name="roleId"
                />
                {update && (
                    <>
                        <h5 className="py-2">Forgot Password</h5>
                        <InputGroup theme="horizontal" label={"Old Password"} type={"password"} name="oldPassword" />
                        <InputGroup theme="horizontal" label={"New Password"} type={"password"} name="newPassword" />
                        <InputGroup theme="horizontal" label={"Confirm Password"} type={"password"} name="currentPassword" />
                    </>
                )}
            </Modal>
        </div>
    );
}
