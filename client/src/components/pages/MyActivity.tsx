import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router";

import UsersContext from "../../contexts/UsersContext";
import { Question, User } from "../../types";

const StyledSection = styled.section`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  color: white;

  > h2 {
    margin-bottom: 20px;
    color: #f3aadb;
  }

  > div.questions {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    gap: 20px;

    > div.card {
        width: 100%;
        background-color: #87085d;
        padding: 20px;
        border-radius: 6px;
        min-width: 280px;

      > h3 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #f3aadb;
      }

      > ul {
        list-style: none;
        padding-left: 0;

        > li {
          margin-bottom: 10px;
          padding: 8px;
          background: #eb88ca;
          border-radius: 6px;
          cursor: pointer;

          &:not(.noQ):hover {
            background: #f3aadb;
            color: #87085d;
          }

          > a {
          color: white;
          text-decoration: none;
          display: block;

          &:hover {
            color: #87085d;
          }
        }
        }
        >li.noQ{
            cursor: default;
        }
      }
    }

    @media (min-width: 575px) { 
      flex-direction: row;    
      justify-content: space-between;

      > div.card {
        width: calc(50% - 10px);
      }
    }
  }
`;

const MyActivity = () => {

    const { loggedInUser } = useContext(UsersContext) as { loggedInUser: User | null };

    const [likedQuestions, setLikedQuestions] = useState<Question[]>([]);
    const [dislikedQuestions, setDislikedQuestions] = useState<Question[]>([]);
    const [askedQuestions, setAskedQuestions] = useState<Question[]>([]);
    const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);

    useEffect(() => {
        if (!loggedInUser) return;

        const fetchQuestionsByIds = async (ids: string[]) => {
            const results = [];
            for (const id of ids) {
                const res = await fetch(`http://localhost:5500/questions/${id}`);
                if (res.ok) {
                    const question = await res.json();
                    results.push(question);
                }
            }
            return results;
        };


        const loadData = async () => {
            const liked = await fetchQuestionsByIds(loggedInUser.likedQuestions);
            const disliked = await fetchQuestionsByIds(loggedInUser.dislikedQuestions);
            const asked = await fetchQuestionsByIds(loggedInUser.createdQuestions);
            const answered = await fetchQuestionsByIds(loggedInUser.answeredQuestions);

            setLikedQuestions(liked);
            setDislikedQuestions(disliked);
            setAskedQuestions(asked);
            setAnsweredQuestions(answered);
        };

        loadData();
    }, [loggedInUser]);

    return (
        <StyledSection>
            <h2>My Activity</h2>
            <div className="questions">
                <div className="card">
                    <h3>Asked Questions</h3>
                    <ul>
                        {askedQuestions.length > 0 ? (
                            askedQuestions.map((q) => (
                                <li key={q._id}>
                                    <Link to={`/questions/${q._id}`}>{q.questionHeader}</Link>
                                </li>
                            ))
                        ) : (
                            <li className="noQ">No questions asked yet.</li>
                        )}
                    </ul>
                </div>
                <div className="card">
                    <h3>Answered Questions</h3>
                    <ul>
                        {answeredQuestions.length > 0 ? (
                            answeredQuestions.map((q) => (
                                <li key={q._id}>
                                    <Link to={`/questions/${q._id}`}>{q.questionHeader}</Link>
                                </li>
                            ))
                        ) : (
                            <li className="noQ">No questions answered yet.</li>
                        )}
                    </ul>
                </div>
                <div className="card">
                    <h3>Liked Questions</h3>
                    <ul>
                        {likedQuestions.length > 0 ? (
                            likedQuestions.map((q) => (
                                <li key={q._id}>
                                    <Link to={`/questions/${q._id}`}>{q.questionHeader}</Link>
                                </li>
                            ))
                        ) : (
                            <li className="noQ">No liked questions yet.</li>
                        )}
                    </ul>
                </div>
                <div className="card">
                    <h3>Disliked Questions</h3>
                    <ul>
                        {dislikedQuestions.length > 0 ? (
                            dislikedQuestions.map((q) => (
                                <li key={q._id}>
                                    <Link to={`/questions/${q._id}`}>{q.questionHeader}</Link>
                                </li>
                            ))
                        ) : (
                            <li className="noQ">No disliked questions yet.</li>
                        )}
                    </ul>
                </div>
            </div>
        </StyledSection>
    );
};

export default MyActivity;
