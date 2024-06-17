import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import { getAuth } from "firebase/auth";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      } else {
        navigate("/");
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <main>
      {listing.imgUrl.map((url, index) => (
        <div className="swiperSlideDiv">
          <img className="listingImg" src={url} alt={url} />
        </div>
      ))}
      {/* <Swiper
        // install Swiper modules
        modules={[Navigation, Pagination]}
        spaceBetween={3}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
      >
        {listing.imgUrl.map((url, index) => (
          <SwiperSlide key={index}>
            <div className="swiperSlideDiv">
              <img
                src={url}
                alt={url}
                style={{ width: "100%", height: "400px" }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper> */}
      <div
        className="shareIconDiv"
        onClick={() => {
          setShareLinkCopied(true);
          navigator.clipboard.writeText(window.location.href);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="share" />
      </div>

      {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}

      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - ₹
          {listing.offer ? listing.discountPrice : listing.regularPrice}
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">For {listing.type} </p>
        {listing.offer && (
          <p className="discountPrice">
            {" "}
            ₹{listing.regularPrice - listing.discountPrice} discount{" "}
          </p>
        )}
        <ul className="listingDetailsList">
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : `${listing.bedrooms} Bedroom`}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : `${listing.bathrooms} Bathroom`}
          </li>
          <li>{listing.parking && "Parking Available"}</li>
          <li>{listing.furnished && "Furnished"}</li>
        </ul>
        <p className="listingLocationTitle">Location</p>

        <div className="leafletContainer">
          <MapContainer
            style={{ height: "100%", width: "100%" }}
            center={[
              listing.geoLocation.Latitude,
              listing.geoLocation.Longitude,
            ]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
            />

            <Marker
              position={[
                listing.geoLocation.Latitude,
                listing.geoLocation.Longitude,
              ]}
            >
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className="primaryButton"
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
}

export default Listing;
