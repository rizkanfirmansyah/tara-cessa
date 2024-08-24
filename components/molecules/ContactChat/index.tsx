import { imageHotel1 } from "@/components";
import Image from "next/image";

interface ContactChatType {
    image?: any;
    name: string;
    chat?: string;
    onClick?: () => void;
}

export default function ContactChat({ name, chat, image, onClick }: ContactChatType) {
    return (
        <>
            <div className="flex p-3 cursor-pointer hover:bg-light dark:bg-slate-800 dark:text-light dark:hover:bg-primary-70" onClick={onClick}>
                <Image priority src={image ? image : imageHotel1} alt={`Image`} className="mr-2 w-12 object-cover rounded-full" />
                <div className="">
                    <p>{name}</p>
                    <span className="text-sm ">{chat}</span>
                </div>
            </div>
            <hr className="h-[1px] bg-semimuted" />
        </>
    );
}
