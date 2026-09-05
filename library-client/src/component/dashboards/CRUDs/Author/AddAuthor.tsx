import { useState } from "react";
import apiAuthors from "../../../../api/apiAuthors";

type Props = {
	onBack: () => void;
	onReload: () => void;
	showMessage: (text: string) => void;
};

const EMPTY_FORM = {
	firstName: "",
	lastName: "",
	biography: "",
};

const AddAuthor = ({ onBack, onReload, showMessage }: Props) => {
	const [formData, setFormData] = useState(EMPTY_FORM);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			await apiAuthors.addAuthor(formData);

			onReload();
			showMessage("Author has been added.");
			onBack();
		} catch {
			setError("Failed to create author.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container py-3">
			<div className="d-flex gap-2 mb-3">
				<button className="btn btn-secondary" onClick={onBack}>
					Back
				</button>
			</div>

			<h2>Add Author</h2>

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
					/>
				</div>

				<button type="submit" className="btn btn-primary" disabled={isLoading}>
					Create Author
				</button>
			</form>
		</div>
	);
};

export default AddAuthor;
