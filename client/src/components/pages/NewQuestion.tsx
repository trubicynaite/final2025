import { useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";

const StyledNewQuestion = styled.section`
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;

  >h2 {
    text-align: center;
    margin-bottom: 20px;
  }

  >form {
    display: flex;
    flex-direction: column;

    >label {
      margin-top: 10px;
      color: #eb88ca;
    }

    >input,
    textarea,
    select {
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #ccc;
      margin-top: 5px;
      font-size: 16px;
    }

    >button {
      margin-top: 20px;
      padding: 12px;
      background-color: #eb88ca;
      color: white;
      font-size: 15px;
      border: none;
      border-radius: 6px;
      cursor: pointer;

      &:hover {
        background-color: #d56db2;
      }
    }
  }
`;

const NewQuestion = () => {
  const [questionHeader, setQuestionHeader] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [category, setCategory] = useState("face");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newQuestion = {
      questionHeader,
      questionText,
      category
    };

    const token = localStorage.getItem("accessJWT");

    const res = await fetch("http://localhost:5500/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newQuestion),
    });

    if (res.ok) {
      const created = await res.json();
      navigate(`/questions/${created._id}`);
    } else {
      alert("Failed to create question.");
    }
  };

  return (
    <StyledNewQuestion>
      <h2>Ask a New Question</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="header">Question Title:</label>
        <input
          id="header"
          type="text"
          value={questionHeader}
          onChange={(e) => setQuestionHeader(e.target.value)}
          required
        />

        <label htmlFor="category">Select category:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="face">Face</option>
          <option value="eyes">Eyes</option>
          <option value="eyebrows">Eyebrows</option>
          <option value="lips">Lips</option>
        </select>

        <label htmlFor="text">Describe your question:</label>
        <textarea
          id="text"
          rows={5}
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required
        />

        <button type="submit">Post Question</button>
      </form>
    </StyledNewQuestion>
  );
};

export default NewQuestion;
