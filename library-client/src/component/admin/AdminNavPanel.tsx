type NavPanelProps = {
	activeItem: string;
	onSelect: (item: string) => void;
};

const navItems = [
	{ id: "dashboard", label: "Dashboard" },
	{ id: "books", label: "Books" },
	{ id: "authors", label: "Authors" },
	{ id: "users", label: "Users" },
	{ id: "loans", label: "Loans" },
	{ id: "fees", label: "Fees" },
	{ id: "shoppingCarts", label: "Shopping Carts" },
	{ id: "settings", label: "Settings" },
];

const AdminNavPanel = ({ activeItem, onSelect }: NavPanelProps) => {
	return (
		<div className="list-group">
			{navItems.map((item) => (
				<button
					type="button"
					key={item.id}
					className={`list-group-item list-group-item-action ${
						activeItem === item.id ? "active" : ""
					}`}
					aria-current={activeItem === item.id ? "true" : undefined}
					onClick={() => onSelect(item.id)}
				>
					{item.label}
				</button>
			))}
		</div>
	);
};

export default AdminNavPanel;
