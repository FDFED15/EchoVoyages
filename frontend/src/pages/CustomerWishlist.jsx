import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar';

const CustomerWishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');
    const customerId = token ? jwtDecode(token).id : null;

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await fetch(`http://localhost:5000/wishlist/customer/${customerId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch wishlist.');
                }

                const data = await response.json();
                console.log('Fetched data:', data);

                // Ensure data is an array, if not wrap it in an array
                if (Array.isArray(data)) {
                    setWishlist(data);
                } else if (data && typeof data === 'object') {
                    setWishlist([data]); // Wrap the object in an array
                } else {
                    setError('Received data is not valid.');
                }

                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        if (customerId) {
            fetchWishlist();
        }
    }, [customerId, token]);

    useEffect(() => {
        console.log('Wishlist updated:', wishlist);
    }, [wishlist]);

    const handleRemoveItem = async (itemId) => {
        try {
            const response = await fetch(`http://localhost:5000/wishlist/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                setWishlist((prevWishlist) => prevWishlist.filter(item => item._id !== itemId));
                alert(data.message);
            } else {
                alert(data.message || 'Failed to remove item from wishlist');
            }
        } catch (error) {
            console.error('Error removing item from wishlist:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <Navbar />
            <h1>My Wishlist</h1>
            {wishlist.length > 0 ? (
                <ul>
                    {wishlist.map((item) => (
                        <li key={item._id}>
                            {item.packageId ? (
                                <>
                                    <h2>{item.packageId.name}</h2>
                                    <p>{item.packageId.description}</p>
                                    <p>Price: {item.packageId.price}</p>
                                    <p>Duration: {item.packageId.duration} days</p>
                                    {item.packageId.image && item.packageId.image.length > 0 ? (
                                        <img
                                            src={`http://localhost:5000${item.packageId.image[0]}`} 
                                            alt={item.packageId.name}
                                            style={{ width: '200px', height: '150px' }}
                                        />
                                    ) : (
                                        <p>No image available</p>
                                    )}
                                </>
                            ) : (
                                <p>Package details unavailable.</p>
                            )}
                            <button onClick={() => handleRemoveItem(item._id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No items in your wishlist.</p>
            )}
        </div>
    );
};

export default CustomerWishlist;