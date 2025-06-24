import styled from "styled-components";
import { useContext } from "react";
import { useNavigate } from "react-router";

import UsersContext from "../../../contexts/UsersContext";
import { Question, UserContextTypes } from "../../../types";

type Props = {
    data: Question
}

const StyledCard = styled.div`
    text-align: center;
    border: 2px solid #f3aadb;
    color: #f3aadb;
    padding: 20px;
    margin: 20px auto;
    border-radius: 12px;
    width: 90%;
    max-width: 900px;

    display: flex;
    flex-direction: column;
    gap: 10px;

    > h3 {
        font-size: 24px;
        margin: 0;
        color: #f3aadb;
        text-decoration: underline;
    }

    > h6 {
        font-size: 14px;
        color: #b7b7b7;
        margin: 0;
    }

    > h5 {
        font-size: 14px;
        color: #f3aadb;
        margin: 0;
    }

    > p {
        margin: 0;
    }

    >div.bottom{
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-top: 10px;

    >div.likes{
        color: #b7b7b7;
        font-size: 15px;
        display: flex;
        gap: 16px;
    }

    >div.actions {
        margin-top: 15px;
        display: flex;
        gap: 10px;
        flex-direction: column;

        > button {
            background-color: transparent;
            border: 1px solid #f3aadb;
            color: #f3aadb;
            padding: 6px 12px;
            font-size: 15px;
            border-radius: 6px;
            cursor: pointer;
            transition: 0.3s ease;

            &:hover {
                background-color: #f3aadb;
                color: #87085D;
            }
        }
        @media(min-width: 575px){
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;

            >button{
                width: auto;
                min-width: 120px;
            }
        }
    }
 }
`;

const QuestionCard = ({ data }: Props) => {

    const { loggedInUser } = useContext(UsersContext) as UserContextTypes;
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/edit/${data._id}`);
    };

    const handleViewAnswers = () => {
        navigate(`/questions/${data._id}`);
    };

    return (
        <StyledCard>
            <h6>Created by: {data.creatorUsername}. Created: {" "}{new Date(data.createDate).toLocaleString()}</h6>
            <h5>Category: {data.category}</h5>
            <h3>{data.questionHeader}</h3>
            <p>{data.questionText}</p>
            {
                data.lastEdited && (
                    <h6>Edited on: {new Date(data.lastEdited).toLocaleString()}</h6>)
            }
            <div className="bottom">
                <div className="likes">
                    <p>Likes: {data.likeCount}</p>
                    <p>Dislikes: {data.dislikeCount}</p>
                    <p>Answers: {data.answerCount}</p>
                </div>
                <div className="actions">
                    {loggedInUser?._id === data.creatorId && (
                        <button onClick={handleEdit}>Edit question</button>
                    )}
                    <button onClick={handleViewAnswers}>View Answers</button>
                </div>
            </div>
        </StyledCard>
    );
}

export default QuestionCard;