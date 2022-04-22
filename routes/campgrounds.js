const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const {
  isLoggedIn,
  isAuthor,
  validateCampground,
} = require("../middleware.js");

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
    camp.author = req.user._id;
    await camp.save();
    req.flash("success", "Successfully created a campground!");
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
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
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
      req.flash("error", "Campground Not Found");
      return res.redirect("/campgrounds");
    }
    res.render("edit", { camp });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
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
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the campground!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
