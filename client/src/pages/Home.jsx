import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import Footer from "../components/Footer";
import ReviewComponent from "../components/ReviewComponent";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [commercialSaleListings, setCommercialSaleListings] = useState([]);
  const [commercialLeaseListings, setCommercialLeaseListings] = useState([]);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data.filter(filterListings));
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data.filter(filterListings));
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data.filter(filterListings));
        fetchCommercialSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCommercialSaleListings = async () => {
      try {
        const res = await fetch(
          "/api/listing/get?type=commercial_sale&limit=4"
        );
        const data = await res.json();
        setCommercialSaleListings(data.filter(filterListings));
        fetchCommercialLeaseListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCommercialLeaseListings = async () => {
      try {
        const res = await fetch(
          "/api/listing/get?type=commercial_lease&limit=4"
        );
        const data = await res.json();
        setCommercialLeaseListings(data.filter(filterListings));
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  const filterListings = (listing) => {
    return !listing.tempOff && !listing.sold && !listing.rented;
  };

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/review/get");
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div>
      {/* top */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Global Luxury Livings is the best place to find your next perfect
          place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let's get started...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer, sale and rent */}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {/* Commercial Sale */}
        {commercialSaleListings && commercialSaleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent commercial sales
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=commercial_sale"}
              >
                Show more commercial sales
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {commercialSaleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* Commercial Lease */}
        {commercialLeaseListings && commercialLeaseListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent commercial leases
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=commercial_lease"}
              >
                Show more commercial leases
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {commercialLeaseListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div>
        <div className="flex flex-col justify-center dark:text-white items-center">
          <h1 className="font-bold text-3xl mt-8 text-black">Review</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {reviews.map((r) => (
              <ReviewComponent review={r} key={r._id} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
