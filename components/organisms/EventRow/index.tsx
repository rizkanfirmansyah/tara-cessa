"use client";
import { Button } from "@/components";
import { EventType } from "@/types";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

interface EventRowProps {
    index: number;
    event: EventType;
    onClick?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const FacilityRow = ({ index, event, onClick, onEdit, onDelete }: EventRowProps) => {
    return (
        <tr onClick={onClick} className={`dark:bg-gray-700 dark:text-light text-muted text-start border-b-[1px] border-light hover:bg-primary dark:hover:bg-gray-700 px-4 hover:text-light rounded transition-all duration-300 `}>
            <td className="py-2 w-[1px]">{index}</td>
            <td className="py-2 flex justify-start">
                <Image priority src={`${process.env.NEXT_PUBLIC_URL}/files/${event.img}`} alt={`Image ${event.name}`} className="mr-2 w-12 object-cover" width={100} height={100} />
                <div>
                    <p>{event.name}</p>
                    <span className="text-sm hover:text-light">{event.description}</span>
                </div>
            </td>
            {onEdit && (
                <td className="py-2 space-x-2">
                    <Button theme="warning" onClick={onEdit}>
                        <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button theme="danger" onClick={onDelete}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                </td>
            )}
            {!onEdit && (
                <td className="py-2 space-x-2">
                    {event.createdAt}
                </td>
            )}
        </tr>
    );
};

export default FacilityRow;
