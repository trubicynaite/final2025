import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import styled from "styled-components";

import UsersContext from "../../contexts/UsersContext";
import { Question, QuestionsContextTypes, UserContextTypes } from "../../types";
import QuestionsContext from "../../contexts/QuestionsContext";

const EditQuestionPage = styled.section`
  max-width: 700px;
  margin: 40px auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  >label {
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  >input, select, textarea {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border-radius: 6px;
    border: 1px solid #ccc;
  }
  
  >button {
    max-width: 150px;
    padding: 10px;
    margin-top: 20px;
    background-color: #EB88CA;
    color: #fff;
    font-weight: bold;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    
    &:hover {
      background-color: #d36da8;
    }
  }

  .error {
    color: red;
    font-weight: bold;
  }
`;

const EditQuestion = () => {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { loggedInUser } = useContext(UsersContext) as UserContextTypes;
    const { editQuestion } = useContext(QuestionsContext) as QuestionsContextTypes;

    const [question, setQuestion] = useState<Question | null>(null);
    const [category, setCategory] = useState("");
    const [questionHeader, setQuestionHeader] = useState("");
    const [questionText, setQuestionText] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchQuestion = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:5500/questions/${id}`);
                if (!res.ok) throw new Error("Failed to fetch question.");

                const data: Question = await res.json();
                setQuestion(data);
                setCategory(data.category);
                setQuestionHeader(data.questionHeader);
                setQuestionText(data.questionText);
            } catch (err) {
                alert("Could not load the question.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestion();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!loggedInUser) {
            setError("You must be logged in to edit a question.");
            return;
        }

        if (!category || !questionHeader || !questionText) {
            setError("All fields are required.");
            return;
        }

        try {
            const token = localStorage.getItem("accessJWT") || sessionStorage.getItem("accessJWT");
            if (!token) {
                setError("Authentication token missing. Please log in again.");
                return;
            }

            const res = await fetch(`http://localhost:5500/questions/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    category,
                    questionHeader,
                    questionText,
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to update question.");
            }

            const updatedQuestion = await res.json();

            editQuestion(updatedQuestion);

            navigate(`/questions/${id}`);
        } catch (err) {
            alert("Could not load the question.");
            console.error(err);
        }
    };

    if (loading) return <p>Loading question data...</p>;
    if (error) return <p className="error">{error}</p>;
    if (!question) return <p>Question not found.</p>;

    return (
        <EditQuestionPage>
            <h2>Edit Question</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="">--Select category--</option>
                    <option value="face">Face</option>
                    <option value="eyes">Eyes</option>
                    <option value="eyebrows">Eyebrows</option>
                    <option value="lips">Lips</option>
                </select>

                <label htmlFor="header">Question Header</label>
                <input
                    id="header"
                    type="text"
                    value={questionHeader}
                    onChange={(e) => setQuestionHeader(e.target.value)}
                    required
                />

                <label htmlFor="text">Question Text</label>
                <textarea
                    id="text"
                    rows={6}
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    required
                />

                {error && <p className="error">{error}</p>}

                <button type="submit">Save Changes</button>
            </form>
        </EditQuestionPage>
    );
};

export default EditQuestion;
