import { useEffect, useState } from "react";
import apiBooksPhysical from "../../../../api/apiBooksPhysical";
import type { BookPhysicalResponse, BookType } from "../../../../types/DbTypes";
import BookDataCard from "../Book/BookDataCard";

type Props = {
	id: number;
	onBack: () => void;
	onReload: () => void;
	showMessage: (text: string) => void;
};

const ViewPhysicalBook = ({ id, onBack, onReload, showMessage }: Props) => {
	const [data, setData] = useState<BookPhysicalResponse>();
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
		<div className="container-fluid py-3">
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
						<strong>ID:</strong> {data.copyId}
					</p>
					<p>
						<strong>Inventory Code:</strong> {data.inventoryCode}
					</p>
					<p>
						<strong>Status:</strong> {data.status}
					</p>

					{!isLoading && data && <BookDataCard bookData={data.book} />}
				</div>
			)}
		</div>
	);
};

export default ViewPhysicalBook;
