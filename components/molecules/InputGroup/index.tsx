import { InputBox, Label } from "@/components";
import { OptionType } from "@/types";

interface InputGroupProps {
    label: string;
    htmlFor?: string;
    type: string;
    name?: string;
    placeholder?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeSelect?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    value?: any;
    className?: string;
    theme?: string;
    checked?: boolean;
    disabled?: boolean;
    options?: OptionType[];
}

export default function InputGroup({ label, htmlFor, type, name, placeholder, onChange, value, className, theme, options, checked, disabled, onChangeSelect }: InputGroupProps) {
    return theme == "horizontal" ? (
        <div className={`grid grid-cols-4 items-center ${className}`}>
            <Label title={label} htmlFor={htmlFor} />
            <InputBox className="col-span-3" type={type} options={options} checked={checked} name={name} value={value} onChange={onChange ?? onChangeSelect} placeholder={placeholder} disabled={disabled} />
        </div>
    ) : (
        <div className={className}>
            <Label title={label} htmlFor={htmlFor} />
            <InputBox type={type} options={options} checked={checked} name={name} value={value} onChange={onChange ?? onChangeSelect} placeholder={placeholder} disabled={disabled} />
        </div>
    );
}
