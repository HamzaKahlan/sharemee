const CustomError = require("../ErrorHandler/CustumError");

// Successful response structure
const successResponse = (message, data) => {
  return { success: true, message, data };
};

// Error response structure
const errorResponse = (message, status) => {
  return new CustomError(message, status, false);
};

module.exports={
  successResponse,
  errorResponse
}