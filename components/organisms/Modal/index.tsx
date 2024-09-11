"use client"
import { iconClose } from "@/components/atoms/Icons";
import Image from "next/image";
import { ReactNode } from "react";

interface ModalProps {
    show?: boolean;
    title: string;
    onClosed?: () => void;
    onSave?: any;
    onEdit?: any;
    saveTitle?: any;
    isLoading?: boolean;
    children?: ReactNode;
}

export default function Modal({ show, title, children, onClosed, onSave, isLoading, onEdit, saveTitle }: ModalProps) {
    return (
        <div className={`${show ? 'flex' : 'hidden'} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-dark-50 dark:bg-light-50 modal`}>
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <form onSubmit={onEdit ? '#' : onSave}>
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {title}
                            </h3>
                            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="static-modal" onClick={onClosed}>
                                <Image priority src={iconClose} alt="Image Icon Closed" />
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-4 md:p-5 space-y-4">
                            {children}
                        </div>
                        <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 justify-end space-x-3">
                            <button type="button" className="text-muted border-[1px] border-semimuted py-2 px-12 rounded-lg hover:bg-semimuted hover:text-light transition-all duration-300 font-medium" onClick={onClosed}>Close</button>
                            {onEdit ? (
                                <button
                                    type="button"
                                    className={`text-light border-[1px] bg-warning py-2 px-12 rounded-lg hover:bg-light hover:text-warning hover:border-warning transition-all duration-300 font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isLoading}
                                    onClick={onEdit}
                                >
                                    {isLoading ? 'Processing' : 'Edit'}
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className={`text-light border-[1px] bg-primary py-2 px-12 rounded-lg hover:bg-light hover:text-primary hover:border-primary transition-all duration-300 font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Processing' : saveTitle ?? 'Save'}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}