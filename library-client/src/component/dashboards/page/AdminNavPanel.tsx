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
	{ id: "shoppingCarts", label: "Shopping Carts" },
	{ id: "shoppingCartItems", label: "Shopping Cart Items" },
];

const AdminNavPanel = ({ activeItem, onSelect }: NavPanelProps) => {
	return (
		<div className="list-group container-fluid mb-4">
			<h3>Navigation</h3>
			{navItems.map((item) => (
				<div key={item.id}>
					{item.id === "users" && <hr className="my-2 border-secondary-subtle" />}
					{item.id === "books" && <hr className="my-2 border-secondary-subtle" />}
					{item.id === "loans" && <hr className="my-2 border-secondary-subtle" />}
					{item.id === "fees" && <hr className="my-2 border-secondary-subtle" />}
					{item.id === "shoppingCarts" && <hr className="my-2 border-secondary-subtle" />}
					<button
						type="button"
						className={`list-group-item list-group-item-action ${
							activeItem === item.id ? "active" : ""
						}`}
						aria-current={activeItem === item.id ? "true" : undefined}
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
