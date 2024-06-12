import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import ArrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import HomeIcon from "../assets/svg/homeIcon.svg";
function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [changeDetail, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");

      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid)
      );

      const querySnap = await getDocs(q);

      let listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListing(listings);
      setLoading(false);
    };

    fetchUserListings();
  }, [auth.currentUser.uid]);

  const logout = () => {
    auth.signOut();
    navigate("/");
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          name,
        });
      }
      toast.success("Profile Updated");
    } catch (error) {
      toast.error("Could not update profile");
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => {
      return {
        ...prevState,
        [e.target.id]: e.target.value,
      };
    });
  };

  const onDelete = (id) => {
    if (window.confirm("are you sure you want to delete ?")) {
      setLoading(true);
      const docRef = doc(db, "listings", id);
      deleteDoc(docRef)
        .then(() => {
          setLoading(false);
          toast.success("Listing Deleted");
          const updatedListings = listing.filter(
            (listing) => listing.id !== id
          );
          setListing(updatedListings);
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.message);
        });
    }
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={logout}>
          Logout
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetail && onSubmit();
              setChangeDetails(!changeDetail);
            }}
          >
            {changeDetail ? "done" : "change"}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetail ? "profileName" : "profileNameActive"}
              disabled={!changeDetail}
              value={name}
              onChange={onChange}
            />
            <input
              type="text"
              id="email"
              className="profileEmail"
              disabled="true"
              value={email}
            />
          </form>
        </div>
        <Link to="/create-listing" className="createListing ">
          <img src={HomeIcon} alt="Create Listing" />
          <p>Sell or Rent your home</p>
          <img src={ArrowRight} alt="arrow right" />
        </Link>

        {!loading && listing?.length > 0 && (
          <>
            <p className="listingsText">My Listings</p>
            <ul className="listingsList">
              {listing.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;
