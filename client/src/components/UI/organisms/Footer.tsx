import styled from 'styled-components';

const StyledFooter = styled.footer`
    height: 80px;
    background-color: #87085D;

    display: flex;
    justify-content: space-between;
    align-items: center;

    padding-left: 20px;
    padding-right: 20px;

    gap: 20px;

    >a{
        color: white;
        text-align: center;

        &:hover {
        text-decoration: underline;
        }
    }

    >p{
        color: white;
        text-align: center;
        }
`
const Footer = () => {
    return (
        <StyledFooter>
            <p>&copy; TYPE26 Final Project.</p>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
            <a href="/contact">Contact Us</a>
        </StyledFooter>
    );
}

export default Footer;
