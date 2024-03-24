import express, { Request, Response } from "express";
import verifyToken from "../../middleware/auth";
import UserType from "../models/user";
import Hotel from "../models/hotel";
import User from "../models/user";

const router = express.Router();

// /api/users-with-bookings

// Fetch users along with their bookings
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    // Find users with bookings associated with the authenticated user
    const usersWithBookings = await Hotel.find({
      bookings: { $exists: true, $ne: [] }, // Find users with at least one booking
    }).populate("bookings"); // Populate the bookings field

    // Send the users along with their populated bookings
    res.status(200).json(usersWithBookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch users with bookings" });
  }
});

// Fetch users with their associated hotels
router.get("/", async (req, res) => {
  try {
    const usersWithHotels = await User.find().populate("hotels");
    res.json(usersWithHotels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
