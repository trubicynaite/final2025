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

  >p.creator {
    font-size: 14px;
    color: #aaa;
    margin-bottom: 20px;
    text-align: center;
  }

  >button.edit-btn {
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
`;

const SpecificQuestionPage = () => {

    const { id } = useParams<{ id: string }>();
    const [question, setQuestion] = useState<Question | null>(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [editAnswer, setEditAnswer] = useState<Answer | null>(null);
    const [editText, setEditText] = useState('');
    const [save, setSave] = useState(false);

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
                headers: { "Content-Type": "application/json" },
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

    if (loading) return <p>Loading...</p>;
    if (!question) return <p>Question not found.</p>;

    return (
        <StyledQuestionPage>
            <h2>{question.questionHeader}</h2>
            <p className="creator">Created by: {question.creatorUsername} | Date: {question.createDate}</p>
            <p>{question.questionText}</p>

            {loggedInUser?._id === question.creatorId && (
                <button className="edit-btn" onClick={() => navigate(`/edit/${id}`)}>Edit Question</button>
            )}

            <h3>Answers:</h3>
            {answers.length ?
                answers.map((answer) => (
                    <div key={answer._id} className="answer">
                        <p>{answer.answerText}</p>
                        <p className="creator">
                            By user ID: {answer.creatorUsername} on {answer.createDate}
                            {loggedInUser?._id === answer.creatorId && (
                                <span
                                    className="edit-link"
                                    onClick={() => startEditingAnswer(answer)}
                                >
                                    Edit
                                </span>
                            )}
                        </p>
                    </div>
                )) :
                <p>No answers yet.</p>
            }

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