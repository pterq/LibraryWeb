import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./component/common/NavBar";
import AboutUs from "./component/AboutUs";
import Books from "./component/books/Books";
import MyFees from "./component/fees/MyFees";
import Cart from "./component/shoppingCart/Cart";
import Logout from "./component/common/Logout";

import BookCard from "./component/books/BookCard";

function App() {
	return (
		<div className="container mt-5">
			<Router>
				<NavBar />
				<Routes>
					<Route path="/" element={<Books />} />
					<Route path="/about-us" element={<AboutUs />} />
					<Route path="/my-fees" element={<MyFees />} />
					<Route path="/shopping-cart" element={<Cart />} />
					<Route path="/logout" element={<Logout />} />

					<Route path="/book/:id" element={<BookCard />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
