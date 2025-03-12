import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const Search = () => {
  const [locations, setLocations] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [entityType, setEntityType] = useState("");
  const [availability, setAvailability] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [minDuration, setMinDuration] = useState("");
  const [maxDuration, setMaxDuration] = useState("");
  const [minGroupSize, setMinGroupSize] = useState("");
  const [maxGroupSize, setMaxGroupSize] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const [guideRes, packageRes] = await Promise.all([
          axios.get("http://localhost:5000/search/guide-locations"),
          axios.get("http://localhost:5000/search/package-locations"),
        ]);
        setLocations([...new Set([...guideRes.data.locations, ...packageRes.data])]);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    const fetchLanguages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/search/guide-languages");
        setLanguages(res.data || []);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLocations();
    fetchLanguages();
  }, []);

  const handleSearch = async () => {
    if (selectedLocation && entityType) {
      try {
        const res = await axios.get("http://localhost:5000/search", {
          params: {
            location: selectedLocation,
            entityType,
            availability,
            language: selectedLanguage,
            minDuration,
            maxDuration,
            minGroupSize,
            maxGroupSize,
            minPrice,
            maxPrice,
            availableDates,
          },
        });
        setSearchResults(res.data || []);
      } catch (error) {
        console.error("Error searching:", error);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col bg-white"
      style={{
        backgroundImage: "radial-gradient(circle, #f0f0f0 1px, transparent 1px)",
        backgroundSize: "20px 20px",
        backgroundColor: "#fff",
      }}
    >
      <Navbar />
      <motion.main 
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="flex-grow container mx-auto px-4 py-12 relative"
      >
        <h1 className="text-5xl font-bold text-center mb-12 text-[#1a365d]">Search Packages and Guides</h1>

        <motion.div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <select
              className="w-full bg-white text-[#2d3748] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-[#4169E1] shadow-sm transition-all duration-300"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Select Location</option>
              {locations.map((loc, index) => (
                <option key={index} value={loc}>{loc}</option>
              ))}
            </select>

            <select
              className="w-full bg-white text-[#2d3748] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-[#4169E1] shadow-sm transition-all duration-300"
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="Guide">Guide</option>
              <option value="Package">Package</option>
            </select>

            {entityType === "Guide" && (
              <>
                <label className="flex items-center space-x-2 text-[#2d3748]">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-[#4169E1] rounded focus:ring-[#4169E1]"
                    checked={availability}
                    onChange={(e) => setAvailability(e.target.checked)}
                  />
                  <span>Available</span>
                </label>
                <select
                  className="w-full bg-white text-[#2d3748] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-[#4169E1] shadow-sm transition-all duration-300"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="">Select Language</option>
                  {languages.map((lang, index) => (
                    <option key={index} value={lang}>{lang}</option>
                  ))}
                </select>
              </>
            )}
          </div>

          {entityType === "Package" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-[#2d3748]">Duration (days)</label>
                <div className="flex gap-4">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={minDuration} 
                    onChange={(e) => setMinDuration(e.target.value)} 
                    className="w-full bg-white text-[#2d3748] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-[#4169E1] shadow-sm transition-all duration-300"
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={maxDuration} 
                    onChange={(e) => setMaxDuration(e.target.value)} 
                    className="w-full bg-white text-[#2d3748] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-[#4169E1] shadow-sm transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[#2d3748]">Price Range</label>
                <div className="flex gap-4">
                  <input 
                    type="number" 
                    placeholder="Min Price" 
                    value={minPrice} 
                    onChange={(e) => setMinPrice(e.target.value)} 
                    className="w-full bg-white text-[#2d3748] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-[#4169E1] shadow-sm transition-all duration-300"
                  />
                  <input 
                    type="number" 
                    placeholder="Max Price" 
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(e.target.value)} 
                    className="w-full bg-white text-[#2d3748] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-[#4169E1] shadow-sm transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[#2d3748]">Available Date</label>
                <input 
                  type="date" 
                  onChange={(e) => setAvailableDates([...availableDates, moment(e.target.value).format("YYYY-MM-DD")])} 
                  className="w-full bg-white text-[#2d3748] border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:border-[#4169E1] shadow-sm transition-all duration-300"
                />
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#1a365d" }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 w-full bg-[#00072D] text-white font-semibold py-4 px-6 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
            onClick={handleSearch}
            disabled={!selectedLocation || !entityType}
          >
            Search
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" >
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <div key={index} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-opacity-20">
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {result.name || result.title}
                  </h3>
                  {entityType === "Guide" ? (
                    <div className="text-gray-300">
                      <p><span className="font-semibold">Experience:</span> {result.experience}</p>
                      <p><span className="font-semibold">Availability:</span> {result.availability ? "Available" : "Unavailable"}</p>
                      <p><span className="font-semibold">Languages:</span> {result.languages.join(", ")}</p>
                      <p><span className="font-semibold">Location:</span> {result.location}</p>
                      <Link
                        to={`/guides/${result._id}`}
                        className="mt-4 inline-block w-full bg-[#81c3d2] text-white font-bold py-2 px-4 rounded-full hover:bg-[#2c494b] transition-colors duration-300 text-center"
                      >
                        View Guide
                      </Link>
                    </div>
                  ) : (
                    <div className="text-[#2d3748]">
                      <div className="overflow-hidden mb-4">
                        {result.image && result.image.length > 0 ? (
                          <div className="relative group">
                            {result.image.map((img, index) => (
                              <motion.div
                                key={index}
                                className="relative"
                              >
                                <motion.img
                                  whileHover={{ scale: 1.08 }}
                                  transition={{ duration: 0.6, ease: "easeOut" }}
                                  src={`http://localhost:5000${img}`}
                                  alt={`Image of ${result.name}`}
                                  className="w-full h-[200px] object-cover transform group-hover:brightness-105 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-[200px] bg-gradient-to-r from-[#1a365d] to-[#4169E1] flex items-center justify-center">
                            <p className="text-white font-medium">No image available</p>
                          </div>
                        )}
                      </div>
                      {/* <p className="mb-2">{result.description}</p> */}
                      <p><span className="font-semibold">Duration:</span> {result.duration} days</p>
                      <p><span className="font-semibold">Max Group Size:</span> {result.maxGroupSize}</p>
                      <p><span className="font-semibold ">Price:</span> Rs.{result.price}</p>
                      <p><span className="font-semibold">Available Dates:</span> {result.availableDates.map((date) => moment(date).format("YYYY-MM-DD")).join(", ")}</p>
                      <p><span className="font-semibold">Location:</span> {result.location}</p>
                      <Link
                        to={`/packages/${result._id}`}
                        className="mt-4 inline-block w-full bg-[#00072D] text-white font-bold py-2 px-4 rounded-full hover:bg-[#2c494b] transition-colors duration-300 text-center"
                      >
                        View Package
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-300 text-lg">
              No results found
            </p>
          )}
        </div>
      </motion.main>
    </motion.div>
  );
};
export default Search;