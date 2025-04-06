import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminSignIn from "./Screen/AdminSignIn";
import UserSignIn from "./Screen/UserSignIn";
import Dashboard from "./Screen/Dashboard";
import AddHotelComponent from "./components/AddHotelComponent";
import AddRoomComponent from "./components/AddRoomComponent";
import AddSpotComponent from "./components/AddSpotComponent";
import AddTicketComponent from "./components/AddTicketComponent";
import AllHotelComponent from "./components/AllHotelComponent";
import AllSpotComponent from "./components/AllSpotComponent";
import SalesComponent from "./components/SalesComponent";
import Home from "./Screen/Home";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="admin_signin" element={<AdminSignIn />} />
          <Route path="user_signin" element={<UserSignIn />} />
          <Route path="dashboard" element={<Dashboard />}>
            <Route path="*" element={<></>} />
            <Route path="add_hotel/:_id" element={<AddHotelComponent />} />
            <Route path="add_room/:_id" element={<AddRoomComponent />} />
            <Route path="add_spot/:_id" element={<AddSpotComponent />} />
            <Route path="add_ticket/:_id" element={<AddTicketComponent />} />
            <Route path="add_hotel" element={<AddHotelComponent />} />
            <Route path="add_room" element={<AddRoomComponent />} />
            <Route path="add_spot" element={<AddSpotComponent />} />
            <Route path="add_ticket" element={<AddTicketComponent />} />
            <Route path="all_hotels" element={<AllHotelComponent />} />
            <Route path="all_spots" element={<AllSpotComponent />} />
            <Route path="sales" element={<SalesComponent />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
