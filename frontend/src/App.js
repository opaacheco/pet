import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

//components
import Home from "./components/pages/Home";
import Navbar from "./components/layouts/Navbar";
import Login from "./components/pages/Login";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
