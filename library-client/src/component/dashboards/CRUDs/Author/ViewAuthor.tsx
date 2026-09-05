import { useEffect, useState } from "react";
import apiAuthors from "../../../../api/apiAuthors";

type Props = {
	id: number;
	onBack: () => void;
	onReload: () => void;
	showMessage: (text: string) => void;
};

const EMPTY = {
	firstName: "",
	lastName: "",
	biography: "",
};

const ViewAuthor = ({ id, onBack, onReload, showMessage }: Props) => {
	const [data, setData] = useState(EMPTY);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		const load = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const author = await apiAuthors.getAuthorById(id);
				if (!active) return;

				setData({
					firstName: author.firstName ?? "",
					lastName: author.lastName ?? "",
					biography: author.biography ?? "",
				});
			} catch {
				if (active) setError("Failed to load author.");
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
						//showMessage("Returned from author view.");
					}}
				>
					Back
				</button>
			</div>

			<h2>View Author</h2>

			{isLoading && <p>Loading...</p>}
			{error && <p className="text-danger">{error}</p>}

			<div className="mt-3">
				<p>
					<strong>First Name:</strong> {data.firstName}
				</p>
				<p>
					<strong>Last Name:</strong> {data.lastName}
				</p>
				<p>
					<strong>Biography:</strong>
				</p>
				<p>{data.biography || "-"}</p>
			</div>
		</div>
	);
};

export default ViewAuthor;
