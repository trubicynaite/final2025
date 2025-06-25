import { useContext } from "react";
import { NavLink, useNavigate } from "react-router";
import styled from "styled-components";
import UsersContext from "../../../contexts/UsersContext";
import { UserContextTypes } from "../../../types";

const StyledHeader = styled.header`
    height: 80px;
    padding: 5px 20px;
    background-color: #87085D;

    display: flex;
    align-items: center;
    justify-content: space-between;

    >.top {
        display: flex;
        align-items: center;
        gap: 15px;
        flex-shrink: 0;
        text-decoration: none;

        >div.logo{
        width: 50px;
        height: 50px;
        border-radius: 6px;
        background-color: #EB88CA;
        display: flex;
        justify-content: center;
        align-items: center;

        >p{
            font-style: italic;
            font-size: 30px;
            color: white;
            margin: 0;
            user-select: none;
        }
    }

        >h2 {
            color: white;
            margin: 0;
        }
    }

        >nav{
            width: 100%;

            >ul{
                margin: 0;
                padding: 0;
                list-style-type: none;

                display: flex;
                justify-content: flex-end;
                gap: 5px;

                >li {
                    >a,
                    >a.logout {
                        text-decoration: none;
                        color: white;
                        font-size: 18px;
                        padding: 8px;
                        border-radius: 6px;
                        cursor: pointer;
                        transition: all 0.3s ease;

                        &:hover {
                        background-color: #f3aadb;
                        color: #87085D;
                        border: 1px solid #f3aadb;
                        }

                        &.active {
                        background-color: #f3aadb;
                        color: #87085D;
                        border: 1px solid #f3aadb;
                        }
                    }
                    >a.logout{
                        &:hover {
                        background-color: #87085D;
                        color: white;
                        }
                    }
                }

            }
        }

        @media (min-width: 575px){
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            >div.top{
                margin-bottom: 0;
                flex-shrink: 0;
            }

            >nav{
                width: auto;
                margin-left: auto;

                >ul{
                    justify-content: flex-end;
                    flex-wrap: nowrap;
                }
            }

            >h2{
                font-size: 24px;
            }
        }
`

const Header = () => {

    const { loggedInUser, setLoggedInUser } = useContext(UsersContext) as UserContextTypes;
    const navigate = useNavigate();

    const handleLogout = () => {
        setLoggedInUser(null);
        localStorage.removeItem('loggedInUser');
        navigate('/');
    };

    return (
        <StyledHeader>
            <NavLink to='/' className="top" style={{ textDecoration: 'none' }}>
                <div className="logo">
                    <p>P</p>
                </div>
                <h2>Pinkie</h2>
            </NavLink>
            {loggedInUser ?
                <nav>
                    <ul>
                        <li><NavLink to="/questions">Questions</NavLink></li>
                        <li><NavLink to="/myActivity">My Activity</NavLink></li>
                        <li><NavLink to="/user">My info</NavLink></li>
                        <li><a onClick={handleLogout} className="logout">Logout</a></li>
                    </ul>
                </nav> :
                <nav>
                    <ul>
                        <li><NavLink to="/questions">Questions</NavLink></li>
                        <li><NavLink to="/login">Login</NavLink></li>
                        <li><NavLink to="/register">Register</NavLink></li>
                    </ul>
                </nav>
            }
        </StyledHeader>
    );
}

export default Header;