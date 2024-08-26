"use client";

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface RoomGridProps {
    name: string;
    active?: boolean;
    onClick?: () => void;
    icon?: IconProp;
}

export default function RoomGrid({ name, active, onClick, icon }: RoomGridProps) {
    return (
        <div
            onClick={onClick}
            className={`${active ? "bg-primary dark:bg-gray-700 text-light" : ""
                } flex flex-col items-center justify-center border-[1px] border-light cursor-pointer hover:bg-primary dark:hover:bg-gray-700 px-4 hover:text-light py-2 rounded transition-all duration-300`}
            data-id={active}
        >
            <FontAwesomeIcon
                icon={icon ?? faDoorOpen}
                style={{ height: 24 }}
                className="font-medium mx-2"
            />
            <p className="mt-1 text-xs">{name}</p>
        </div>
    );
}
