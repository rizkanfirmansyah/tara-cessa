import { Button, InputBox } from "@/components"
import { faPlus, faRepeat, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface ButtonActionsProps {
    onClickAdd?: any;
    onClickRepeat?: any;
    onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    valueSearch?: string;
}

export default function ButtonActions({ onClickAdd, onClickRepeat, onSearch, valueSearch }: ButtonActionsProps) {
    return (
        <div className="flex justify-between items-center mt-6">
            <div className="flex items-center w-2/3 mr-10">
                <InputBox type={"text"} className="inline" onChange={onSearch} />
                <FontAwesomeIcon icon={faSearch} className="w-6 text-h5 -ml-8 cursor-pointer" />
            </div>
            <div className="flex ml-10 mr-2 space-x-3">
                {onClickAdd && (
                    <Button theme="primary" onClick={onClickAdd}>
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                )}
                {onClickRepeat && (
                    <Button theme="secondary" onClick={onClickRepeat}>
                        <FontAwesomeIcon icon={faRepeat} />
                    </Button>
                )}
            </div>
        </div>
    )
}