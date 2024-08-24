import { FeedbackAnswerType, FeedbackQuestionType } from "@/types";
import { create } from "zustand";

interface FeedbackAnswerStoreType {
    data?: FeedbackAnswerType[];
    dataQuestion?: FeedbackQuestionType[];
    updateData: (newData: FeedbackAnswerType[]) => void;
    updateDataQuestion: (newData: FeedbackQuestionType[]) => void;
}

export const useFeedbackAnswerStore = create<FeedbackAnswerStoreType>((set) => ({
    data: [],
    dataQuestion: [],
    updateData: (newData: FeedbackAnswerType[]) => set({ data: newData }),
    updateDataQuestion: (newData: FeedbackQuestionType[]) => set({ dataQuestion: newData }),
}));
