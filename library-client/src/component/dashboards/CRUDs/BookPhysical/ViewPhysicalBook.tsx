import { useEffect, useState } from "react";
import apiBooksPhysical from "../../../../api/apiBooksPhysical";

type Props = {
	id: number;
	onBack: () => void;
	onReload: () => void;
	showMessage: (text: string) => void;
};

const ViewPhysicalBook = ({ id, onBack, onReload, showMessage }: Props) => {
	const [data, setData] = useState<any | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		const load = async () => {
			setIsLoading(true);
			try {
				const copy = await apiBooksPhysical.getBookCopyById(id);
				if (!active) return;

				setData(copy);
			} catch {
				setError("Failed to load physical book.");
			} finally {
				setIsLoading(false);
			}
		};

		load();
		return () => {
			active = false;
		};
	}, [id]);

	return (
		<div className="container py-3">
			<button
				className="btn btn-secondary mb-3"
				onClick={() => {
					onBack();
					onReload();
				}}
			>
				Back
			</button>

			<h2>View Physical Book</h2>

			{isLoading && <p>Loading...</p>}
			{error && <p className="text-danger">{error}</p>}

			{data && (
				<div className="mt-3">
					<p>
						<strong>ID:</strong> {data.id}
					</p>
					<p>
						<strong>Inventory Code:</strong> {data.inventoryCode}
					</p>
					<p>
						<strong>Status:</strong> {data.status}
					</p>

					<h4 className="mt-4">Book Information</h4>
					<p>
						<strong>Title:</strong> {data.book.title}
					</p>
					<p>
						<strong>Authors:</strong>{" "}
						{data.book.authors
							.map((a: any) => `${a.firstName} ${a.lastName}`)
							.join(", ")}
					</p>
					<p>
						<strong>ISBN:</strong> {data.book.isbn || "-"}
					</p>
					<p>
						<strong>Published year:</strong> {data.book.publishedYear ?? "-"}
					</p>
					<p>
						<strong>Description:</strong> {data.book.description || "No description."}
					</p>

					<img
						src={data.book.coverImageUrl ?? "/src/assets/book-placeholder.jpg"}
						alt={data.book.title}
						className="img-fluid border rounded mt-3"
						style={{ width: "120px", height: "180px", objectFit: "cover" }}
					/>
				</div>
			)}
		</div>
	);
};

export default ViewPhysicalBook;
