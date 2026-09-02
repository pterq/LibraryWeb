import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import LibrarianPanelPage from "./component/dashboards/librarian/LibrarianPanelPage";
import AdminPanelPage from "./component/dashboards/page/AdminPanelPage";

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
import ViewEditAddBookPage from "./component/dashboards/ViewEditAddPages/ViewEditAddBookPage";
import ViewEditAddAuthorPage from "./component/dashboards/ViewEditAddPages/ViewEditAddAuthorPage";
import ViewEditAddBookCopyPage from "./component/dashboards/ViewEditAddPages/ViewEditAddBookCopyPage";
import ViewEditAddCategoryPage from "./component/dashboards/ViewEditAddPages/ViewEditAddCategoryPage";
import ViewEditAddLoanPage from "./component/dashboards/Tables/ViewEditAddLoansUserPage";
import ViewEditAddFeesUserPage from "./component/dashboards/Tables/ViewEditAddFeesUserPage";
import ViewEditAddUserPage from "./component/dashboards/ViewEditAddPages/ViewEditAddUserPage";
import ViewEditAddCartPage from "./component/dashboards/Tables/ViewEditAddCartPage";
import ViewEditAddCartItemPage from "./component/dashboards/ViewEditAddPages/ViewEditAddCartItemPage";
import ViewEditAddFeeItemPage from "./component/dashboards/ViewEditAddPages/ViewEditAddFeeItemPage";
import ViewEditAddLoanItemPage from "./component/dashboards/ViewEditAddPages/ViewEditAddLoanItemPage";
import ViewEditAddLoansUserPage from "./component/dashboards/Tables/ViewEditAddLoansUserPage";

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
								<>
									<Route
										path="/loanItem/add"
										element={
											<ProtectedRoute>
												<ViewEditAddLoanItemPage />
											</ProtectedRoute>
										}
									/>
									<Route
										path="/loanItem/view/:id"
										element={
											<ProtectedRoute>
												<ViewEditAddLoanItemPage />
											</ProtectedRoute>
										}
									/>
								</>
							</>
							<>
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
								<>
									<Route
										path="/feeItem/add"
										element={
											<ProtectedRoute>
												<ViewEditAddFeeItemPage />
											</ProtectedRoute>
										}
									/>
									<Route
										path="/feeItem/view/:id"
										element={
											<ProtectedRoute>
												<ViewEditAddFeeItemPage />
											</ProtectedRoute>
										}
									/>
								</>
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
								<>
									<Route
										path="/shoppingCartItem/add"
										element={
											<ProtectedRoute>
												<ViewEditAddCartItemPage />
											</ProtectedRoute>
										}
									/>
									<Route
										path="/shoppingCartItem/view/:id"
										element={
											<ProtectedRoute>
												<ViewEditAddCartItemPage />
											</ProtectedRoute>
										}
									/>
								</>
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
