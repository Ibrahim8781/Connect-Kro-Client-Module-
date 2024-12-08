const axios = require('axios');
const asyncHandler = require('express-async-handler');
const Review = require('../models/reviewSchema');
const Gig = require('../models/gigSchema');

// Add the Gemini API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Add this key to your .env file

// @desc Add a review for a gig
// @route POST /api/reviews
// @access Private
const addReview = asyncHandler(async (req, res) => {
  const { gigId, rating, comment } = req.body;

  const gig = await Gig.findById(gigId);
  if (!gig) {
    res.status(404);
    throw new Error('Gig not found');
  }

  // Call Gemini API for sentiment analysis
  let sentiment = 'neutral'; // Default sentiment
  try {
    const response = await axios.post(
      'https://api.gemini.com/v1/sentiment',
      { text: comment },
      {
        headers: {
          Authorization: `Bearer ${GEMINI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    sentiment = response.data.sentiment || sentiment; // Use the API result if available
  } catch (error) {
    console.error('Gemini API error:', error.message); // Log the error but don't block review creation
  }

  // Create the review with the sentiment
  const review = new Review({
    gig: gigId,
    client: req.user.id,
    rating,
    comment,
    sentiment, // Save the sentiment analysis result
  });

  await review.save();

  // Update gig's average rating
  const reviews = await Review.find({ gig: gigId });
  gig.averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);
  await gig.save();

  res.status(201).json(review);
});

// @desc Edit an existing review
// @route PUT /api/reviews/:id
// @access Private
const editReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.client.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to edit this review');
  }

  const timeElapsed = Date.now() - new Date(review.createdAt).getTime();
  const timeLimit = 48 * 60 * 60 * 1000; // 48 hours in milliseconds

  if (timeElapsed > timeLimit) {
    res.status(403);
    throw new Error('Editing time frame has expired');
  }

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;

  await review.save();
  res.json(review);
});


// @desc Get all reviews by a client
// @route GET /api/reviews
// @access Private
const getClientReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ client: req.user.id })
    .populate('gig')
    .select('gig rating comment sentiment createdAt'); // Include sentiment in the response
  res.json(reviews);
});

module.exports = { addReview , editReview, getClientReviews };