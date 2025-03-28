import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { FaFlag, FaStar } from "react-icons/fa";
import Navbar from '../components/Navbar';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const ViewGuide = () => {
  const { id } = useParams();
  const [guideDetails, setGuideDetails] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [revvs, setRevDetails] = useState(null);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const token = localStorage.getItem("token");
  const [bookingId, setBookingId] = useState("")
  const customerId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    const fetchGuideDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/guides/${id}`);
        setGuideDetails(response.data);
      } catch (error) {
        console.error("Error fetching guide details:", error);
      }
    };
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:5000/reviews/guides/${id}`);
        const data = await res.json();
        setRevDetails(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
    fetchGuideDetails();
  }, [id]);

  const handleBooking = async () => {
    try {
      if (!customerId) {
        setBookingStatus("Customer is not authenticated. Please log in.");
        return;
      }
      const packageId = null;
      const bookingData = {
        customerId,
        guideId: guideDetails._id,
        packageId: packageId || null,
      };
      const response = await axios.post(
        "http://localhost:5000/bookings",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setBookingStatus("Booking confirmed successfully!");
      } else {
        setBookingStatus("Failed to book the guide.");
      }
    } catch (error) {
      console.error("Error during booking:", error);
      setBookingStatus("An error occurred while booking.");
    }
  };

  const handleOpenReviewModal = () => {
    setShowReviewModal(true);
  };
  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setRating(1);
    setComment("");
  };
  const handleSubmitReview = async () => {
    try {
      const response = await fetch("http://localhost:5000/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId,
          guideId: id,
          bookingId, // Include bookingId in the payload
          rating,
          comment,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        console.log("Review submitted:", result);
        toast.success("Review submitted successfully!");
        handleCloseReviewModal();
      } else {
        const errorData = await response.json();
        console.error("Failed to submit review:", errorData.message);
        toast.error(`Failed to submit review: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("An error occurred while submitting the review.");
    }
  };
  const handleAddToWishlist = async () => {
    try {
      if (!customerId) {
        setBookingStatus("Customer is not authenticated. Please log in.");
        return;
      }
      const wishlistData = {
        customerId,
        guideId: guideDetails._id,
      };
      const response = await axios.post(
        "http://localhost:5000/wishlistGuides",
        wishlistData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        toast.success("Guide added to wishlist successfully!");
      } else {
        toast.error("Failed to add guide to wishlist.");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error(`${error.message}`);
    }
  };

  if (!guideDetails) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col bg-white"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0, 0, 0) 1px, transparent 0)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0',
          backgroundColor: 'rgba(255, 255, 255, 0.97)'
        }}
      >
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-16 h-16 border-t-4 border-[#4169E1] border-solid rounded-full animate-spin"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col bg-white"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0, 0, 0) 1px, transparent 0)`,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0',
        backgroundColor: 'rgba(255, 255, 255, 0.97)'
      }}
    >
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      
      <motion.main 
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="flex-grow container mx-auto px-4 py-12 relative z-10"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 p-8"
        >
          <h1 className="text-5xl font-bold text-[#1a365d] tracking-tight mb-8">{guideDetails.username}</h1>
          <p className="text-[#2d3748] leading-relaxed mb-6">{guideDetails.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              { label: "Experience", value: `${guideDetails.experience} years` },
              { label: "Languages", value: guideDetails.languages.join(", ") },
              { label: "Phone Number", value: guideDetails.phno },
              { label: "Email", value: guideDetails.email }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <p className="font-semibold text-[#1a365d] mb-1">{item.label}</p>
                <p className="text-[#2d3748]">{item.value}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <h2 className="text-3xl font-bold text-[#1a365d] tracking-tight mb-6">Reviews</h2>
            {revvs && revvs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {revvs.map((review) => (
                  <motion.div
                    key={review._id}
                    whileHover={{ 
                      y: -5,
                      boxShadow: "0 22px 45px -12px rgba(26, 54, 93, 0.15)"
                    }}
                    className="bg-white rounded-lg shadow-lg p-6 border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex text-[#4169E1]">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={i < review.rating ? "text-[#4169E1]" : "text-gray-300"} />
                            ))}
                          </div>
                          <span className="text-[#2d3748]">/ 5</span>
                        </div>
                        <p className="text-[#2d3748]">
                          By {review.customerName || "Anonymous"}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReportReview(review._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FaFlag />
                      </motion.button>
                    </div>
                    <p className="text-[#2d3748] leading-relaxed">{review.comment}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-[#2d3748] text-lg">
                No reviews for this Guide yet.
              </p>
            )}
          </motion.div>

          <div className="flex gap-4 mt-8">
            {["Book Guide", "Add Review", "Add to Wishlist"].map((text, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={[handleBooking, handleOpenReviewModal, handleAddToWishlist][index]}
                className="bg-[#00072D] text-white font-semibold py-3 px-6 rounded-md hover:bg-[#1a365d] transition-all duration-300 shadow-md"
              >
                {text}
              </motion.button>
            ))}
          </div>

          {bookingStatus && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center text-[#2d3748] bg-gray-50 rounded-lg p-4"
            >
              {bookingStatus}
            </motion.p>
          )}
        </motion.div>
      </motion.main>

      {/* Review Modal with updated styling */}
      {showReviewModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-lg shadow-lg p-8 w-11/12 max-w-md"
          >
            <h2 className="text-3xl font-bold text-[#1a365d] tracking-tight mb-6">Rate and Review</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking ID:</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md py-2 px-3"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating:</label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Comment:</label>
              <textarea
                className="w-full border border-gray-300 rounded-md py-2 px-3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
              />
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCloseReviewModal}
                className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-md hover:bg-gray-300 transition-all duration-300 shadow-md"
              >
                Close
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmitReview}
                className="bg-[#00072D] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#1a365d] transition-all duration-300 shadow-md"
              >
                Submit Review
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ViewGuide;

