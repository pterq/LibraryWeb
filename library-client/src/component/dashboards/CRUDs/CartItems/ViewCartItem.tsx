import { useEffect, useState } from "react";
import apiCarts from "../../../../api/apiCarts";
import type { CartItemResponse } from "../../../../types/DbTypes";

type Props = {
	id: number;
	onBack: () => void;
	onReload: () => void;
	showMessage: (text: string, type?: "success" | "danger") => void;
};

const EMPTY: CartItemResponse = {
	id: 0,
	user: {
		id: 0,
		firstName: "",
		lastName: "",
		email: "",
		phone: null,
		role: "USER",
		hasFee: false,
	},
	copy: {
		copyId: 0,
		inventoryCode: "",
		status: "AVAILABLE",
		book: {
			id: 0,
			title: "",
			description: "",
			imageUrl: null,
			isbn: "",
			publishedYear: 0,
			categories: [],
			authors: [],
		},
	},
	bookPhysical: {
		copyId: 0,
		inventoryCode: "",
		status: "AVAILABLE",
		book: {
			id: 0,
			title: "",
			description: "",
			imageUrl: null,
			isbn: "",
			publishedYear: 0,
			categories: [],
			authors: [],
		},
	},
	reservedAt: new Date(),
	expiresAt: new Date(),
};

const ViewCartItem = ({ id, onBack, onReload }: Props) => {
	const [data, setData] = useState<CartItemResponse>(EMPTY);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		const load = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const item = await apiCarts.getCartItemsByUserId(id);
				if (!active) return;

				setData(item);
			} catch {
				if (active) setError("Failed to load cart item.");
			} finally {
				if (active) setIsLoading(false);
			}
		};

		load();
		return () => {
			active = false;
		};
	}, [id]);

	return (
		<div className="container py-3">
			<div className="d-flex gap-2 mb-3">
				<button
					className="btn btn-secondary"
					onClick={() => {
						onBack();
						onReload();
					}}
				>
					Back
				</button>
			</div>

			<h2>View Cart Item</h2>

			{isLoading && <p>Loading...</p>}
			{error && <p className="text-danger">{error}</p>}

			<div className="mt-3">
				<p>
					<strong>ID:</strong> {data.id}
				</p>

				<p>
					<strong>User:</strong> ({data.user.id}) {data.user.firstName}{" "}
					{data.user.lastName}
				</p>

				<p>
					<strong>Book:</strong> ({data.copy.book.id}) {data.copy.book.title}
				</p>

				<p>
					<strong>Copy:</strong> ({data.copy.copyId}) {data.copy.inventoryCode}
				</p>

				<p>
					<strong>Reserved At:</strong> {new Date(data.reservedAt).toLocaleString()}
				</p>
				<p>
					<strong>Expires At:</strong> {new Date(data.expiresAt).toLocaleString()}
				</p>
			</div>
		</div>
	);
};

export default ViewCartItem;
