import React from "react";
import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";
import { ReactComponent as RightArrowIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import { toast } from "react-toastify";
function ForgotPassword() {
  const [email, setEmail] = useState("");

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email).then(
        toast.success("Email Sent")
      );
    } catch (error) {
      toast.error("could not send email");
    }
  };
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Password</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <input
            className="emailInput"
            type="email"
            id="email"
            value={email}
            placeholder="Email"
            onChange={onChange}
          />

          <Link className="forgotPasswordLink" to="/sign-in">
            Sign In
          </Link>

          <div className="signInBar">
            <div className="signInText">Send Reset Link</div>
            <button className="signInButton">
              <RightArrowIcon fill="#ffffff" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ForgotPassword;
