import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./component/common/NavBar";
import AboutUsPage from "./component/common/AboutUsPage";
import BooksPage from "./component/books/BooksPage";
import UserBooksPage from "./component/books/UserBooksPage";
import MyFeesPage from "./component/fees/MyFeesPage";
import CartPage from "./component/shoppingCart/CartPage";
import LogoutPage from "./component/login-register-logout/LogoutPage";
import SettingsPage from "./component/user/SettingsPage";
import LoginPage from "./component/login-register-logout/LoginPage";
import RegisterPage from "./component/login-register-logout/RegisterPage";
import BookCard from "./component/books/BookCard";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./component/common/ProtectedRoute";

function App() {
	return (
		<AuthProvider>
			<Router>
				<NavBar />

				<div className="container mt-5">
					<Routes>
						{/* Public pages */}
						<Route path="/" element={<BooksPage />} />
						<Route path="/about-us" element={<AboutUsPage />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/book/:id" element={<BookCard />} />

						{/* Protected pages */}
						<Route
							path="/my-books"
							element={
								<ProtectedRoute>
									<UserBooksPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/my-fees"
							element={
								<ProtectedRoute>
									<MyFeesPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/shopping-cart"
							element={
								<ProtectedRoute>
									<CartPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/settings"
							element={
								<ProtectedRoute>
									<SettingsPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/logout"
							element={
								<ProtectedRoute>
									<LogoutPage />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
