import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import Mike from "../photos/Mike.png";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaPaw,
  FaDumbbell,
  FaDoorOpen,
} from "react-icons/fa";
import { IoResizeSharp } from "react-icons/io5";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.
export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  // const [map, setMap] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);

        // Log the agent image URL here to check its value
        if (data.agent) {
          console.log(data.agent.imageUrl);
        }
        // setMap(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper
            navigation
            style={{
              width: "100%",
              maxWidth: "900px",
              height: "auto",
              margin: "0 auto",
            }} // Adjust width and height as needed
          >
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  style={{
                    height: "400px", // Adjust height as needed
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                    borderRadius: "5px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          {listing.youtubeUrl && (
            <div className="flex justify-center mt-8">
              <iframe
                src={listing.youtubeUrl}
                frameBorder="0"
                allowFullScreen
                className="w-full md:w-1/2 lg:w-1/3 h-40 md:h-56 lg:h-64"
              ></iframe>
            </div>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="text-2xl font-semibold">
              {listing.type !== "rent" && listing.cc_tax
                ? `CC+TAX $${listing.cc_tax}`
                : ""}
            </p>

            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent"
                  ? "For Rent"
                  : listing.type === "sale"
                  ? "For Sale"
                  : listing.type === "commercial_sale"
                  ? "Commercial Sale"
                  : listing.type === "commercial_lease"
                  ? "Commercial Lease"
                  : ""}
              </p>
              {listing.sold && (
                <p className="bg-green-900 w-full max-w-[100px] text-white text-center p-1 rounded-md">
                  Sold
                </p>
              )}
              {listing.rented && (
                <p className="bg-green-900 w-full max-w-[100px] text-white text-center p-1 rounded-md">
                  Rented
                </p>
              )}
              {listing.tempOff && (
                <p className="bg-red-500 w-full max-w-[150px] text-white text-center p-1 rounded-md">
                  Temporary Off
                </p>
              )}
              {listing.underContract && (
                <p className="bg-red-500 w-full max-w-[150px] text-white text-center p-1 rounded-md">
                  Under Contract
                </p>
              )}
              {listing.date && (
                <p className=" text-black text-center p-1 rounded-md">
                  {listing.date}
                </p>
              )}

              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>

            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              {listing.sqft > 0 && (
                <li className="flex items-center gap-1 whitespace-nowrap ">
                  <IoResizeSharp className="text-lg" />
                  {`${listing.sqft} sqft`}
                </li>
              )}
              {/* Conditionally render Bed, Bath, Pets, Gym, and Doorman icons */}
              {listing.type !== "commercial_sale" &&
                listing.type !== "commercial_lease" && (
                  <>
                    {listing.bedrooms > 0 ? (
                      <li className="flex items-center gap-1 whitespace-nowrap ">
                        <FaBed className="text-lg" />
                        {listing.bedrooms > 1
                          ? `${listing.bedrooms} beds `
                          : `${listing.bedrooms} bed `}
                      </li>
                    ) : (
                      <li className="flex items-center gap-1 whitespace-nowrap ">
                        <FaBed className="text-lg" />
                        Studio
                      </li>
                    )}

                    {listing.bathrooms > 0 && (
                      <li className="flex items-center gap-1 whitespace-nowrap ">
                        <FaBath className="text-lg" />
                        {listing.bathrooms > 1
                          ? `${listing.bathrooms} baths `
                          : `${listing.bathrooms} bath `}
                      </li>
                    )}
                  </>
                )}

              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
              {/* Conditionally render Bed, Bath, Pets, Gym, and Doorman icons */}
              {listing.type !== "commercial_sale" &&
                listing.type !== "commercial_lease" && (
                  <>
                    <li className="flex items-center gap-1 whitespace-nowrap ">
                      <FaPaw className="text-lg" />
                      {listing.pet ? "Pets" : "No Pets"}
                    </li>
                    <li className="flex items-center gap-1 whitespace-nowrap ">
                      <FaDumbbell className="text-lg" />
                      {listing.gym ? "Gym" : "No Gym"}
                    </li>
                    <li className="flex items-center gap-1 whitespace-nowrap ">
                      <FaDoorOpen className="text-lg" />
                      {listing.doorMan ? "Door Man" : "No Door Man"}
                    </li>
                  </>
                )}
            </ul>
            {/* card */}
            {listing.agent && (
              <div className="flex justify-center items-center h-full py-12 bg-gray-100">
                <a
                  href="#"
                  className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <img
                    className="object-cover w-full h-48 md:w-48 md:h-auto rounded-lg md:rounded-none"
                    src={listing.agent.imageUrl || Mike} // Fallback to Mike if imageUrl is not available
                    alt={listing.agent.name}
                  />
                  <div className="flex flex-col justify-between p-4 leading-normal bg-gray-900 text-white">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight">
                      {listing.agent.name}
                    </h5>
                    <p className="mb-3 font-normal">
                      Email: {listing.agent.email}
                      <br />
                      Phone: {listing.agent.phone}
                    </p>
                  </div>
                </a>
              </div>
            )}

            {(listing.mapUrl !== undefined && listing.mapUrl) !== "" && (
              <div className="flex justify-center items-center">
                <iframe
                  src={listing.mapUrl}
                  className="w-full max-w-4xl"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}

            {/* {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
              >
                Contact landlord
              </button>
            )} */}
            {/* {contact && <Contact listing={listing} />} */}
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
}
