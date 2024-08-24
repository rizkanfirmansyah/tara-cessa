import { InputBox, Label } from "@/components";

interface InputColorProps {
    label: string;
    htmlFor?: string;
    name?: string;
    placeholder?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value?: any;
    className?: string;
}

export default function InputColor({ label, htmlFor, name, placeholder, onChange, value, className }: InputColorProps) {
    return (
        <div className={`${className} grid grid-cols-4 items-center`}>
            <Label title={label} htmlFor={htmlFor} />
            <div className="flex w-full col-span-3">
                <div className="w-10 h-auto mt-1" style={{ backgroundColor: `${value}` }}></div>
                <InputBox type="text" name={name} value={value} onChange={onChange} placeholder={placeholder} className="rounded-tl-none rounded-bl-none rounded-tr-lg rounded-br-lg" />
            </div>
        </div>
    );
}
