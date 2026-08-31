import { useState, type JSX } from "react";
import AdminNavPanel from "./AdminNavPanel";
import { useAuth } from "../../context/AuthContext";
import AuthorsDashboard from "../dashboards/AuthorsDashboard";
import BooksDashboard from "../dashboards/BooksDashboard";
import UsersDashboard from "../dashboards/UsersDashboard";
import LoansDashboard from "../dashboards/LoansDashboard";
import FeesDashboard from "../dashboards/FeesDashboard";
import ShoppinCartsDashboard from "../dashboards/ShoppinCartsDashboard";

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
	users: {
		title: "Users",
		description: "Manage users, roles, and account statuses.",
	},
	loans: {
		title: "Loans",
		description: "Manage loans and their return deadlines.",
	},
	shoppingCarts: {
		title: "Shopping Carts",
		description: "Manage shopping carts and their contents.",
	},
	fees: {
		title: "Fees",
		description: "Manage fees and their payment statuses.",
	},
	settings: {
		title: "Settings",
		description: "System and admin panel preferences configuration.",
	},
};

const AdminPanelPage = () => {
	const [activeSection, setActiveSection] = useState("dashboard");
	const { firstName, lastName, email } = useAuth();
	const currentContent = contentMap[activeSection] ?? contentMap.dashboard;

	const sectionComponentMap: Record<string, JSX.Element> = {
		authors: <AuthorsDashboard />,
		books: <BooksDashboard />,
		users: <UsersDashboard />,
		loans: <LoansDashboard />,
		fees: <FeesDashboard />,
		shoppingCarts: <ShoppinCartsDashboard />,
	};

	const sectionContent = sectionComponentMap[activeSection] ?? (
		<div className="border rounded p-3 bg-light text-start">
			<h2 className="h5 mb-3">{currentContent.title}</h2>
			<p className="mb-0 text-muted">{currentContent.description}</p>
		</div>
	);

	return (
		<div className="">
			<h1 className="mb-4">Admin Panel</h1>
			<h2 className="mb-4">
				User: {firstName} {lastName} ({email})
			</h2>

			<div className="row g-4 align-items-start">
				<aside className="col-lg-3 col-md-4 col-12">
					<AdminNavPanel activeItem={activeSection} onSelect={setActiveSection} />
				</aside>

				<div className="col-lg-9 col-md-8 col-12">{sectionContent}</div>
			</div>
		</div>
	);
};

export default AdminPanelPage;
