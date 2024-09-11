"use client";
import { Button } from "@/components";
import FormatPrice from "@/helpers/FormatPrice";
import Image from "next/image";
import { FoodType } from "@/types";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface FoodRowProps {
    index: number;
    food: FoodType;
    onClick?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const FoodRow = ({ index, food, onClick, onEdit, onDelete }: FoodRowProps) => {
    return (
        <tr onClick={onClick} className={`dark:bg-gray-700 dark:text-light text-muted text-start border-b-[1px] border-light hover:bg-primary dark:hover:bg-gray-700 px-4 hover:text-light rounded transition-all duration-300 `} data-id={food.favorite}>
            <td className="py-2 w-[40px] text-center">{index}</td>
            <td className="py-2">
                <div className="flex gap-4">
                    <div className="w-[80px] h-[80px] rounded-xl overflow-clip">
                        <img src={`${process.env.NEXT_PUBLIC_URL}/files/${food.img}`} alt={`Image ${food.name}`} className="object-cover" />
                    </div>
                    <div className="flex-1 pr-4">
                        <p>{food.name}</p>
                        <span className="text-sm hover:text-light">{food.description} </span>
                    </div>
                </div>
            </td>
            <td className="py-2 px-5 text-end">{FormatPrice(food.price)}</td>
            <td className="py-2 px-5 text-end">{food.stock}</td>
            <td className="py-2 px-10 text-center">{food.availability ? "Tersedia" : "Tidak Tersedia"}</td>
            <td className="py-2">
                <div className="flex gap-1 pr-2">
                    <Button theme="warning" onClick={onEdit}>
                        <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button theme="danger" onClick={onDelete}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                </div>
            </td>
        </tr>
    );
};

export default FoodRow;
