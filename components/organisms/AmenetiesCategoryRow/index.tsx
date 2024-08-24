"use client"
import { Button } from '@/components';
import { AmenityType } from '@/types';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface AmenetiesCategoryRowProps {
    index: number;
    amenety: AmenityType;
    onClick?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const AmenetiesCategoryRow = ({ index, amenety, onClick, onDelete, onEdit }: AmenetiesCategoryRowProps) => {
    return (
        <tr onClick={onClick} className={`${amenety.id ? 'bg-primary dark:bg-gray-700 text-light' : ''} text-start border-b-[1px] border-light hover:bg-primary dark:hover:bg-gray-700 px-4 hover:text-light rounded transition-all duration-300 `} data-id={amenety.id}>
            <td className="py-2 w-[1px]">{index}</td>
            <td className="py-2 flex justify-start">
                <div>
                    <p>{amenety.name}</p>
                    <span className="text-sm hover:text-light">{amenety.description}</span>
                </div>
            </td>
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

export default AmenetiesCategoryRow;