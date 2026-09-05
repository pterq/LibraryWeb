import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import AdminPanelPage from "./Pages/AdminPanelPage";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import NavBar from "./component/common/NavBar";
import AboutUsPage from "./Pages/AboutUsPage";
import MissingPage from "./component/common/MissingPage";
import BooksMainPage from "./Pages/BooksMainPage";
import UserBooksPage from "./Pages/UserBooksPage";
import MyFeesPage from "./Pages/MyFeesPage";
import UserSettingsPage from "./Pages/LoginPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import FeeCard from "./component/fees/FeeCard";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./component/common/ProtectedRoute";
import UserBookCard from "./component/books/UserBookCard";
import BookCardPage from "./Pages/BookCardPage";

import BookPage from "./component/dashboards/ViewEditAddPages/Book-CRUD/BookPage";
import AuthorPageViewEditAdd from "./component/dashboards/CRUDs/Author/AuthorPageViewEditAdd";
import BookCopyPageViewEditAdd from "./component/dashboards/ViewEditAddPages/BookCopy-CRUD/BookCopyPageViewEditAdd";
import CategoryPageViewEditAdd from "./component/dashboards/ViewEditAddPages/Category-CRUD/CategoryPageViewEditAdd";
import ViewEditAddLoansUserPage from "./component/dashboards/Tables/ViewEditAddLoansUserPage";
import ViewEditAddFeesUserPage from "./component/dashboards/Tables/ViewEditAddFeesUserPage";
import UserPageViewEditAdd from "./component/dashboards/ViewEditAddPages/User-CRUD/UserPageViewEditAdd";
import ViewEditAddCartPage from "./component/dashboards/Tables/ViewEditAddCartPage";
import CartItemPageViewEditAdd from "./component/dashboards/ViewEditAddPages/CartItem-CRUD/CartItemPageViewEditAdd";
import FeeItemPageViewEditAdd from "./component/dashboards/ViewEditAddPages/Fee-CRUD/FeeItemPageViewEditAdd";
import LoanItemPage from "./component/dashboards/ViewEditAddPages/Loan-CRUD/LoanItemPageViewEditAdd";

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

						{/* Protected pages */}
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

						{/* ADMIN PANEL — poprawiony routing */}
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

						{/* LIBRARIAN PANEL — działa identycznie */}
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

						{/* CRUD ROUTES */}
						<Route
							path="/book/add"
							element={
								<ProtectedRoute>
									<BookPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/book/view/:id"
							element={
								<ProtectedRoute>
									<BookPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/book-copy/add"
							element={
								<ProtectedRoute>
									<BookCopyPageViewEditAdd />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/book-copy/view/:id"
							element={
								<ProtectedRoute>
									<BookCopyPageViewEditAdd />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/category/add"
							element={
								<ProtectedRoute>
									<CategoryPageViewEditAdd />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/category/view/:id"
							element={
								<ProtectedRoute>
									<CategoryPageViewEditAdd />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/author/add"
							element={
								<ProtectedRoute>
									<AuthorPageViewEditAdd />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/author/view/:id"
							element={
								<ProtectedRoute>
									<AuthorPageViewEditAdd />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/user/add"
							element={
								<ProtectedRoute>
									<UserPageViewEditAdd />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/user/view/:id"
							element={
								<ProtectedRoute>
									<UserPageViewEditAdd />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/userLoans/add"
							element={
								<ProtectedRoute>
									<ViewEditAddLoansUserPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/userLoans/view/:id"
							element={
								<ProtectedRoute>
									<ViewEditAddLoansUserPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/loanItem/add"
							element={
								<ProtectedRoute>
									<LoanItemPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/loanItem/view/:id"
							element={
								<ProtectedRoute>
									<LoanItemPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/userFees/add"
							element={
								<ProtectedRoute>
									<ViewEditAddFeesUserPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/userFees/view/:id"
							element={
								<ProtectedRoute>
									<ViewEditAddFeesUserPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/feeItem/add"
							element={
								<ProtectedRoute>
									<FeeItemPageViewEditAdd />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/feeItem/view/:id"
							element={
								<ProtectedRoute>
									<FeeItemPageViewEditAdd />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/shoppingCart/add"
							element={
								<ProtectedRoute>
									<ViewEditAddCartPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/shoppingCart/view/:id"
							element={
								<ProtectedRoute>
									<ViewEditAddCartPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/shoppingCartItem/add"
							element={
								<ProtectedRoute>
									<CartItemPageViewEditAdd />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/shoppingCartItem/view/:id"
							element={
								<ProtectedRoute>
									<CartItemPageViewEditAdd />
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
