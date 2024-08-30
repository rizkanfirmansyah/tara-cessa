"use client"
import { MetaContext } from "@/app/MetaProvider";
import { ButtonActions, Card, InputBox } from "@/components";
import { TableActiveHook } from "@/helpers/TableActive";
import { RoleType } from "@/types";
import { useContext, useEffect, useState } from "react";

const dataUsers: RoleType[] = [
    {
        id: 1,
        name: "Admin",
        canManageData: 0,
        canManageDevices: 0,
        canManageHotels: 0,
        canManageUser: 0,
        frontdesk: 1,
        order: 0,
    },
    {
        id: 2,
        name: "Manager",
        canManageData: 1,
        canManageDevices: 1,
        canManageHotels: 0,
        canManageUser: 0,
        frontdesk: 1,
        order: 0,
    },
];

export default function ConfigurationPage({ }) {
    const { updateTitle } = useContext(MetaContext);
    const { datas, action, updateRowState } = TableActiveHook({
        objData: dataUsers,
    });

    const [modal, setModal] = useState(false);

    useEffect(() => {
        updateTitle("Configuration Page");
        return () => {
            updateTitle("Dashboard");
        };
    }, [updateTitle]);
    return (
        <Card>
            <h1 className="text-h5 font-semibold">List Roles</h1>
            <ButtonActions
                onClickAdd={() => setModal(modal ? false : true)}
            />
            <table className="w-full mt-5">
                <thead>
                    <tr className="text-start border-b-[1px] text-muted dark:text-light border-light">
                        <td className="py-3 text-start font-medium">No.</td>
                        <td className="py-3 text-start font-medium">
                            Name Role
                        </td>
                        <td className="py-3 text-start font-medium">
                            Can Manage Data
                        </td>
                        <td className="py-3 text-start font-medium">
                            Can Manage User
                        </td>
                        <td className="py-3 text-start font-medium">
                            Can Manage Property
                        </td>
                        <td className="py-3 text-start font-medium">
                            Can Manage Device
                        </td>
                        <td className="py-3 text-start font-medium">
                            FrontDesk
                        </td>
                        <td className="py-3 text-start font-medium">
                            Action
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {datas.map((role: RoleType, index: number) => (
                        <tr key={index} className={`text-start border-b-[1px] border-light `} >
                            <td className="py-2 ">{role.id}</td>
                            <td className="py-2 ">{role.name}</td>
                            <td className="py-2 "><InputBox className="col-span-3" checked={role.canManageData ? true : false} type="switch" name={"canManageData"} onChange={() => { }} placeholder="" /></td>
                            <td className="py-2 "><InputBox className="col-span-3" checked={role.canManageDevices ? true : false} type="switch" name={"canManageDevice"} onChange={() => { }} placeholder="" /></td>
                            <td className="py-2 "><InputBox className="col-span-3" checked={role.canManageHotels ? true : false} type="switch" name={"canManageProperty"} onChange={() => { }} placeholder="" /></td>
                            <td className="py-2 "><InputBox className="col-span-3" checked={role.canManageUser ? true : false} type="switch" name={"canManageUser"} onChange={() => { }} placeholder="" /></td>
                            <td className="py-2 "><InputBox className="col-span-3" checked={role.frontdesk ? true : false} type="switch" name={"frontedesk"} onChange={() => { }} placeholder="" /></td>
                            <td className="py-2 space-x-2">
                                {/* <Button theme='warning'>
                                    <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button theme='danger' onClick={() => { }}>
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </Button> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    )
}