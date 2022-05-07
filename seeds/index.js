const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.random() * 1000;

    const camp = new Campground({
      //your user id
      author: "6229a6961f93de7da175a807",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      price,
      description:
        "  Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi, amet dolore. Magni, alias ex! Vitae reprehenderit, asperiores assumenda sint voluptate est maiores eos vero, minus veritatis nisi tempore at ratione.",
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      image: [
        {
          url: "https://res.cloudinary.com/dkhpd6vxr/image/upload/v1650719866/YelpCamp/l6uvcmcsrxw4suhmlw9s.jpg",
          filename: "YelpCamp/l6uvcmcsrxw4suhmlw9s",
        },
        {
          url: "https://res.cloudinary.com/dkhpd6vxr/image/upload/v1650719873/YelpCamp/l2wglbmlxmmqq99cwang.jpg",
          filename: "YelpCamp/l2wglbmlxmmqq99cwang",
        },
        {
          url: "https://res.cloudinary.com/dkhpd6vxr/image/upload/v1650719877/YelpCamp/lyrwnc7sezuwiy0o4nn5.jpg",
          filename: "YelpCamp/lyrwnc7sezuwiy0o4nn5",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
