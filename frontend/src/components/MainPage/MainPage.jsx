import chatLogo from "/chat.svg";
import './MainPage.css'

export default function MainPage() {
    return (
        <div className="hero">
            <div className="icon">
                <img src={chatLogo} alt="logo"/>
            </div>
            <p className="hello">Hi there!</p>
            <h1 className="title">
                What would you like to know?
            </h1>
            <p className="subtitle">
                Use one of the most common prompts below
                <br />
                or ask your own question
            </p>
        </div>
    );
}