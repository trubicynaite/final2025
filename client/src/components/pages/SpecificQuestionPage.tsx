import styled from "styled-components";
import { useNavigate, useParams } from "react-router";
import { useContext, useEffect, useState } from "react";

import { Question, UserContextTypes, Answer } from "../../types";
import UsersContext from "../../contexts/UsersContext";
import ConfirmModal from "../UI/atoms/ConfirmationModal";

const StyledQuestionPage = styled.section`
    max-width: 100%;
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

button.edit {
        display: block;
        margin: 20px auto 0;
        padding: 10px 18px;
        background-color: #f3aadb;
        border: none;
        color: #87085D;
        font-size: 15px;
        border-radius: 6px;
        cursor: pointer;

        &:hover {
        background-color: #e97fc3;
        }
  }
  
  >h3 {
    margin-top: 40px;
    color: #EB88CA;
  }

  >div.answer {
    background-color: transparent;
    border: 1px solid #f3aadb;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    position: relative;

    >p {
      margin: 0 0 8px 0;
      font-size: 15px;
    }

   >p.creator {
      font-size: 13px;
      color: #b673aa;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;

      >span.edit-link {
        color: #f3aadb;
        cursor: pointer;
        text-decoration: underline;
        margin-left: 10px;

        &:hover {
          color: #e97fc3;
        }
      }

      >button.delete {
        background: none;
        border: none;
        color: #f3aadb;
        cursor: pointer;
        margin-left: 10px;
        padding: 0;
        text-decoration: underline;

        &:hover {
          color: #e97fc3;
        }
      }
    }
  }

  >form {
    max-width: 100%;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
  }

  >textarea {
    width: 100%;
    min-height: 100px;
    padding: 10px;
    font-size: 15px;
    border-radius: 6px;
    border: 1px solid #f3aadb;
    resize: vertical;

    &:focus {
      outline: none;
      border-color: #eb88ca;
      box-shadow: 0 0 5px #eb88ca;
    }
  }

  >form{
    >div.formBtn{
    margin-top: 10px;
    display: flex;
    gap: 10px;
    justify-content: flex-end;

    >button{
    background-color: #f3aadb;
    border: none;
    color: #87085d;
    font-size: 15px;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
    background-color: #e97fc3;
  }
    }

    >button[type="button"] {
    background-color: transparent;
    border: 1px solid #f3aadb;
    color: #f3aadb;

    &:hover {
    background-color: #e97fc3;
    color: #87085d;
    }
    }
  }
}

>form.edit-answer-form {
  max-width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;

  >textarea {
    width: 100%;
    min-height: 150px;
    background-color: transparent;
    padding: 10px;
    font-size: 15px;
    border-radius: 6px;
    border: 1px solid #f3aadb;
    resize: vertical;

    &:focus {
      outline: none;
      border-color: #eb88ca;
      box-shadow: 0 0 5px #eb88ca;
    }
  }

  >div.formBtn {
    margin-top: 10px;
    display: flex;
    gap: 10px;
    justify-content: flex-end;

    >button {
      background-color: #f3aadb;
      border: none;
      color: #87085d;
      font-size: 15px;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #e97fc3;
      }
    }

    >button[type="button"] {
      background-color: transparent;
      border: 1px solid #f3aadb;
      color: #f3aadb;

      &:hover {
        background-color: #e97fc3;
        color: #87085d;
      }
    }
  }
}

@media (min-width: 575px) {
  max-width: 1000px;
  margin: 0 auto;

  > form,
  > form.edit-answer-form,
  > textarea,
  > div.answer {
    max-width: 100%;
  }

  > textarea {
    min-height: 150px;
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
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ type: "question" | "answer"; id?: string } | null>(null);

    const navigate = useNavigate();

    const { loggedInUser } = useContext(UsersContext) as UserContextTypes;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const questionRes = await fetch(`http://localhost:5500/questions/${id}`);
                const questionData = await questionRes.json();

                if (!questionData?._id) {
                    setQuestion(null);
                    setAnswers([]);
                } else {
                    setQuestion(questionData);
                    const answersRes = await fetch(`http://localhost:5500/questions/${id}/answers`);
                    const answersData = await answersRes.json();
                    setAnswers(answersData);
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                setQuestion(null);
                setAnswers([]);
            } finally {
                setLoading(false);
            }
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
        } finally {
            setSave(false);
        }
    };

    const confirmDeleteQuestion = () => {
        setDeleteTarget({ type: "question" });
        setModalOpen(true);
    };

    const confirmDeleteAnswer = (answerId: string) => {
        setDeleteTarget({ type: "answer", id: answerId });
        setModalOpen(true);
    };

    const handleConfirm = async () => {
        if (!deleteTarget) return;

        if (deleteTarget.type === "question") {
            try {
                const token = localStorage.getItem("accessJWT");
                const res = await fetch(`http://localhost:5500/questions/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    navigate("/questions", { state: { refresh: true } });
                } else {
                    const errorData = await res.json();
                    alert(`Failed to delete question: ${errorData.error}`);
                }
            } catch (err) {
                console.error(err);
            }
        }
        if (deleteTarget.type === "answer" && deleteTarget.id) {
            try {
                const token = localStorage.getItem("accessJWT");
                const res = await fetch(`http://localhost:5500/answers/${deleteTarget.id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    alert("Answer deleted successfully.");
                    setAnswers((prev) => prev.filter((a) => a._id !== deleteTarget.id));
                } else {
                    const errorData = await res.json();
                    alert(`Failed to delete answer: ${errorData.error}`);
                }
            } catch (err) {
                console.error(err);
            }
        }

        setModalOpen(false);
        setDeleteTarget(null);
    };

    const handleCancel = () => {
        setModalOpen(false);
        setDeleteTarget(null);
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
                    <button className="delete" onClick={confirmDeleteQuestion}>Delete Question</button>
                </div>
            )}
            <h3>Answers:</h3>
            {question && answers.length ?
                answers.map((answer) => {
                    const isAuthor = answer.creatorId === question.creatorId;
                    const isCurrentUser = loggedInUser?._id === answer.creatorId;
                    return (
                        <div key={answer._id} className="answer">
                            <p className="creator">
                                Answered by:{" "}
                                {isAuthor ? (
                                    <span style={{ marginLeft: "10px", color: "#EB88CA" }}>
                                        Author
                                    </span>
                                ) : (
                                    <span style={{ marginLeft: "10px", color: "#555" }}>
                                        {answer.creatorUsername}
                                    </span>
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
                                            onClick={() => confirmDeleteAnswer(answer._id)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </p>
                            <p>{answer.answerText}</p>
                            <p className="creator" style={{ fontSize: '13px', color: '#b673aa', marginTop: '5px' }}>
                                Created at: {new Date(answer.createDate).toLocaleString()}
                                {answer.lastEdited && (
                                    <> | Edited at: {new Date(answer.lastEdited).toLocaleString()}</>
                                )}
                            </p>
                        </div>

                    );
                }) :
                <p>No answers yet.</p>
            }

            {!answerForm ? (
                <button
                    className="edit"
                    onClick={() => {
                        if (!loggedInUser) {
                            navigate("/login");
                        } else {
                            setAnswerForm(true);
                        }
                    }}
                >
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
                    <div className="formBtn">
                        <button type="submit">Publish answer</button>
                        <button type="button" onClick={() => setAnswerForm(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {editAnswer && (
                <form
                    className="edit-answer-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        saveAnswer();
                    }}
                >
                    <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        placeholder="Edit your answer here..."
                        rows={4}
                    />
                    <div className="formBtn">
                        <button type="submit" disabled={save}>
                            {save ? "Saving..." : "Save"}
                        </button>
                        <button type="button" onClick={() => setEditAnswer(null)}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}


            <ConfirmModal
                isOpen={modalOpen}
                title="Confirm Delete"
                message={`Are you sure you want to delete this ${deleteTarget?.type}?`}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </StyledQuestionPage>
    );
}

export default SpecificQuestionPage;