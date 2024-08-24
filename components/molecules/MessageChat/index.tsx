interface MessageChatType {
    name: string;
    image?: any;
    text?: string;
    status?: string;
    date?: string;
    sender?: boolean;
}

export default function MessageChat({ name, date, image, status, text, sender }: MessageChatType) {
    return (
        <div className={`flex items-end ${sender && "justify-end"} mt-4`}>
            <div className={`flex ${sender && "flex-row-reverse"} items-start gap-2.5`}>
                <img className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-3.jpg" width={20} height={20} alt="Jese image" />
                <div className="flex flex-col gap-1 w-full max-w-[320px]">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm font-semibold text-dark dark:text-white">{name}</span>
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{date ?? '11:46'}</span>
                    </div>
                    <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-primary-70 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                        <p className="text-sm font-normal text-semi-light dark:text-white"> {text ?? "Hello"}</p>
                    </div>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{status ?? 'Delivered'}</span>
                </div>
            </div>

        </div>
    )
}