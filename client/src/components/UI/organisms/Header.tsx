import { NavLink } from "react-router";
import styled from "styled-components";

const StyledHeader = styled.header`
    height: 80px;
    padding: 5px 20px;
    background-color: #87085D;

    display: flex;
    align-items: center;
    justify-content: space-between;

    >div.top {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;

        >div.logo{
        width: 50px;
        height: 50px;
        border-radius: 30px;
        background-color: #EB88CA;
        display: flex;
        justify-content: center;
        align-items: center;

        >p{
            font-style: italic;
            font-size: 30px;
            color: white;
            margin: 0;
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
                justify-content: center;
                gap: 10px;

                >li{
                    >a{
                        text-decoration: none;
                        color: white;
                        font-size: 18px;
                        padding: 8px;

                        &:hover{
                            color: #f3aadb;
                        }
                        &.active{
                            color: #f3aadb;
                            border: 1px solid #f3aadb;
                            border-radius: 50px;
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

    return (
        <StyledHeader>
            <div className="top">
                <div className="logo">
                    <p>P</p>
                </div>
                <h2>Pinkie</h2>
            </div>
            <nav>
                <ul>
                    <li><NavLink to="/" className={({ isActive }) => (isActive ? "active" : undefined)}>Home</NavLink></li>
                    <li><NavLink to="/questions" className={({ isActive }) => (isActive ? "active" : undefined)}>Questions</NavLink></li>
                    <li><NavLink to="/login" className={({ isActive }) => (isActive ? "active" : undefined)}>Login</NavLink></li>
                    <li><NavLink to="/register" className={({ isActive }) => (isActive ? "active" : undefined)}>Register</NavLink></li>
                </ul>
            </nav>
        </StyledHeader>
    );
}

export default Header;