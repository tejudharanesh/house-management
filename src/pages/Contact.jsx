import React from "react";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

function Contact() {
  const [message, setMessage] = useState("");
  const [landlord, setLandlord] = useState([]);
  const [searchParams] = useSearchParams();

  const param = useParams();

  useEffect(() => {
    const fetchLandlord = async () => {
      const docRef = doc(db, "users", param.landlordId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Landlord not found");
      }
    };

    fetchLandlord();
  }, [param.landlordId]);
  console.log(landlord);

  return (
    <div className="pageContainer">
      <header className="pageHeader">Contact Landlord</header>
      {landlord !== null && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">Contact {landlord.name}</p>
          </div>

          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLabel">
                Message
              </label>
              <textarea
                className="textarea"
                name="message"
                id="message"
                value={message}
                rows="1"
                cols="1"
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here"
                required
              ></textarea>
            </div>
            <a
              href={`mailto:${landlord.email}?Subject=${searchParams.get(
                "listingName"
              )}&body=${message}`}
            >
              <button className="primaryButton" type="button">
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
}

export default Contact;
