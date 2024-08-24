"use client";
import React, { useEffect } from "react";
import Image from "next/image"; // Assuming you're using the Image component from Next.js
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHotel, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components";

interface PropertyRowProps {
    index: number;
    name: string;
    location: string;
    price?: number;
    branch?: string;
    image?: any;
    active?: boolean;
    onClick?: () => void;
    onDelete?: () => void;
}

const PropertyRow = ({ index, name, location, price, image, active, onClick, branch, onDelete }: PropertyRowProps) => {
    return (
        <tr onClick={onClick} className={`${active ? "bg-primary dark:bg-gray-700 text-light" : ""} text-start border-b-[1px] border-light cursor-pointer hover:bg-primary dark:hover:bg-gray-700 px-4 hover:text-light rounded transition-all duration-300 `} data-id={active}>
            <td className="py-2 w-[1px]">{index}</td>
            <td className="py-2 flex justify-start items-center gap-3">
                {/* <Image priority src={image} alt={`Image ${name}`} className="mr-2 w-12 object-cover" /> */}
                <FontAwesomeIcon icon={faHotel} className="text-h4 " />
                <div>
                    <p>{name}</p>
                    <span className="capitalize text-sm hover:text-light">{location}</span>
                </div>
            </td>
            <td className="capitalize py-2 ">{branch}</td>
            <td className="py-2 space-x-2">
                {/* <Button theme="warning" onClick={onEdit}>
                    <FontAwesomeIcon icon={faEdit} />
                </Button> */}
            </td>
        </tr>
    );
};

export default PropertyRow;
