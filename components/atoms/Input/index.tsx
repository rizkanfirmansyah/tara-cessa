"use client";
import { OptionType } from "@/types";

interface inputProps {
    type: string;
    name?: string;
    placeholder?: string;
    onChange?: any;
    value?: any;
    className?: string;
    options?: OptionType[];
    checked?: boolean;
    disabled?: boolean;
}

export default function InputBox({ type, name, placeholder, onChange, value, className, options, checked, disabled }: inputProps) {
    return (
        <>
            {type == "textarea" && onChange && (
                <textarea
                    name={name || "username"}
                    placeholder={placeholder || "Input something here..."}
                    className={`${className} block text-body text-semidark p-[12px] border-muted-line border-[0.5px] w-full rounded-lg mt-1 dark:bg-light dark:text-dark`}
                    onChange={onChange}
                    cols={20}
                    rows={2}
                    value={value || ""}
                    disabled={disabled}
                />
            )}
            {type == "textarea" && !onChange && (
                <textarea
                    name={name || "username"}
                    placeholder={placeholder || "Input something here..."}
                    className={`${className} block text-body text-semidark p-[12px] border-muted-line border-[0.5px] w-full rounded-lg mt-1 dark:bg-light dark:text-dark`}
                    onChange={onChange}
                    cols={20}
                    rows={2}
                />
            )}
            {type === "switch" && (
                <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" value={`${checked}`} className="sr-only peer" checked={checked} onChange={onChange} name={name} />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-light rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:bg-semimuted peer-checked:bg-blue-600"></div>
                </label>
            )}
            {type === "date" && (
                <input
                    type={type}
                    disabled={disabled}
                    name={name || "username"}
                    value={value && value}
                    placeholder={placeholder || "Input something here..."}
                    className={`block text-body p-[12px] border-muted-line border-[0.5px] w-full rounded-lg mt-1 dark:bg-gray-700 dark:text-white dark:placeholder-text-white ${className} ${disabled && 'cursor-not-allowed  '}`}
                />
            )}
            {type === "time" && (
                <input
                    type={type}
                    disabled={disabled}
                    name={name || "username"}
                    value={value && value}
                    placeholder={placeholder || "Input something here..."}
                    className={`block text-body p-[12px] border-muted-line border-[0.5px] w-full rounded-lg mt-1 dark:bg-gray-700 dark:text-white dark: placeholder:text-white ${className} ${disabled && 'cursor-not-allowed  '}`}
                />
            )}
            {type === "select" && onChange && (
                <select
                    id="countries"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary w-full col-span-3 p-2.5 dark:bg-light dark:border-dark dark:placeholder-dark dark:text-dark dark:focus:ring-primary dark:focus:border-primary"
                    value={value}
                    name={name}
                    onChange={onChange}
                >
                    {options &&
                        options.map((option: OptionType, key: number) => (
                            <option className="w-full" value={option.value} key={key}>
                                {option.name}
                            </option>
                        ))}
                </select>
            )}
            {type === "select" && !onChange && (
                <select
                    id="countries"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary w-full col-span-3 p-2.5 dark:bg-light dark:border-dark dark:placeholder-dark dark:text-dark dark:focus:ring-primary dark:focus:border-primary"
                    value={value}
                    name={name}
                    onChange={onChange}
                >
                    {options &&
                        options.map((option: OptionType, key: number) => (
                            <option className="w-full" value={option.value} key={key}>
                                {option.name}
                            </option>
                        ))}
                </select>
            )}
            {type !== "switch" && type !== "textarea" && type !== "select" && type !== 'date' && type !== 'time' && onChange && (
                <input
                    type={type}
                    name={name || "username"}
                    placeholder={placeholder || "Input something here..."}
                    className={`block text-body text-semidark p-[12px] border-muted-line border-[0.5px] w-full rounded-lg mt-1 dark:bg-light dark:text-dark ${className} `}
                    onChange={onChange}
                    value={value}
                    disabled={disabled}
                />
            )}
            {type !== "switch" && type !== "textarea" && type !== "select" && type !== 'date' && type !== 'time' && !onChange && (
                <input
                    type={type}
                    disabled={disabled}
                    name={name || "username"}
                    // value={value && value}
                    placeholder={placeholder || "Input something here..."}
                    className={`block text-body text-semidark p-[12px] border-muted-line border-[0.5px] w-full rounded-lg mt-1 dark:bg-light dark:text-dark ${className} ${disabled && 'cursor-not-allowed  '}`}
                />
            )}
        </>
    );
}
