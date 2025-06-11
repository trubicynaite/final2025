import styled from 'styled-components';

const StyledFooter = styled.footer`
    height: 80px;
    background-color: #87085D;

    display: flex;
    justify-content: center;
    align-items: center;

    gap: 20px;

    >a{
        margin: 0 15px;
        color: white;

        &:hover {
        text-decoration: underline;
        }
    }

    >p{
        color: white;
        }
`
const Footer = () => {
    return (
        <StyledFooter>
            <p>&copy; 2025 Final Project. TYPE26. All rights reserved.</p>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
            <a href="/contact">Contact Us</a>
        </StyledFooter>
    );
}

export default Footer;
