import styled from "styled-components";
import { useContext, useState } from "react";
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

    > div.bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        flex-wrap: wrap;
        gap: 10px;

  > div.left {
        display: flex;
        flex-direction: column;
        gap: 6px;

    > div.numbers {
        display: flex;
        gap: 16px;
        color: #b7b7b7;
        font-size: 15px;
    }

    > div.reactions {
      display: flex;
      gap: 10px;

      button {
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

        &.reacted {
          background-color: #f3aadb;
          color: #87085d;
        }
      }
    }
  }

  > div.actions {
    display: flex;
    flex-direction: column;
    gap: 10px;

    button {
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

    @media (min-width: 575px) {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;

      button {
        width: auto;
        min-width: 120px;
      }
    }
  }
}

`;

const QuestionCard = ({ data }: Props) => {

    const { loggedInUser, setLoggedInUser } = useContext(UsersContext) as UserContextTypes;
    const navigate = useNavigate();

    const [likeCount, setLikeCount] = useState(data.likeCount);
    const [dislikeCount, setDislikeCount] = useState(data.dislikeCount);
    const [userLiked, setUserLiked] = useState(
        (loggedInUser?.likedQuestions ?? []).includes(data._id)
    );
    const [userDisliked, setUserDisliked] = useState(
        (loggedInUser?.dislikedQuestions ?? []).includes(data._id)
    );


    const handleReaction = async (reaction: "like" | "dislike") => {
        if (!loggedInUser) return;

        try {
            const response = await fetch(`http://localhost:5500/questions/${data._id}/reaction`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessJWT")}`,
                },
                body: JSON.stringify({ reaction }),
            });


            if (!response.ok) {
                throw new Error("Failed to update reaction");
            }

            const updatedQuestion = await response.json();

            setLikeCount(updatedQuestion.likeCount);
            setDislikeCount(updatedQuestion.dislikeCount);

            if (reaction === "like") {
                if (userLiked) {
                    setUserLiked(false);
                    loggedInUser.likedQuestions = loggedInUser.likedQuestions.filter((id) => id !== data._id);
                } else {
                    setUserLiked(true);
                    loggedInUser.likedQuestions.push(data._id);

                    if (userDisliked) {
                        setUserDisliked(false);
                        loggedInUser.dislikedQuestions = loggedInUser.dislikedQuestions.filter((id) => id !== data._id);
                    }
                }
            } else if (reaction === "dislike") {
                if (userDisliked) {
                    setUserDisliked(false);
                    loggedInUser.dislikedQuestions = loggedInUser.dislikedQuestions.filter((id) => id !== data._id);
                } else {
                    setUserDisliked(true);
                    loggedInUser.dislikedQuestions.push(data._id);

                    if (userLiked) {
                        setUserLiked(false);
                        loggedInUser.likedQuestions = loggedInUser.likedQuestions.filter((id) => id !== data._id);
                    }
                }
            }

            setLoggedInUser({ ...loggedInUser });
        } catch (error) {
            console.error(error);
            alert("Could not update reaction, please try again.");
        }
    };

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
                <div className="left">
                    <div className="numbers">
                        <p>Likes: {likeCount}</p>
                        <p>Dislikes: {dislikeCount}</p>
                        <p>Answers: {data.answerCount}</p>
                    </div>

                    {loggedInUser && (
                        <div className="reactions">
                            <button
                                className={userLiked ? "reacted" : ""}
                                onClick={() => handleReaction("like")}
                            >
                                {userLiked ? "Unlike" : "Like"}
                            </button>
                            <button
                                className={userDisliked ? "reacted" : ""}
                                onClick={() => handleReaction("dislike")}
                            >
                                {userDisliked ? "Remove Dislike" : "Dislike"}
                            </button>
                        </div>
                    )}
                </div>

                <div className="actions">
                    {loggedInUser?._id === data.creatorId && (
                        <button onClick={handleEdit}>Edit question</button>
                    )}
                    <button onClick={handleViewAnswers}>View Answers</button>
                </div>
            </div>
        </StyledCard >
    );
}

export default QuestionCard;