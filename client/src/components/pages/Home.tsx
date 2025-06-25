import styled from "styled-components";

const StyledHome = styled.section`
    text-align: center;

    >div.intro{
        margin-right: 20px;
        margin-left: 20px;
    }

    >div.vision{
        margin-top: 50px;
        margin-bottom: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 30px;
        margin-right: 20px;
        margin-left: 20px;

        >div{
            max-width: 400px;
        }
    }
`

const Home = () => {

    return (
        <StyledHome>
            <h2>Welcome to Pinkie!</h2>
            <div className="intro">
                <p>Whether you're a beauty beginner, makeup enthusiast, or professional artist — you're in the right place.</p>
                <p>At Pinkie, we believe in sharing knowledge, experiences, and honest opinions. This is a community where you can: </p>
                <p> 💬 Ask questions about anything makeup-related — products, techniques, skin types, and more</p>
                <p>💡 Get answers from real people who've tried it, lived it, and know what works </p>
                <p> ❤️ Like and support helpful answers and discussions </p>
                <p> 🙌 Connect with others who love makeup just as much as you do</p>
                <p> This space is built on kindness, curiosity, and creativity. We're so glad you're here 💕</p>
            </div>
            <div className="vision">
                <div>
                    <h2>Our Vision <br />💖</h2>
                    <p>To be the most inclusive and trusted online space for makeup and skincare advice — where authenticity, curiosity, and creativity come first.</p>
                </div>
                <div>
                    <h2>Our Mission <br /> 💖</h2>
                    <p>To empower beauty lovers of all backgrounds by offering a space where questions are welcomed, experiences are shared, and knowledge grows through community support.</p>
                </div>
                <div>
                    <h2>Our Goal <br />💖</h2>
                    <p>To build a kind, helpful, and inspiring beauty community where everyone can learn, contribute, and feel seen.</p>
                </div>
            </div>
        </StyledHome>
    );
}

export default Home;