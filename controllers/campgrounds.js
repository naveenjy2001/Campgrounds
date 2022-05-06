const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("new");
};

module.exports.createNewCamp = async (req, res) => {
  const camp = new Campground(req.body);
  camp.image = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  camp.author = req.user._id;
  await camp.save();
  req.flash("success", "Successfully created a campground!");
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.showCamp = async (req, res) => {
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
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (!camp) {
    req.flash("error", "Campground Not Found");
    return res.redirect("/campgrounds");
  }
  res.render("edit", { camp });
};

module.exports.editCamp = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findByIdAndUpdate(id, { ...req.body });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  camp.image.push(...imgs);
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await camp.updateOne({
      $pull: { image: { filename: { $in: req.body.deleteImages } } },
    });
  }
  camp.save();
  req.flash("success", "Successfully updated the campground!");
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.deleteCamp = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the campground!");
  res.redirect("/campgrounds");
};
