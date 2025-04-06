export const adminLinks = [
  { title: "DashBoard" },
  { title: "Sales", path: "sales" },
  { title: "Users" },
  {
    title: "Hotels",
    subLinks: [
      { title: "Add Hotel", path: "add_hotel" },
      {
        title: "Add Room To Hotel",
        path: "add_room",
      },
      {
        title: "List All Hotels",
        path: "all_hotels",
      },
    ],
  },
  {
    title: "Spots",
    subLinks: [
      { title: "Add Spot", path: "add_spot" },
      {
        title: "Add Ticket to Spot",
        path: "add_ticket",
      },
      { title: "List All Spots", path: "all_spots" },
    ],
  },
];

export const hotelLinks = [
  { title: "Sales", path: "sales" },
  {
    title: "Hotels",
    subLinks: [{ title: "Add Room To Hotel", path: "add_room" }],
  },
];

export const spotLinks = [
  { title: "Sales", path: "sales" },
  {
    title: "Spots",
    subLinks: [{ title: "Add Ticket to Spot", path: "add_ticket" }],
  },
];
