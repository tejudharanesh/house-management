import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import GoogleIcon from "../assets/svg/googleIcon.svg";
import { toast } from "react-toastify";
function Oauth() {
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      //check for user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      //if user doesn't exist push into database
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        }); 
      }
      navigate("/");
    } catch (error) {
      toast.error("failed to authorize with google");
    }
  };
  return (
    <div className="socialLogin">
      <p> Sign {location.pathname === "sign-up" ? "Up" : "In"} with</p>
      <button className="socialIconDiv" onClick={onGoogleClick}>
        <img className="socialIconImg" src={GoogleIcon} alt="google icon" />
      </button>
    </div>
  );
}

export default Oauth;
