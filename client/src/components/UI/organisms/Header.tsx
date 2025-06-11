import { NavLink } from "react-router";
import styled from "styled-components";

const StyledHeader = styled.header`
    height: 80px;
    padding: 5px 30px;
    background-color: #87085D;

    display: flex;
    align-items: center;
    justify-content: space-between;

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
        }
    }
    >h2 {
            font-size: 24px;
            color: white;
        }
        >nav{
            >ul{
                margin: 0;
                padding: 0;
                list-style-type: none;

                display: flex;
                justify-content: space-between;
                gap: 10px;

                >li{
                    >a{
                        text-decoration: none;
                        color: white;
                        font-size: 20px;
                        padding: 10px;

                        &:hover{
                            color: #87085D;
                        }
                        &:active{
                            color: #EB88CA;
                        }
                    }
                }
            }
        }
`

const Header = () => {

    return (
        <StyledHeader>
            <div className="logo">
                <p>P</p>
            </div>
            <h2>Pinkie</h2>
            <nav>
                <ul>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/questions">Questions</NavLink></li>
                </ul>
            </nav>
        </StyledHeader>
    );
}

export default Header;