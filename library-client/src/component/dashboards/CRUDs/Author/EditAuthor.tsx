import { useEffect, useState } from "react";
import apiAuthors from "../../../../api/apiAuthors";

type Props = {
	id: number;
	onBack: () => void;
	onReload: () => void;
	showMessage: (text: string) => void;
};

const EMPTY_FORM = {
	firstName: "",
	lastName: "",
	biography: "",
};

const EditAuthor = ({ id, onBack, onReload, showMessage }: Props) => {
	const [formData, setFormData] = useState(EMPTY_FORM);
	const [originalFormData, setOriginalFormData] = useState(EMPTY_FORM);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		const load = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const data = await apiAuthors.getAuthorById(id);
				if (!active) return;

				const next = {
					firstName: data.firstName ?? "",
					lastName: data.lastName ?? "",
					biography: data.biography ?? "",
				};

				setFormData(next);
				setOriginalFormData(next);
			} catch {
				if (active) setError("Failed to load author data.");
			} finally {
				if (active) setIsLoading(false);
			}
		};

		load();
		return () => {
			active = false;
		};
	}, [id]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			await apiAuthors.updateAuthorById(id, formData);

			onReload();
			showMessage("Author has been updated.");
			onBack();
		} catch {
			setError("Failed to save changes.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		setFormData(originalFormData);
		onBack();
	};

	return (
		<div className="container py-3">
			<div className="d-flex gap-2 mb-3">
				<button className="btn btn-secondary" onClick={onBack}>
					Back
				</button>
			</div>

			<h2>Edit Author</h2>

			{isLoading && <p>Loading...</p>}
			{error && <p className="text-danger">{error}</p>}

			<form onSubmit={handleSubmit} className="mt-3">
				<div className="mb-3">
					<label className="form-label">First Name</label>
					<input
						type="text"
						name="firstName"
						className="form-control"
						value={formData.firstName}
						onChange={handleChange}
						required
						disabled={isLoading}
					/>
				</div>

				<div className="mb-3">
					<label className="form-label">Last Name</label>
					<input
						type="text"
						name="lastName"
						className="form-control"
						value={formData.lastName}
						onChange={handleChange}
						required
						disabled={isLoading}
					/>
				</div>

				<div className="mb-3">
					<label className="form-label">Biography</label>
					<textarea
						name="biography"
						className="form-control"
						rows={5}
						value={formData.biography}
						onChange={handleChange}
						disabled={isLoading}
					/>
				</div>

				<button type="submit" className="btn btn-primary" disabled={isLoading}>
					Save Changes
				</button>
			</form>
		</div>
	);
};

export default EditAuthor;
