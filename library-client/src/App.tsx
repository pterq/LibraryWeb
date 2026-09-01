import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import LibrarianPanelPage from "./component/librarian/LibrarianPanelPage";
import AdminPanelPage from "./component/admin/AdminPanelPage";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./component/common/NavBar";
import AboutUsPage from "./component/common/AboutUsPage";
import MissingPage from "./component/common/MissingPage";
import BooksPage from "./component/books/BooksPage";
import UserBooksPage from "./component/books/UserBooksPage";
import MyFeesPage from "./component/fees/MyFeesPage";
import LogoutPage from "./component/login-register-logout/LogoutPage";
import SettingsPage from "./component/user/SettingsPage";
import LoginPage from "./component/login-register-logout/LoginPage";
import RegisterPage from "./component/login-register-logout/RegisterPage";
import FeeCard from "./component/fees/FeeCard";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./component/common/ProtectedRoute";
import UserBookCard from "./component/books/UserBookCard";
import BookCard from "./component/books/BookCard";
import ViewEditAddBookPage from "./component/dashboards/ViewEditAddBookPage";
import ViewEditAddAuthorPage from "./component/dashboards/ViewEditAddAuthorPage";
import ViewEditAddBookCopyPage from "./component/dashboards/ViewEditAddBookCopyPage";
import ViewEditAddCategoryPage from "./component/dashboards/ViewEditAddCategoryPage";
import ViewEditAddLoanPage from "./component/dashboards/ViewEditAddLoanPage";
import ViewEditAddFeePage from "./component/dashboards/ViewEditAddFeePage";
import ViewEditAddUserPage from "./component/dashboards/ViewEditAddUserPage";
import ViewEditAddCartPage from "./component/dashboards/ViewEditAddCartPage";

function App() {
	return (
		<AuthProvider>
			<Router>
				<NavBar />
				<div className="container-fluid mt-5">
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
									<SettingsPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/admin-panel"
							element={
								<ProtectedRoute>
									<AdminPanelPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/librarian-panel"
							element={
								<ProtectedRoute>
									<LibrarianPanelPage />
								</ProtectedRoute>
							}
						/>

						<>
							<>
								<Route
									path="/book/add"
									element={
										<ProtectedRoute>
											<ViewEditAddBookPage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/book/view/:id"
									element={
										<ProtectedRoute>
											<ViewEditAddBookPage />
										</ProtectedRoute>
									}
								/>
							</>
							<>
								<Route
									path="/book-copy/add"
									element={
										<ProtectedRoute>
											<ViewEditAddBookCopyPage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/book-copy/view/:id"
									element={
										<ProtectedRoute>
											<ViewEditAddBookCopyPage />
										</ProtectedRoute>
									}
								/>
							</>
							<>
								<Route
									path="/category/add"
									element={
										<ProtectedRoute>
											<ViewEditAddCategoryPage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/category/view/:id"
									element={
										<ProtectedRoute>
											<ViewEditAddCategoryPage />
										</ProtectedRoute>
									}
								/>
							</>
							<>
								<Route
									path="/category/add"
									element={
										<ProtectedRoute>
											<ViewEditAddCategoryPage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/category/view/:id"
									element={
										<ProtectedRoute>
											<ViewEditAddCategoryPage />
										</ProtectedRoute>
									}
								/>
							</>
							<>
								<Route
									path="/author/add"
									element={
										<ProtectedRoute>
											<ViewEditAddAuthorPage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/author/view/:id"
									element={
										<ProtectedRoute>
											<ViewEditAddAuthorPage />
										</ProtectedRoute>
									}
								/>
							</>
							<>
								<Route
									path="/user/add"
									element={
										<ProtectedRoute>
											<ViewEditAddUserPage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/user/view/:id"
									element={
										<ProtectedRoute>
											<ViewEditAddUserPage />
										</ProtectedRoute>
									}
								/>
							</>
							<>
								<Route
									path="/loan/add"
									element={
										<ProtectedRoute>
											<ViewEditAddLoanPage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/loan/view/:id"
									element={
										<ProtectedRoute>
											<ViewEditAddLoanPage />
										</ProtectedRoute>
									}
								/>
							</>
							<>
								<Route
									path="/fee/add"
									element={
										<ProtectedRoute>
											<ViewEditAddFeePage />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/fee/view/:id"
									element={
										<ProtectedRoute>
											<ViewEditAddFeePage />
										</ProtectedRoute>
									}
								/>
							</>
							<>
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
							</>
						</>

						<></>

						<Route
							path="/logout"
							element={
								<ProtectedRoute>
									<LogoutPage />
								</ProtectedRoute>
							}
						/>

						{/* Fallback page for non-existing routes */}
						<Route path="*" element={<MissingPage />} />
					</Routes>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
