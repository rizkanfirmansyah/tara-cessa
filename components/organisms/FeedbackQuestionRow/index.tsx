"use client";
import { Button } from "@/components";
import { FeedbackQuestionType } from "@/types";
import { faEdit, faStar, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface FeedbackRowProps {
    index: number;
    feedbackQuestion: FeedbackQuestionType;
    onClick?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const FeedbackQuestionRow = ({ index, feedbackQuestion, onClick, onDelete, onEdit }: FeedbackRowProps) => {
    return (
        <tr className={`dark:bg-gray-700 dark:text-light text-muted text-start border-b-[1px] border-light hover:bg-primary dark:hover:bg-gray-700 px-4 hover:text-light rounded transition-all duration-300 `}>
            <td className="py-2 w-[1px]">{index}</td>
            <td className="py-2">{feedbackQuestion.hotelId}</td>
            <td className="py-2 ">{feedbackQuestion.question}</td>
            <td className="py-2 space-x-2">
                <Button theme="warning" onClick={onEdit}>
                    <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button theme="danger" onClick={onDelete}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
            </td>
        </tr>
    );
};

export default FeedbackQuestionRow;
