const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const campgrounds = require("../controllers/campgrounds");
const {
  isLoggedIn,
  isAuthor,
  validateCampground,
} = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudinary");

const upload = multer({ storage });

router.get("/", catchAsync(campgrounds.index));

router
  .route("/new")
  .get(isLoggedIn, campgrounds.renderNewForm)
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createNewCamp)
  );

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCamp))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.editCamp)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
