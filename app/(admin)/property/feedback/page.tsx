"use client";
import { MetaContext } from "@/app/MetaProvider";
import { ButtonActions, Card, CardChart, InputGroup, Modal } from "@/components";
import FeedbackQuestionRow from "@/components/organisms/FeedbackQuestionRow";
import FeedbackRow from "@/components/organisms/FeedbackRow";
import { useFeedbackAnswerStore } from "@/components/store/feedbackStore";
import { useHotelStore } from "@/components/store/hotelStore";
import fetchCustom from "@/helpers/FetchCustom";
import setFormEmpty from "@/helpers/FormInputCustom/empty";
import { userSession } from "@/helpers/UserData";
import { FeedbackAnswerType, FeedbackQuestionType } from "@/types";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FormEvent, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function FeedbackPage() {
    const { updateTitle } = useContext(MetaContext);
    const [question, setQuestion] = useState("");
    const [questionID, setQuestionID] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [update, setUpdate] = useState(false);
    const [dataFeedbackQuestion, setdataFeedbackQuestion] = useState<FeedbackQuestionType[] | []>([]);
    const [modal, setModal] = useState(false);
    const [page, setPage] = useState("answers");
    const hotelID = useHotelStore((state) => state.hotelID);
    const dataFeedbackAnswer = useFeedbackAnswerStore((state) => state.data);
    const updateData = useFeedbackAnswerStore((state) => state.updateData);
    const datas = useFeedbackAnswerStore((state) => state.dataQuestion);
    const updateDataQuestion = useFeedbackAnswerStore((state) => state.updateDataQuestion);
    let user = userSession;
    let bearerToken = user?.token ?? "";

    useEffect(() => {
        updateTitle("Feedback Page");
        return () => {
            updateTitle("Dashboard");
        };
    }, [updateTitle]);

    useEffect(() => {
        getData();
        getDataQuestions();
    }, []);

    function searchQuestion(searchCriteria: string) {
        if (datas) {
            const res: FeedbackQuestionType[] = datas.filter(quest =>
                (searchCriteria ? quest.question.toLowerCase().includes(searchCriteria.toLowerCase()) : true)
            );
            setdataFeedbackQuestion(res);
        }
    }

    const getData = () => {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/feedbackAnswer`, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error("Error fteching");
                } else {
                    updateData(result.data.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const getDataQuestions = () => {
        fetchCustom<any>(`${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/feedbackQuestion`, bearerToken)
            .then((result) => {
                if (result.error) {
                    throw new Error("Error fteching");
                } else {
                    updateDataQuestion(result.data.data);
                    setdataFeedbackQuestion(result.data.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const onEdit = (feedbackQuestion: FeedbackQuestionType) => {
        setModal(true);
        setUpdate(true);
        setQuestionID(feedbackQuestion.id);
        setQuestion(feedbackQuestion.question);
    };

    const handleSubmit = () => {
        const data = JSON.stringify({
            hotelID: hotelID,
            question: question,
        });

        let url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/feedbackQuestion`;
        if (questionID && questionID > 0) {
            url += "/" + questionID;
        }

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);

        const requestOptions = {
            method: questionID ? "PUT" : "POST",
            headers: myHeaders,
            body: data,
        };

        setIsLoading(true);
        fetch(url, requestOptions)
            .then(async (response) => {
                const data = await response.json();
                return data;
            })
            .then((result) => {
                if (result.response_code > 0) {
                    throw new Error("500 Server Error");
                }
                getDataQuestions();
                setModal(false);
            })
            .catch((error) => console.error(error))
            .finally(() => {
                setIsLoading(false);
            });
    };

    const deleteFeedbackQuestion = async (id: number) => {
        const url = `${process.env.NEXT_PUBLIC_URL}/hotels/${hotelID}/feedbackQuestion/${id}/delete`;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + bearerToken);

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
        };

        if (result.isConfirmed) {
            fetch(url, requestOptions)
                .then((response) => {
                    getDataQuestions();
                })
                .then((result) => {
                    Swal.fire("Deleted!", "Your item has been deleted.", "success");
                })
                .catch((error) => console.error(error));
        } else {
            Swal.fire("Cancelled", "Your item is safe :)", "info");
        }
    };

    return (
        <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
                {/* <CardChart icon={faStar} title="Service Quality Today" value="4.2" description="12 reviews" />
                <CardChart icon={faStar} up={true} theme="warning" title="Service Quality Monthly" value="4.5" description="80 reviews" /> */}
            </div>
            <div className="flex -mb-10">
                <div className={`w-max pt-3 rounded-xl cursor-pointer pb-6 px-12 ${page === "answers" ? "bg-primary dark:bg-slate-800 text-light" : "bg-white text-dark"}`} onClick={() => setPage("answers")}>
                    <h1 className="text-h6">Answers</h1>
                </div>
                <div className={`w-max pt-3 rounded-xl cursor-pointer pb-6 px-10 ${page === "questions" ? "bg-primary dark:bg-slate-800 text-light" : "bg-white text-dark"}`} onClick={() => setPage("questions")}>
                    <h1 className="text-h6">Questions</h1>
                </div>
            </div>

            {page === "answers" ? (
                <Card>
                    <h1 className="text-h5 font-semibold">Feedback Answers</h1>
                    <table className="w-full mt-5">
                        <thead>
                            <tr className="text-start border-b-[1px] text-muted dark:text-light border-light">
                                <td className="py-3 text-start font-medium">No.</td>
                                <td className="py-3 text-start font-medium">Hotel ID</td>
                                <td className="py-3 text-start font-medium">Room ID</td>
                                <td className="py-3 text-start font-medium">Question</td>
                                <td className="py-3 text-start font-medium">Answer</td>
                            </tr>
                        </thead>
                        <tbody>{dataFeedbackAnswer && dataFeedbackAnswer.map((feedback: FeedbackAnswerType, index: number) => <FeedbackRow key={feedback.id} index={index + 1} feedback={feedback} />)}</tbody>
                    </table>
                </Card>
            ) : (
                <Card>
                    <h1 className="text-h5 font-semibold">Feedback Questions</h1>
                    <ButtonActions
                        onClickAdd={() => {
                            setFormEmpty();
                            setModal(modal ? false : true);
                        }}
                        onClickRepeat={() => getDataQuestions()}
                        onSearch={(e) => searchQuestion(e.target.value)}
                    />
                    <table className="w-full mt-5">
                        <thead>
                            <tr className="text-start border-b-[1px] text-muted dark:text-light border-light">
                                <td className="py-3 text-start font-medium">No.</td>
                                <td className="py-3 text-start font-medium">Hotel ID</td>
                                <td className="py-3 text-start font-medium">Question</td>
                                <td className="py-3 text-start font-medium">Action</td>
                            </tr>
                        </thead>
                        <tbody>
                            {dataFeedbackQuestion &&
                                dataFeedbackQuestion.map((feedbackQuestion: FeedbackQuestionType, index: number) => (
                                    <FeedbackQuestionRow
                                        key={feedbackQuestion.id}
                                        index={index + 1}
                                        feedbackQuestion={feedbackQuestion}
                                        onEdit={() => onEdit(feedbackQuestion)}
                                        onDelete={() => {
                                            deleteFeedbackQuestion(feedbackQuestion.id);
                                        }}
                                    />
                                ))}
                        </tbody>
                    </table>
                </Card>
            )}

            <Modal
                title={update ? "Update Question" : "Insert Question"}
                show={modal}
                onClosed={() => {
                    setModal(modal ? false : true), setUpdate(false), setQuestionID(0);
                }}
                onSave={handleSubmit}
            >
                <InputGroup
                    theme="horizontal"
                    label={"Question"}
                    type={"text"}
                    name="question"
                    value={question}
                    onChange={(e) => {
                        setQuestion(e.target.value);
                    }}
                />
            </Modal>
        </div>
    );
}
