// src/components/Reviews.jsx
import axios from "axios";
import React, { useState, useEffect } from "react";

const BASE_URL = "http://localhost:8080/api/reviews";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    // Fetch all reviews (GET is public)
    axios
      .get(BASE_URL)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Failed to load reviews", err));
  }, []);

  const submitReview = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("You must be logged in to submit a review");
      return;
    }

    console.log("Submitting review with token:", token);

    try {
      const response = await axios.post(
        BASE_URL,
        { text: reviewText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Review added:", response.data);
      setReviews((prev) => [...prev, response.data]);
      setReviewText("");
    } catch (err) {
      console.error("Error adding review:", err);
      alert("Failed to add review. Check console for details.");
    }
  };

  const deleteReview = async (id) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("You must be logged in to delete a review");
      return;
    }

    console.log(`Deleting review id ${id} with token:`, token);

    try {
      await axios.delete(`${BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Review deleted:", id);
      setReviews((prev) => prev.filter((rev) => rev.id !== id));
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Failed to delete review. Check console for details.");
    }
  };

  return (
    <div>
      <h2>Reviews</h2>
      <ul>
        {reviews.map((rev) => (
          <li key={rev.id}>
            {rev.text}{" "}
            <button onClick={() => deleteReview(rev.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Write your review here..."
      ></textarea>
      <button onClick={submitReview}>Submit Review</button>
    </div>
  );
}

export default Reviews;
