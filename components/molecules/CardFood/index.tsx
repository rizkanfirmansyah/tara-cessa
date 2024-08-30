import { Button } from "@/components";
import { imageFood } from "@/components/atoms/Images";

interface CardFoodType {
    title: string;
    image?: any;
    onClick?: () => void;
}

export default function CardFood({ title, image, onClick }: CardFoodType) {
    return (
        <div className="relative">
            <div className="bg-white rounded-lg dark:bg-slate-800 dark:text-light p-3 cursor-pointer h-full">
                <img src={image ?? imageFood} className="w-full h-28 object-cover rounded-md" alt="Image Hotel" />
                <h1 className="text-md font-medium m-2">{title}</h1>
            </div>
            <div className="bg-white-50 rounded-lg absolute top-0 dark:bg-slate-800 dark:text-light p-3 cursor-pointer opacity-0 hover:opacity-100 w-full h-full transition-all duration-200 flex justify-center items-end">
                <Button className="w-full" onClick={onClick}>Add to Cart</Button>
            </div>
        </div>
    )
}