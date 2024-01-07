export function errorHandler(error, req, res, next) {
  console.log(error.message);
  console.log(error.originalError);
  if (error.message === "not found") {
    res.status(404);
  } else if (error.message === "not found") {
    res.status(404);
  } else {
    res.status(500);
  }

  res.json({
    status: "error",
    message: error.message,
  });
}


