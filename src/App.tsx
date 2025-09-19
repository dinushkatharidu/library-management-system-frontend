import NavBar from "./components/NavBar";
import Books from "./pages/Books";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Members from "./pages/Members";
import BorrowReturn from "./pages/BorrowReturn";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/members" element={<Members />} />
        <Route path="/barrow" element={<BorrowReturn />} />
      </Routes>
    </Router>
  );
}

export default App;
