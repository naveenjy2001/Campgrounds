const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas.js");
const { isLoggedIn } = require("../middleware.js");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("index", { campgrounds });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("new");
});

router.post(
  "/new",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const camp = new Campground(req.body);
    await camp.save();
    req.flash("success", "Successfully created a campground!");
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate("reviews");
    if (!camp) {
      req.flash("error", "Campground Not Found");
      return res.redirect("/campgrounds");
    } else {
      res.render("show", { camp });
    }
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    if (!camp) {
      req.flash("error", "Campground Not Found");
      res.redirect("/campgrounds");
    } else {
      res.render("edit", { camp });
    }
  })
);

router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body });
    req.flash("success", "Successfully updated the campground!");
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the campground!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
