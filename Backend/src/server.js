
const app = require("./app");



// Create server
const server = app.listen(process.env.PORT || 4000, () => {
  console.log(
    `Server started on port ${process.env.PORT || 4000} in ${process.env.NODE_ENV} mode`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});
