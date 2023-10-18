const axios = require("axios");

// Your OpenCage Data API Key
const apiKey = "3fc72809903340e59fc38b547297f53a";

// Function to geocode an address
const geocodeAddress = async (address) => {
  try {
    // Make a GET request to the OpenCage Data API
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        address
      )}&key=${apiKey}`
    );

    // Check if the request was successful
    if (response.status === 200) {
      // Parse the response data
      const data = response.data;

      // Extract the latitude and longitude from the response
      if (data.results && data.results.length > 0) {
        const { geometry } = data.results[0];
        const { lat, lng } = geometry;
        return { lat, lng };
      } else {
        return {
          lat: 30.4205162,
          lng: -9.5838532,
        };
      }
    } else {
      return {
        lat: 30.4205162,
        lng: -9.5838532,
      };
    }
  } catch (error) {
    return {
      lat: 30.4205162,
      lng: -9.5838532,
    };
  }
};

module.exports = geocodeAddress;
