import React from "react";

type NavPanelProps = {
	activeItem: string;
	onSelect: (item: string) => void;
};

const navItems = [
	{ id: "dashboard", label: "Dashboard" },
	{ id: "books", label: "Books" },
	{ id: "booksPhysical", label: "Physical Books" },
	{ id: "categories", label: "Categories" },
	{ id: "authors", label: "Authors" },
	{ id: "users", label: "Users" },
	{ id: "loans", label: "Loans" },
	{ id: "loanItems", label: "Loan Items" },
	{ id: "fees", label: "Fees" },
	{ id: "feeItems", label: "Fees Items" },
	{ id: "carts", label: "Carts" },
	{ id: "cartItems", label: "Cart Items" },
];

// ID sekcji, przed którymi ma być separator
const separatorBefore = new Set(["books", "users", "loans", "fees", "carts"]);

const AdminNavPanel = ({ activeItem, onSelect }: NavPanelProps) => {
	return (
		<div className="list-group container-fluid mb-4">
			<h3>Navigation</h3>

			{navItems.map((item) => (
				<div key={item.id}>
					{separatorBefore.has(item.id) && (
						<hr className="my-2 border-secondary-subtle" />
					)}

					<button
						type="button"
						className={`list-group-item list-group-item-action ${
							activeItem === item.id ? "active" : ""
						}`}
						onClick={() => onSelect(item.id)}
					>
						{item.label}
					</button>
				</div>
			))}
		</div>
	);
};

export default AdminNavPanel;
