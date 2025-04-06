const adminModel = require("../models/adminUser");
const fs = require("fs");
const path = require("path");
const hotelModel = require("../models/hotel");
const roomModel = require("../models/room");
const spotModel = require("../models/spot");
const ticketModel = require("../models/ticket");
const reservationModel = require("../models/reservation");
const {
  generateIdentifier,
  generateMonthList,
  getMonthStartAndEnd,
} = require("../utils/common");
const adminController = {
  signIn: async (req, res) => {
    try {
      const { name, password, role } = req.body;
      const admin = await adminModel.findOne({
        name,
        password,
        role,
      });
      if (admin) {
        return res.status(200).json({
          message: "Admin SignIn Successfully",
        });
      }
      return res.status(200).json({
        message: "Invalid Credentials",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  userSignIn: async (req, res) => {
    try {
      const { name, password, role } = req.body;
      const user = await adminModel.findOne({
        name,
        password,
        role,
      });
      if (user) {
        const ifBelongtoHotel = await hotelModel.findOne({
          identifier: user.name,
        });
        const ifBelongtoSpot = await spotModel.findOne({
          identifier: user.name,
        });
        if (ifBelongtoHotel) {
          return res.status(200).json({
            message: "Hotel SignIn Successfully",
          });
        }
        if (ifBelongtoSpot) {
          return res.status(200).json({
            message: "Spot SignIn Successfully",
          });
        }
      }
      return res.status(200).json({
        message: "Invalid Credentials",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  addHotel: async (req, res) => {
    try {
      const {
        name,
        status,
        type,
        location,
        description,
        amenities,
        checkIn,
        checkOut,
        openingDays,
        fee,
        position,
      } = req.body;

      const imagePaths = req.files.map((file) => path.basename(file.path));
      const identifier = generateIdentifier(name);
      const newHotel = new hotelModel({
        name,
        identifier,
        status,
        type,
        location,
        description,
        fee,
        amenities: JSON.parse(amenities),
        checkIn: JSON.parse(checkIn),
        checkOut: JSON.parse(checkOut),
        openingDays: JSON.parse(openingDays),
        position: {
          lat: JSON.parse(position)[0],
          lng: JSON.parse(position)[1],
        },
        images: imagePaths,
      });

      await newHotel.save();

      return res.status(200).json({
        message: "Hotel Added Successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  updateHotel: async (req, res) => {
    try {
      const {
        id,
        name,
        status,
        type,
        location,
        description,
        amenities,
        checkIn,
        checkOut,
        openingDays,
        fee,
        position,
        existImages,
      } = req.body;

      const imagePaths = req.files.map((file) => path.basename(file.path));

      const hotel = await hotelModel.findById(id);
      const removedImages = hotel.images.filter(
        (image) => !existImages.includes(image)
      );

      removedImages.forEach((image) => {
        fs.unlink(path.join(__dirname, `../uploads/${image}`), (err) => {
          if (err) {
            console.error(err);
          }
        });
      });

      hotel.name = name;
      hotel.status = status;
      hotel.type = type;
      hotel.location = location;
      hotel.description = description;
      hotel.amenities = JSON.parse(amenities);
      hotel.checkIn = JSON.parse(checkIn);
      hotel.checkOut = JSON.parse(checkOut);
      hotel.openingDays = JSON.parse(openingDays);
      hotel.fee = fee;
      hotel.position = {
        lat: JSON.parse(position)[0],
        lng: JSON.parse(position)[1],
      };
      hotel.images = [...JSON.parse(existImages), ...imagePaths];

      await hotel.save();

      return res.status(200).json({
        message: "Hotel Updated Successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  addRoom: async (req, res) => {
    try {
      const {
        hotel,
        name,
        guestAllowed,
        amenities,
        price,
        wasPrice,
        roomAvailable,
        cancellationPolicy,
      } = req.body;

      const imagePaths = req.files.map((file) => path.basename(file.path));

      const newRoom = new roomModel({
        hotel,
        name,
        guestAllowed,
        amenities: JSON.parse(amenities),
        price,
        wasPrice,
        roomAvailable,
        cancellationPolicy,
        images: imagePaths,
      });

      await newRoom.save();

      return res.status(200).json({
        message: "Room Added Successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  updateRoom: async (req, res) => {
    try {
      const {
        id,
        hotel,
        name,
        guestAllowed,
        amenities,
        price,
        wasPrice,
        roomAvailable,
        cancellationPolicy,
        existImages,
      } = req.body;

      const imagePaths = req.files.map((file) => path.basename(file.path));

      const room = await roomModel.findById(id);
      const removedImages = room.images.filter(
        (image) => !existImages.includes(image)
      );

      removedImages.forEach((image) => {
        fs.unlink(path.join(__dirname, `../uploads/${image}`), (err) => {
          if (err) {
            console.error(err);
          }
        });
      });

      room.hotel = hotel;
      room.name = name;
      room.guestAllowed = guestAllowed;
      room.amenities = JSON.parse(amenities);
      room.price = price;
      room.wasPrice = wasPrice;
      room.roomAvailable = roomAvailable;
      room.cancellationPolicy = cancellationPolicy;
      room.images = [...JSON.parse(existImages), ...imagePaths];

      await room.save();

      return res.status(200).json({
        message: "Room Updated Successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  addSpot: async (req, res) => {
    try {
      const {
        name,
        description,
        location,
        position,
        amenities,
        type,
        entrancePolicies,
        closingPolicies,
        openingDays,
        fee,
      } = req.body;

      const imagePaths = req.files.map((file) => path.basename(file.path));
      const identifier = generateIdentifier(name);
      const newSpot = new spotModel({
        name,
        identifier,
        description,
        location,
        type,
        fee,
        position: {
          lat: JSON.parse(position)[0],
          lng: JSON.parse(position)[1],
        },
        amenities: JSON.parse(amenities),
        entrancePolicies: JSON.parse(entrancePolicies),
        closingPolicies: JSON.parse(closingPolicies),
        openingDays: JSON.parse(openingDays),
        images: imagePaths,
      });

      await newSpot.save();

      return res.status(200).json({
        message: "Spot Added Successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  updateSpot: async (req, res) => {
    try {
      const {
        id,
        name,
        type,
        description,
        amenities,
        openingDays,
        existImages,
        position,
        location,
        entrancePolicies,
        closingPolicies,
        fee,
      } = req.body;

      const imagePaths = req.files.map((file) => path.basename(file.path));

      const spot = await spotModel.findById(id);
      const removedImages = spot.images.filter(
        (image) => !existImages.includes(image)
      );

      removedImages.forEach((image) => {
        fs.unlink(path.join(__dirname, `../uploads/${image}`), (err) => {
          if (err) {
            console.error(err);
          }
        });
      });

      spot.name = name;
      spot.description = description;
      spot.type = type;
      spot.amenities = JSON.parse(amenities);
      spot.location = location;
      spot.position = {
        lat: JSON.parse(position)[0],
        lng: JSON.parse(position)[1],
      };
      spot.openingDays = JSON.parse(openingDays);
      spot.entrancePolicies = JSON.parse(entrancePolicies);
      spot.closingPolicies = JSON.parse(closingPolicies);
      spot.fee = fee;
      spot.images = [...JSON.parse(existImages), ...imagePaths];

      await spot.save();

      return res.status(200).json({
        message: "Spot Updated Successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  addTicket: async (req, res) => {
    try {
      const {
        spot,
        name,
        guestAllowed,
        amenities,
        cancellationPolicy,
        price,
        wasPrice,
        roomAvailable,
      } = req.body;

      const imagePaths = req.files.map((file) => path.basename(file.path));

      const newTicket = new ticketModel({
        spot,
        name,
        guestAllowed,
        amenities: JSON.parse(amenities),
        cancellationPolicy,
        price,
        wasPrice,
        roomAvailable,
        images: imagePaths,
      });

      await newTicket.save();

      return res.status(200).json({
        message: "Ticket Added Successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  updateTicket: async (req, res) => {
    try {
      const {
        id,
        spot,
        name,
        guestAllowed,
        amenities,
        cancellationPolicy,
        price,
        wasPrice,
        roomAvailable,
        existImages,
      } = req.body;

      const imagePaths = req.files.map((file) => path.basename(file.path));

      const ticket = await ticketModel.findById(id);
      const removedImages = ticket.images.filter(
        (image) => !existImages.includes(image)
      );

      removedImages.forEach((image) => {
        fs.unlink(path.join(__dirname, `../uploads/${image}`), (err) => {
          if (err) {
            console.error(err);
          }
        });
      });

      ticket.spot = spot;
      ticket.name = name;
      ticket.guestAllowed = guestAllowed;
      ticket.amenities = JSON.parse(amenities);
      ticket.price = price;
      ticket.wasPrice = wasPrice;
      ticket.roomAvailable = roomAvailable;
      ticket.cancellationPolicy = cancellationPolicy;
      ticket.images = [...JSON.parse(existImages), ...imagePaths];

      await ticket.save();

      return res.status(200).json({
        message: "Ticket Updated Successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  getHotelIdentifiers: async (req, res) => {
    try {
      const hotels = await hotelModel.find({}, "identifier");
      return res.status(200).json({
        hotels,
        message: "Hotel Names Fetched Successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  getSpotIdentifiers: async (req, res) => {
    try {
      const spots = await spotModel.find({}, "identifier");
      return res.status(200).json({
        spots,
        message: "Spot Names Fetched Successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  allHotels: async (req, res) => {
    const hotels = await hotelModel.find({}, { name: 1 });
    res.json({
      data: hotels,
      message: "All hotels",
    });
  },
  getHotel: async (req, res) => {
    const { id } = req.params;
    const hotel = await hotelModel.findById(id);
    const rooms = await roomModel.find({ hotel: id }, { name: 1 });
    const hotelObj = hotel.toObject();
    hotelObj.rooms = rooms;
    res.json({
      data: hotelObj,
      message: "Hotel",
    });
  },
  getRoom: async (req, res) => {
    const { id } = req.params;
    const room = await roomModel.findById(id).populate("hotel", "identifier");
    res.json({
      data: room,
      message: "Room",
    });
  },
  getSpot: async (req, res) => {
    const { id } = req.params;
    const spot = await spotModel.findById(id);
    const tickets = await ticketModel.find({ spot: id }, { name: 1 });
    const spotObj = spot.toObject();
    spotObj.tickets = tickets;
    res.json({
      data: spotObj,
      message: "Spot",
    });
  },
  getTicket: async (req, res) => {
    const { id } = req.params;
    const ticket = await ticketModel
      .findById(id)
      .populate("spot", "identifier");
    res.json({
      data: ticket,
      message: "Ticket",
    });
  },
  deleteHotel: async (req, res) => {
    const { id } = req.params;
    const hotel = await hotelModel.findById(id);
    hotel.images.forEach((image) => {
      fs.unlink(path.join(__dirname, `../uploads/${image}`), (err) => {
        if (err) {
          console.error(err);
        }
      });
    });
    await hotelModel.findByIdAndDelete(id);
    const rooms = await roomModel.find({ hotel: id });
    rooms.forEach(async (room) => {
      room.images.forEach((image) => {
        fs.unlink(path.join(__dirname, `../uploads/${image}`), (err) => {
          if (err) {
            console.error(err);
          }
        });
      });
      await roomModel.findByIdAndDelete(room._id);
    });
    res.json({
      message: "Hotel deleted successfully",
    });
  },
  deleteRoom: async (req, res) => {
    const { id } = req.params;
    const room = await roomModel.findById(id);
    room.images.forEach((image) => {
      fs.unlink(path.join(__dirname, `../uploads/${image}`), (err) => {
        if (err) {
          console.error(err);
        }
      });
    });
    await roomModel.findByIdAndDelete(id);
    res.json({
      message: "Room deleted successfully",
    });
  },
  deleteSpot: async (req, res) => {
    const { id } = req.params;
    const spot = await spotModel.findById(id);
    spot.images.forEach((image) => {
      fs.unlink(path.join(__dirname, `../uploads/${image}`), (err) => {
        if (err) {
          console.error(err);
        }
      });
    });
    await spotModel.findByIdAndDelete(id);
    const tickets = await ticketModel.find({ spot: id });
    tickets.forEach(async (ticket) => {
      ticket.images.forEach((image) => {
        fs.unlink(path.join(__dirname, `../uploads/${image}`), (err) => {
          if (err) {
            console.error(err);
          }
        });
      });
      await ticketModel.findByIdAndDelete(ticket._id);
    });
    res.json({
      message: "Spot deleted successfully",
    });
  },
  deleteTicket: async (req, res) => {
    const { id } = req.params;
    const ticket = await ticketModel.findById(id);
    ticket.images.forEach((image) => {
      fs.unlink(path.join(__dirname, `../uploads/${image}`), (err) => {
        if (err) {
          console.error(err);
        }
      });
    });
    await ticketModel.findByIdAndDelete(id);
    res.json({
      message: "Ticket deleted successfully",
    });
  },
  identifierMatched: async (req, res) => {
    const { identifier } = req.params;
    const hotel = await hotelModel.findOne({
      identifier,
    });
    const spot = await spotModel.findOne({ identifier });
    if (hotel || spot) {
      const monthLists = generateMonthList(
        hotel ? hotel.createdAt : spot.createdAt
      );
      return res.status(200).json({
        message: "Identifier Matched",
        type: hotel ? "hotel" : "spot",
        data: hotel || spot,
        monthLists,
      });
    }
    return res.status(200).json({
      message: "Identifier Not Matched",
    });
  },
  getSales: async (req, res) => {
    try {
      const { identifier, selectedMonth, matchedType } = req.body;
      const { startDate, endDate } = getMonthStartAndEnd(selectedMonth);
      if (matchedType === "hotel") {
        const hotel = await hotelModel.findOne({ identifier });
        id = hotel._id;
        const saleDatas = await reservationModel
          .find({
            hotelId: id,
            buyDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
          })
          .populate("hotelId")
          .populate("roomId")
          .populate("userId")
          .sort({ buyDate: -1 });
        const totalSales = saleDatas.reduce(
          (total, sale) => total + sale.priceAmount,
          0
        );
        const totalFees = saleDatas.reduce(
          (total, sale) => total + sale.feeAmount,
          0
        );
        const totalRefunds = saleDatas.reduce(
          (total, sale) => total + sale.refundAmount,
          0
        );
        return res.status(200).json({
          message: "Sales Fetched",
          data: saleDatas || [],
          totalSales,
          totalFees,
          totalRefunds,
        });
      }
      if (matchedType === "spot") {
        const spot = await spotModel.findOne({ identifier });
        id = spot._id;
        const saleDatas = await reservationModel
          .find({
            spotId: id,
            buyDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
          })
          .populate("spotId")
          .populate("ticketId")
          .populate("userId")
          .sort({ buyDate: -1 });
        const totalSales = saleDatas.reduce(
          (total, sale) => total + sale.priceAmount,
          0
        );
        const totalFees = saleDatas.reduce(
          (total, sale) => total + sale.feeAmount,
          0
        );
        const totalRefunds = saleDatas.reduce(
          (total, sale) => total + sale.refundAmount,
          0
        );
        return res.status(200).json({
          message: "Sales Fetched",
          data: saleDatas || [],
          totalSales,
          totalFees,
          totalRefunds,
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
};

module.exports = adminController;
