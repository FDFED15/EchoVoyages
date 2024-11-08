import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import Navbar from '../components/Navbar';
import '../styles/Search.css';

const Search = () => {
    const [locations, setLocations] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [entityType, setEntityType] = useState('');
    const [availability, setAvailability] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [minDuration, setMinDuration] = useState('');
    const [maxDuration, setMaxDuration] = useState('');
    const [minGroupSize, setMinGroupSize] = useState('');
    const [maxGroupSize, setMaxGroupSize] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [availableDates, setAvailableDates] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const guideLocations = await axios.get('http://localhost:5000/search/guide-locations');
                const packageLocations = await axios.get('http://localhost:5000/search/package-locations');
                const allLocations = [...new Set([...guideLocations.data.locations, ...packageLocations.data])];
                setLocations(allLocations);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        const fetchLanguages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/search/guide-languages');
                setLanguages(response.data || []);
            } catch (error) {
                console.error('Error fetching languages:', error);
            }
        };

        fetchLocations();
        fetchLanguages();
    }, []);

    const handleSearch = async () => {
        if (selectedLocation && entityType) {
            try {
                const response = await axios.get('http://localhost:5000/search', {
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
                setSearchResults(response.data || []);
            } catch (error) {
                console.error('Error searching:', error);
            }
        }
    };

    return (
        <div className='total-container'>
        <Navbar/>
        <div className="search-container">
            <h2 className="search-title">Search</h2>
            <div className="search-filters">
                <select
                    className="filter-select"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                >
                    <option value="">Select Location</option>
                    {locations.map((location, index) => (
                        <option key={index} value={location}>
                            {location}
                        </option>
                    ))}
                </select>

                <select
                    className="filter-select"
                    value={entityType}
                    onChange={(e) => setEntityType(e.target.value)}
                >
                    <option value="">Select Type</option>
                    <option value="Guide">Guide</option>
                    <option value="Package">Package</option>
                </select>

                {entityType === 'Guide' && (
                    <div className="guide-filters">
                        <label className="availability-label">
                            Availability:
                            <input
                                type="checkbox"
                                checked={availability}
                                onChange={(e) => setAvailability(e.target.checked)}
                            />
                        </label>
                        <select
                            className="filter-select"
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                        >
                            <option value="">Select Language</option>
                            {languages.map((lang, index) => (
                                <option key={index} value={lang}>
                                    {lang}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {entityType === 'Package' && (
                    <div className="package-filters">
                        <h3 className="filter-title">Filters for Packages</h3>
                        <div className="filter-group">
                            <label className="filter-label">Duration:</label>
                            <input
                                type="number"
                                className="filter-input"
                                placeholder="Min"
                                value={minDuration}
                                onChange={(e) => setMinDuration(e.target.value)}
                            />
                            <input
                                type="number"
                                className="filter-input"
                                placeholder="Max"
                                value={maxDuration}
                                onChange={(e) => setMaxDuration(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label className="filter-label">Max Group Size:</label>
                            <input
                                type="number"
                                className="filter-input"
                                placeholder="Min"
                                value={minGroupSize}
                                onChange={(e) => setMinGroupSize(e.target.value)}
                            />
                            <input
                                type="number"
                                className="filter-input"
                                placeholder="Max"
                                value={maxGroupSize}
                                onChange={(e) => setMaxGroupSize(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label className="filter-label">Price:</label>
                            <input
                                type="number"
                                className="filter-input"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                            <input
                                type="number"
                                className="filter-input"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>
                        <div className="filter-group">
                            <label className="filter-label">Available Dates:</label>
                            <input
                                type="date"
                                className="filter-input"
                                onChange={(e) => {
                                    const date = moment(e.target.value).format();
                                    setAvailableDates([...availableDates, date]);
                                }}
                            />
                        </div>
                    </div>
                )}

                <button
                    className="search-btn"
                    onClick={handleSearch}
                    disabled={!selectedLocation || !entityType}
                >
                    Search
                </button>
            </div>

            <div className="search-results">
                {searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                        <div className="result-card" key={index}>
                            <h3 className="result-title">{result.name || result.title}</h3>
                            {entityType === 'Guide' ? (
                                <div className="result-details">
                                    <p>
                                        <strong>Experience:</strong> {result.experience}
                                    </p>
                                    <p>
                                        <strong>Availability:</strong> {result.availability ? 'Available' : 'Unavailable'}
                                    </p>
                                    <p>
                                        <strong>Languages:</strong> {result.languages.join(', ')}
                                    </p>
                                    <p>
                                        <strong>Location:</strong> {result.location}
                                    </p>
                                    <Link to={`/guides/${result._id}`}>
                                        <button className="view-btn">View Guide</button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="result-details">
                                    <p>
                                        <strong>Description:</strong> {result.description}
                                    </p>
                                    <p>
                                        <strong>Duration:</strong> {result.duration} days
                                    </p>
                                    <p>
                                        <strong>Max Group Size:</strong> {result.maxGroupSize}
                                    </p>
                                    <p>
                                        <strong>Price:</strong> Rs.{result.price}
                                    </p>
                                    <p>
                                        <strong>Available Dates:</strong>{' '}
                                        {result.availableDates.map((date) => moment(date).format('YYYY-MM-DD')).join(', ')}
                                    </p>
                                    <p>
                                        <strong>Location:</strong> {result.location}
                                    </p>
                                    <Link to={`/packages/${result._id}`}>
                                        <button className="view-btn">View Package</button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="no-results">No results found</p>
                )}
            </div>
        </div>
        </div>
    );
};

export default Search;
