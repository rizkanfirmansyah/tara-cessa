"use client";
import React, { useEffect } from "react";
import { FeedbackAnswerType } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

interface FeedbackRowProps {
    index: number;
    feedback: FeedbackAnswerType;
    onClick?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const FeedbackRow = ({ index, feedback }: FeedbackRowProps) => {
    const renderStars = (rating: string) => {
        const numStars = Math.round(parseFloat(rating));
        const starsArray = [];

        for (let i = 0; i < numStars; i++) {
            starsArray.push(<FontAwesomeIcon icon={faStar} className="text-warning" key={i} />);
        }

        return starsArray;
    };
    return (
        <tr className={`dark:bg-gray-700 dark:text-light text-muted text-start border-b-[1px] border-light hover:bg-primary dark:hover:bg-gray-700 px-4 hover:text-light rounded transition-all duration-300 `}>
            <td className="py-2 w-[1px]">{index}</td>
            <td className="py-2 flex justify-start">
                <p>{feedback.hotelId}</p>
            </td>
            <td className="py-2 ">{feedback.roomId}</td>
            <td className="py-2 ">{feedback.questionId}</td>
            <td className="py-2 ">{feedback.answer}</td>
        </tr>
    );
};

export default FeedbackRow;
