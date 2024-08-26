"use client"
import { Button } from '@/components';
import FormatPrice from '@/helpers/FormatPrice';
import { AmenityType } from '@/types';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image'; // Assuming you're using the Image component from Next.js

interface AmenetiesRowProps {
    index: number;
    amenety: AmenityType;
    onClick?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const AmenetiesRow = ({ index, amenety, onClick, onEdit, onDelete }: AmenetiesRowProps) => {
    return (
        <tr onClick={onClick} className={`text-start border-b-[1px] border-light hover:bg-primary dark:hover:bg-gray-700 px-4 hover:text-light rounded transition-all duration-300 `}>
            <td className="py-2 w-[1px]">{index}</td>
            <td className="py-2 flex justify-start">
                <Image priority src={`${process.env.NEXT_PUBLIC_URL}/files/${amenety.img}`} width={100} height={100} alt={`Image ${amenety.name}`} className="mr-2 w-12 object-cover" />
                <div>
                    <p>{amenety.name}</p>
                    <span className="text-sm hover:text-light">{amenety.description}</span>
                </div>
            </td>
            <td className="py-2 ">{FormatPrice(amenety.price)}</td>
            <td className="py-2 ">{amenety.stock}</td>
            <td className="py-2 ">{amenety?.foodCategory?.name}</td>
            <td className="py-2 ">{amenety.availability ? 'ada' : 'tidak'}</td>
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

export default AmenetiesRow;