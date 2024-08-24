interface FeedbackAnswerType {
    id: number;
    hotelId: number;
    roomId: number;
    questionId: number;
    answer: number;
    createdAt: string;
}

interface FeedbackQuestionType {
    id: number;
    hotelId: number;
    question: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export type { FeedbackAnswerType, FeedbackQuestionType };
