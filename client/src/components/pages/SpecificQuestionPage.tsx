import styled from "styled-components";
import { useNavigate, useParams } from "react-router";
import { useContext, useEffect, useState } from "react";

import { Question, UserContextTypes, Answer } from "../../types";
import UsersContext from "../../contexts/UsersContext";

const StyledQuestionPage = styled.section`
    max-width: 700px;
    margin: 40px auto;
    padding: 20px;

    >h2 {
    font-size: 28px;
    margin-bottom: 15px;
    color: #EB88CA;
    text-align: center;
    text-decoration: underline;
  }

  >p {
    font-size: 16px;
    margin: 8px 0;
  }

  >div.creator {
    font-size: 14px;
    color: #aaa;
    margin-bottom: 20px;
    text-align: center;
  }

    >div.buttons{

    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 20px;

    >button.edit {
        display: block;
        margin: 20px auto 0;
        padding: 10px 18px;
        background-color: #f3aadb;
        border: none;
        color: #87085D;
        font-weight: bold;
        font-size: 15px;
        border-radius: 6px;
        cursor: pointer;

        &:hover {
        background-color: #e97fc3;
        }
  }
  >button.delete {
        display: block;
        margin: 20px auto 0;
        padding: 10px 18px;
        background-color: transparent;
        border: 1px solid #f3aadb;
        color: #f3aadb;
        font-weight: bold;
        font-size: 15px;
        border-radius: 6px;
        cursor: pointer;

        &:hover {
        background-color: #e97fc3;
        }
  }
  }
`;

const SpecificQuestionPage = () => {

    const { id } = useParams<{ id: string }>();
    const [question, setQuestion] = useState<Question | null>(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [editAnswer, setEditAnswer] = useState<Answer | null>(null);
    const [editText, setEditText] = useState('');
    const [save, setSave] = useState(false);
    const [answerText, setAnswerText] = useState("");
    const [answerForm, setAnswerForm] = useState(false);

    const navigate = useNavigate();

    const { loggedInUser } = useContext(UsersContext) as UserContextTypes;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const questionRes = await fetch(`http://localhost:5500/questions/${id}`);
            const questionData = await questionRes.json();
            setQuestion(questionData);

            const answersRes = await fetch(`http://localhost:5500/questions/${id}/answers`);
            const answersData = await answersRes.json();
            setAnswers(answersData);
            setLoading(false);
        };
        fetchData();
    }, [id]);

    const startEditingAnswer = (answer: Answer) => {
        setEditAnswer(answer);
        setEditText(answer.answerText);
    };

    const saveAnswer = async () => {
        if (!editAnswer) return;
        setSave(true);
        try {
            const res = await fetch(`http://localhost:5500/answers/${editAnswer._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessJWT")}`,
                },
                body: JSON.stringify({ answerText: editText }),
            });

            const updated = await res.json();

            setAnswers((prev) =>
                prev.map((a) => (a._id === updated._id ? updated : a))
            );
            setEditAnswer(null);
            setEditText("");
        } catch (err) {
            console.error("Error saving answer:", err);
            alert("Could not save answer.");
        } finally {
            setSave(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this question?");
        if (!confirmed) return;

        try {
            const token = localStorage.getItem("accessJWT");

            const res = await fetch(`http://localhost:5500/questions/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                alert("Question deleted successfully.");
                navigate("/questions");
            } else {
                const errorData = await res.json();
                alert(`Failed to delete question: ${errorData.error}`);
            }
        } catch (err) {
            alert("Something went wrong while deleting the question.");
            console.error(err);
        }
    };

    const deleteAnswer = async (answerId: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this answer?");
        if (!confirmed) return;

        try {
            const token = localStorage.getItem("accessJWT");

            const res = await fetch(`http://localhost:5500/answers/${answerId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                alert("Answer deleted successfully.");
                setAnswers((prev) => prev.filter((a) => a._id !== answerId));
            } else {
                const errorData = await res.json();
                alert(`Failed to delete answer: ${errorData.error}`);
            }
        } catch (err) {
            alert("Something went wrong while deleting the answer.");
            console.error(err);
        }
    };


    if (loading) return <p>Loading...</p>;
    if (!question) return <p>Question not found.</p>;

    return (
        <StyledQuestionPage>
            <h2>{question.questionHeader}</h2>
            <div className="creator">
                <p>Created by: {question.creatorUsername}</p>
                <p>Created: {" "}{new Date(question.createDate).toLocaleString()}</p>
                {
                    question.lastEdited && (
                        <p className="creator">Edited on: {new Date(question.lastEdited).toLocaleString()}</p>)
                }
            </div>


            <p>{question.questionText}</p>

            {loggedInUser?._id === question.creatorId && (
                <div className="buttons">
                    <button className="edit" onClick={() => navigate(`/edit/${id}`)}>Edit Question</button>
                    <button className="delete" onClick={handleDelete}>Delete Question</button>
                </div>
            )}

            <h3>Answers:</h3>
            {question && answers.length ?
                answers.map((answer) => {
                    const isAuthor = answer.creatorId === question.creatorId;
                    const isCurrentUser = loggedInUser?._id === answer.creatorId;
                    return (
                        <div key={answer._id} className="answer">
                            <p>{answer.answerText}</p>
                            <p className="creator">
                                By user: {answer.creatorUsername}
                                {isAuthor && <strong style={{ marginLeft: "10px", color: "#EB88CA" }}> (answered by author)</strong>}
                                {" on "}{new Date(answer.createDate).toLocaleString()}

                                {answer.lastEdited && (
                                    <span> (edited on {new Date(answer.lastEdited).toLocaleString()})</span>
                                )}

                                {isCurrentUser && (
                                    <>
                                        <span
                                            className="edit-link"
                                            onClick={() => startEditingAnswer(answer)}
                                            style={{ cursor: "pointer", marginLeft: "10px", color: "#f3aadb" }}
                                        >
                                            Edit
                                        </span>
                                        <button
                                            className="delete"
                                            style={{ cursor: "pointer", marginLeft: "10px", color: "#f3aadb" }}
                                            onClick={() => deleteAnswer(answer._id)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </p>
                        </div>
                    );
                }) :
                <p>No answers yet.</p>
            }

            {loggedInUser && (
                <>
                    {!answerForm ? (
                        <button className="edit" onClick={() => setAnswerForm(true)}>
                            Answer question
                        </button>
                    ) : (
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    const token = localStorage.getItem("accessJWT");
                                    const res = await fetch(`http://localhost:5500/questions/${id}/answers`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${token}`,
                                        },
                                        body: JSON.stringify({ answerText: answerText }),
                                    });
                                    const { answer: createdAnswer } = await res.json();
                                    setAnswers((prev) => [...prev, createdAnswer]);
                                    setAnswerText("");
                                    setAnswerForm(false);
                                } catch (err) {
                                    console.error("Failed to post answer", err);
                                    alert("Could not post answer.");
                                }
                            }}
                        >
                            <textarea
                                value={answerText}
                                onChange={(e) => setAnswerText(e.target.value)}
                                rows={4}
                                placeholder="Write your answer here..."
                            />
                            <button type="submit">Publish Answer</button>
                            <button type="button" onClick={() => setAnswerForm(false)}>
                                Cancel
                            </button>
                        </form>
                    )}
                </>
            )}

            {editAnswer && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        saveAnswer();
                    }}
                >
                    <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                    />
                    <button type="submit" disabled={save}>
                        {save ? "Saving..." : "Save"}
                    </button>
                    <button type="button" onClick={() => setEditAnswer(null)}>
                        Cancel
                    </button>
                </form>
            )}

        </StyledQuestionPage>
    );
}

export default SpecificQuestionPage;