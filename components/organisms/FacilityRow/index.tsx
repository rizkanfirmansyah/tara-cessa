"use client"
import React, { useEffect } from 'react';
import Image from 'next/image'; // Assuming you're using the Image component from Next.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components';
import FormatPrice from '@/helpers/FormatPrice';
import { FacilityType } from '@/types';

interface FacilityRowProps {
    index: number;
    facility: FacilityType;
    onClick?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const FacilityRow = ({ index, facility, onClick, onEdit, onDelete }: FacilityRowProps) => {
    return (
        <tr onClick={onClick} className={`dark:bg-gray-700 dark:text-light text-muted text-start border-b-[1px] border-light hover:bg-primary dark:hover:bg-gray-700 px-4 hover:text-light rounded transition-all duration-300 `}>
            <td className="py-2 w-[1px]">{index}</td>
            <td className="py-2 flex justify-start">
                <Image priority src={`${process.env.NEXT_PUBLIC_URL}/files/${facility.img}`} alt={`Image ${facility.name}`} className="mr-2 w-12 object-cover" width={100} height={100} />
                <div>
                    <p>{facility.name}</p>
                    <span className="text-sm hover:text-light">{facility.description}</span>
                </div>
            </td>
            <td className="py-2 ">{FormatPrice(facility.price)}</td>
            <td className="py-2 ">{facility.description}</td>
            <td className="py-2 ">{facility.facilityCategory?.name}</td>
            <td className="py-2 space-x-2">
                <Button theme='warning' onClick={onEdit}>
                    <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button theme='danger' onClick={onDelete}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
            </td>
        </tr>
    );
};

export default FacilityRow;