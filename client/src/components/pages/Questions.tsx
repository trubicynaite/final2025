import { useContext, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";

import QuestionsContext from "../../contexts/QuestionsContext";
import { QuestionsContextTypes } from "../../types";
import QuestionCard from "../UI/molecules/QuestionCard";

const StyledQuestions = styled.section`
    padding: 20px;
    text-align: center;
    min-height: calc(100vh - 80px - 80px);
    
    >h2{
    color: #EB88CA;
    font-size: 28px;
    margin-top: 10px;
    }

    .addQ{
    background-color: #87085D;
    color: white;
    border: none;
    padding: 10px 15px;
    font-size: 15px;
    border-radius: 6px;
    margin: 20px auto;
    display: block;
    cursor: pointer;

    &:hover {
     background-color: #d16db2;
        }
    }

    >form{
    margin-bottom: 25px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    >select, input {
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #ccc;
      font-size: 15px;
      width: 100%;
      box-sizing: border-box;
    }

    >label{
      text-align: left;
      font-size: 15px;
    }

    >button {
      padding: 12px;
      border-radius: 6px;
      border: none;
      background-color: #87085D;
      color: white;
      font-size: 15px;
      cursor: pointer;

      &:hover {
        background-color: #a51175;
      }
    }
    }

    @media (min-width: 575px) {
       >form {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 15px; 
    }

    >input,
      select {
        width: auto;
        min-width: 180px;
      }

      >label {
        font-size: 15px;
      }
}
`;

const Questions = () => {

    const { questions, fetchFiltered } = useContext(QuestionsContext) as QuestionsContextTypes;

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [answered, setAnswered] = useState("all");
    const [sortBy, setSortBy] = useState("createDate");
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 3;
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
    const totalPages = Math.ceil(questions.length / questionsPerPage);

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let answeredParam: "true" | "false" | undefined;
        if (answered === "answered") answeredParam = "true";
        else if (answered === "unanswered") answeredParam = "false";

        let sortByParam: "createDate" | undefined;
        let orderParam: "asc" | "desc" | undefined;
        if (sortBy === "newest") {
            sortByParam = "createDate";
            orderParam = "desc";
        } else if (sortBy === "oldest") {
            sortByParam = "createDate";
            orderParam = "asc";
        }
        fetchFiltered({
            title: title || undefined,
            category: category || undefined,
            answered: answeredParam,
            sortBy: sortByParam,
            order: orderParam,
        });
        setLoading(false);
    };

    const clearFilters = async () => {
        setTitle("");
        setCategory("");
        setAnswered("all");
        setSortBy("createDate");
        setCurrentPage(1);
        setLoading(true);
        await fetchFiltered();
    };

    const handleAddNewQ = () => {
        const isLoggedIn = !!localStorage.getItem("accessJWT");
        navigate(isLoggedIn ? "/addQuestion" : "/login");
    };

    return (
        <StyledQuestions>
            <h2>All questions</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Search by title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="face">Face</option>
                    <option value="eyes">Eyes</option>
                    <option value="lips">Lips</option>
                    <option value="eyebrows">Eyebrows</option>
                </select>

                <label>
                    Sort by answers:
                    <select
                        value={answered}
                        onChange={(e) => setAnswered(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="answered">Answered</option>
                        <option value="unanswered">Unanswered</option>
                    </select>
                </label>

                <label>
                    Sort by creation date:
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </label>

                <button type="submit">Apply</button>
                <button type="button" onClick={clearFilters}>Clear Filters</button>
            </form>
            <button className="addQ" onClick={handleAddNewQ}>+ Add question</button>
            <div>
                {loading ? (
                    <p>Loading questions...</p>
                ) : questions.length === 0 ? (
                    <p>No results found.</p>
                ) : (
                    <>
                        {currentQuestions.map(q => (
                            <QuestionCard key={q._id} data={q} />
                        ))}
                        <div style={{ marginTop: '20px' }}>
                            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                                Previous
                            </button>
                            <span style={{ margin: '0 10px' }}>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </StyledQuestions>
    );
}

export default Questions;