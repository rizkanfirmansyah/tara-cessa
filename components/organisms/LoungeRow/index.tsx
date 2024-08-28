"use client";
import { Button } from "@/components";
import { LoungeType } from "@/types/RoomType";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface LoungeRowProps {
    index: number;
    table: LoungeType;
    onClick?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const LoungeRow = ({ index, table, onClick, onEdit, onDelete }: LoungeRowProps) => {
    return (
        <tr onClick={onClick} className={`dark:bg-gray-700 dark:text-light text-muted text-start border-b-[1px] border-light hover:bg-primary dark:hover:bg-gray-700 px-4 hover:text-light rounded transition-all duration-300 `}>
            <td className="py-2">{index}</td>
            <td className="py-2 flex justify-start">
                <div>
                    <p>{table.tableNo}</p>
                    <span className="text-sm hover:text-light">{table.tableName}</span>
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
                    {table.link}
                </td>
            )}
        </tr>
    );
};

export default LoungeRow;
