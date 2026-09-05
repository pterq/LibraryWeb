import { useEffect, useState } from "react";
import apiCategories from "../../../../api/apiCategories";
import type { CategoryType } from "../../../../types/DbTypes";

type Props = {
	id: number;
	onBack: () => void;
	onReload: () => void;
	showMessage: (text: string, type?: "success" | "danger") => void;
};

const EMPTY_CATEGORY: CategoryType = {
	id: 0,
	name: "",
};

const ViewCategory = ({ id, onBack, onReload, showMessage }: Props) => {
	const [data, setData] = useState<CategoryType>(EMPTY_CATEGORY);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		const load = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const category = await apiCategories.getCategoryById(id);
				if (!active) return;

				setData({
					id: category.id ?? id,
					name: category.name ?? "",
				});
			} catch {
				if (active) setError("Failed to load category.");
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
						//showMessage("Returned from category view.");
					}}
				>
					Back
				</button>
			</div>

			<h2>View Category</h2>

			{isLoading && <p>Loading...</p>}
			{error && <p className="text-danger">{error}</p>}

			<div className="mt-3">
				<p>
					<strong>ID:</strong> {data.id || "-"}
				</p>
				<p>
					<strong>Name:</strong> {data.name || "-"}
				</p>
			</div>
		</div>
	);
};

export default ViewCategory;
