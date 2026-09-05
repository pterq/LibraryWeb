import React, { useEffect, type JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CartItemsDashboard from "../component/dashboards/admin-dasboards/CartItemsDashboard";
import BooksPhysicalDashboard from "../component/dashboards/admin-dasboards/BooksPhysicalDashboard";
import AdminNavPanel from "../component/dashboards/admin-components/AdminNavPanel";
import { useAuth } from "../context/AuthContext";
import AuthorsDashboard from "../component/dashboards/admin-dasboards/AuthorsDashboard";
import BooksDashboard from "../component/dashboards/admin-dasboards/BooksDashboard";
import UsersDashboard from "../component/dashboards/admin-dasboards/UsersDashboard";
import LoansDashboard from "../component/dashboards/admin-dasboards/LoansDashboard";
import FeesDashboard from "../component/dashboards/admin-dasboards/FeesDashboard";
import CartsDashboard from "../component/dashboards/admin-dasboards/CartsDashboard";
import CategoriesDashboard from "../component/dashboards/admin-dasboards/CategoriesDashboard";
import LoanItemsDashboard from "../component/dashboards/admin-dasboards/LoanItemsDashboard";
import FeeItemsDashboard from "../component/dashboards/admin-dasboards/FeeItemsDashboard";

const contentMap: Record<string, { title: string; description: string }> = {
	dashboard: {
		title: "Dashboard",
		description: "Manage library database, users, loans and settings from this panel.",
	},
	authors: {
		title: "Authors",
		description: "Manage authors and their bibliographies.",
	},
	books: {
		title: "Books",
		description: "Manage the catalog and add new items to the library.",
	},
	booksPhysical: {
		title: "Physical Books",
		description: "Manage the catalog and add new items to the library.",
	},
	categories: {
		title: "Categories",
		description: "Manage book categories",
	},
	users: {
		title: "Users",
		description: "Manage users, roles, and account statuses.",
	},
	loans: {
		title: "Loans",
		description: "Manage loans and their return deadlines.",
	},
	loanItems: {
		title: "Loan Items",
		description: "Manage individual loan items and their statuses.",
	},
	shoppingCarts: {
		title: "Shopping Carts",
		description: "Manage shopping carts and their contents.",
	},
	fees: {
		title: "Fees",
		description: "Manage fees and their payment statuses.",
	},
	feeItems: {
		title: "Fee Items",
		description: "Manage individual fee items and their statuses.",
	},
	settings: {
		title: "Settings",
		description: "System and admin panel preferences configuration.",
	},
};

const sectionComponentMap: Record<string, JSX.Element> = {
	authors: <AuthorsDashboard />,
	books: <BooksDashboard />,
	booksPhysical: <BooksPhysicalDashboard />,
	categories: <CategoriesDashboard />,
	users: <UsersDashboard />,
	loans: <LoansDashboard />,
	loanItems: <LoanItemsDashboard />,
	fees: <FeesDashboard />,
	feeItems: <FeeItemsDashboard />,
	carts: <CartsDashboard />,
	cartItems: <CartItemsDashboard />,
};

const AdminPanelPage = () => {
	const { role, firstName, lastName, email } = useAuth();
	const navigate = useNavigate();
	const { section } = useParams();

	const activeSection = section ?? "dashboard";
	const currentContent = contentMap[activeSection] ?? contentMap.dashboard;

	useEffect(() => {
		if (role !== "ADMIN" && role !== "LIBRARIAN") {
			navigate("/");
		}
	}, [role]);

	const sectionContent = sectionComponentMap[activeSection] ?? (
		<div className="border rounded p-3 bg-light text-start">
			<h2 className="h5 mb-3">{currentContent.title}</h2>
			<p className="mb-0 text-muted">{currentContent.description}</p>
		</div>
	);

	return (
		<div className="container-fluid">
			<h1>{role} Panel</h1>
			<h2 className="mb-4">
				User: {firstName} {lastName} ({email})
			</h2>

			<div className="row g-4 align-items-start">
				<aside className="col-lg-3 col-md-4 col-12">
					<AdminNavPanel
						activeItem={activeSection}
						onSelect={(item) => navigate(`/admin-panel/${item}`)}
					/>
				</aside>

				<div className="container col-lg-9 col-md-8 col-12 border">{sectionContent}</div>
			</div>
		</div>
	);
};

export default AdminPanelPage;
