import { createContext, useReducer, useEffect } from "react";

import { ChildrenElementProp, Question, QuestionsReducerActionTypes, QuestionsContextTypes } from "../types";

const reducer = (state: Question[], action: QuestionsReducerActionTypes) => {
    switch (action.type) {
        case 'setData':
            return action.data;
        case 'addQuestion':
            return [...state, action.newQuestion];
        case 'editQuestion':
            return state.map(q =>
                q._id === action.updatedQuestion._id
                    ? { ...q, ...action.updatedQuestion }
                    : q);
        case 'deleteQuestion':
            return state.filter(q => q._id !== action._id);
        default:
            return state;
    }
}

const QuestionsContext = createContext<QuestionsContextTypes | undefined>(undefined);

const QuestionsProvider = ({ children }: ChildrenElementProp) => {

    const [questions, dispatch] = useReducer(reducer, []);

    const fetchData = () => {
        fetch(`http://localhost:5500/questions`)
            .then(res => res.json())
            .then((data: Question[]) => {
                dispatch({
                    type: 'setData',
                    data
                })
            })
    };

    const fetchFiltered = async (filters?: {
        answered?: "true" | "false";
        sortBy?: "createDate" | "answerCount";
        order?: "asc" | "desc";
        category?: string;
        title?: string;
    }) => {
        try {
            const queryParams = new URLSearchParams();

            if (filters?.answered !== undefined) {
                queryParams.append("answered", filters.answered);
            }
            if (filters?.sortBy) {
                queryParams.append("sortBy", filters.sortBy);
            }
            if (filters?.order) {
                queryParams.append("order", filters.order);
            }
            if (filters?.category) {
                queryParams.append("category", filters.category);
            }
            if (filters?.title) {
                queryParams.append("title", filters.title);
            }

            const res = await fetch(`http://localhost:5500/questions?${queryParams.toString()}`);
            const data: Question[] = await res.json();
            dispatch({
                type: 'setData',
                data
            });
            return data;
        } catch (err) {
            console.error("Failed to fetch filtered questions:", err);
        }
    };

    const addQuestion = (newQ: Question) => {
        dispatch({
            type: 'addQuestion',
            newQuestion: newQ
        })
    };

    const editQuestion = (updatedQ: Partial<Question> & { _id: string }) => {
        dispatch({
            type: 'editQuestion',
            updatedQuestion: updatedQ
        })
    };

    const deleteQuestion = (_id: string) => {
        dispatch({
            type: 'deleteQuestion',
            _id
        })
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <QuestionsContext.Provider
            value={{
                questions,
                dispatch,
                addQuestion,
                editQuestion,
                deleteQuestion,
                fetchData,
                fetchFiltered
            }}>
            {children}
        </QuestionsContext.Provider>
    );
};

export { QuestionsProvider };
export default QuestionsContext;