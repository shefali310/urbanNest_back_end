import express, { Request, Response } from "express";
import Hotel, { HotelType } from "../models/hotel";
import User from "../models/user";

const router = express.Router();

// Fetch all the users
router.get("/getallusers", async (req, res) => {
  try {
    const getallUsers = await User.find({ role: "user" });

    // console.log(getallUsers);

    res.json(getallUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/hotelbyuserid/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    // Corrected: Access userId from params

    const hotels = await Hotel.find({
      bookings: { $elemMatch: { userId: req.params.userId } },
    });

    // Corrected: Find hotels with matching userId
    const results = hotels.map((hotel) => {
      const userBookings = hotel.bookings.filter(
        (booking) => booking.userId === req.params.userId
      );

      // Create a new HotelType object with filtered user bookings
      const hotelWithUserBookings: HotelType = {
        ...hotel.toObject(),
        bookings: userBookings,
      };

      return hotelWithUserBookings;
    });

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
