import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import NavBar from "./component/common/NavBar";
import MissingPage from "./component/common/MissingPage";

import BooksMainPage from "./Pages/BooksMainPage";
import AboutUsPage from "./Pages/AboutUsPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import BookCardPage from "./Pages/BookCardPage";

import UserBooksPage from "./Pages/UserBooksPage";
import MyFeesPage from "./Pages/MyFeesPage";
import UserSettingsPage from "./Pages/LoginPage";
import FeeCard from "./component/fees/FeeCard";
import UserBookCard from "./component/books/UserBookCard";

import AdminPanelPage from "./Pages/AdminPanelPage";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./component/common/ProtectedRoute";

function App() {
	return (
		<AuthProvider>
			<Router>
				<NavBar />

				<div className="container-fluid mt-5">
					<Routes>
						{/* Public pages */}
						<Route path="/" element={<BooksMainPage />} />
						<Route path="/about-us" element={<AboutUsPage />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/book/:id" element={<BookCardPage />} />

						{/* User pages */}
						<Route
							path="/my-books"
							element={
								<ProtectedRoute>
									<UserBooksPage />
								</ProtectedRoute>
							}
						/>

						<Route path="/user-loan/:id" element={<UserBookCard />} />

						<Route
							path="/my-fees"
							element={
								<ProtectedRoute>
									<MyFeesPage />
								</ProtectedRoute>
							}
						/>

						<Route path="/fee/:id" element={<FeeCard />} />

						<Route
							path="/settings"
							element={
								<ProtectedRoute>
									<UserSettingsPage />
								</ProtectedRoute>
							}
						/>

						{/* ADMIN PANEL — SPA ===============================================================*/}
						<Route
							path="/admin-panel"
							element={<Navigate to="/admin-panel/dashboard" replace />}
						/>

						<Route
							path="/admin-panel/:section"
							element={
								<ProtectedRoute>
									<AdminPanelPage />
								</ProtectedRoute>
							}
						/>

						{/* LIBRARIAN PANEL — SPA tak samo jak admin */}
						<Route
							path="/librarian-panel"
							element={<Navigate to="/librarian-panel/dashboard" replace />}
						/>

						<Route
							path="/librarian-panel/:section"
							element={
								<ProtectedRoute>
									<AdminPanelPage />
								</ProtectedRoute>
							}
						/>

						{/* Logout */}
						<Route
							path="/logout"
							element={
								<ProtectedRoute>
									<LoginPage />
								</ProtectedRoute>
							}
						/>

						{/* Fallback */}
						<Route path="*" element={<MissingPage />} />
					</Routes>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
