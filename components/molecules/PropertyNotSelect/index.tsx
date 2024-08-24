import { iconChat } from "@/components";
import Image from "next/image";

export default function PropertyNotSelect() {
    return (
        <div className="flex justify-center h-full items-center">
            <div className="block">
                <Image priority
                    src={iconChat}
                    alt="Image Chat Empty" className="mx-auto" />
                <h1 className="text-muted text-h6">Select a hotel to see full profile here</h1>
            </div>
        </div>
    )
}