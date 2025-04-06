const { Router } = require("express");
const adminController = require("../controllers/admin");
const router = Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up storage with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../../src/uploads");
    fs.exists(dir, (exist) => {
      if (!exist) {
        return fs.mkdir(dir, (error) => cb(error, dir));
      }
      return cb(null, dir);
    });
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});

const upload = multer({ storage: storage });
router.post("/signin", adminController.signIn);
router.post("/user_signin", adminController.userSignIn);
router.post("/add_hotel", upload.array("images"), adminController.addHotel);
router.post(
  "/update_hotel",
  upload.array("images"),
  adminController.updateHotel
);
router.post("/add_room", upload.array("images"), adminController.addRoom);
router.post("/update_room", upload.array("images"), adminController.updateRoom);
router.post("/add_spot", upload.array("images"), adminController.addSpot);
router.post("/update_spot", upload.array("images"), adminController.updateSpot);
router.post("/add_ticket", upload.array("images"), adminController.addTicket);
router.post(
  "/update_ticket",
  upload.array("images"),
  adminController.updateTicket
);
router.get("/get_hotel_identifiers", adminController.getHotelIdentifiers);
router.get("/get_spot_identifiers", adminController.getSpotIdentifiers);
router.get("/all_hotels", adminController.allHotels);
router.get("/get_hotel/:id", adminController.getHotel);
router.get("/get_room/:id", adminController.getRoom);
router.get("/get_spot/:id", adminController.getSpot);
router.get("/get_ticket/:id", adminController.getTicket);
router.delete("/delete_hotel/:id", adminController.deleteHotel);
router.delete("/delete_room/:id", adminController.deleteRoom);
router.delete("/delete_spot/:id", adminController.deleteSpot);
router.delete("/delete_ticket/:id", adminController.deleteTicket);
router.get(
  "/identifier_matched/:identifier",
  adminController.identifierMatched
);
router.post("/get_sales", adminController.getSales);
module.exports = router;
