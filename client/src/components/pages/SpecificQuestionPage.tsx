import styled from "styled-components";
import { useNavigate, useParams } from "react-router";
import { useContext, useEffect, useState } from "react";

import { Question, UserContextTypes } from "../../types";
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
    const navigate = useNavigate();

    const { loggedInUser } = useContext(UsersContext) as UserContextTypes;

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const res = await fetch(`http://localhost:5500/questions/${id}`);
                const data = await res.json();
                setQuestion(data);
            } catch (error) {
                console.error('Failed to fetch question:', error);
                setQuestion(null);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestion();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!question) return <p>Question not found.</p>;

    const handleEdit = () => {
        navigate(`/edit/${question._id}`);
    };

    return (
        <StyledQuestionPage>
            <h2>{question.questionHeader}</h2>
            <p className="creator">Created by: {question.creatorUsername} | Date: {question.createDate}</p>
            <p>{question.questionText}</p>

            {loggedInUser?._id === question.creatorId && (
                <button className="edit-btn" onClick={handleEdit}>Edit Question</button>
            )}
        </StyledQuestionPage>
    );
}

export default SpecificQuestionPage;