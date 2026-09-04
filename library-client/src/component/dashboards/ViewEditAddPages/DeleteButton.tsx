import { useState } from "react";

type DeleteButtonProps = {
	id: number | string;
	entityName: string;
	onDelete: (id: number | string) => Promise<void> | void;
	className?: string;
	label?: string;
	confirmMessage?: string;
	errorMessage?: string;
	disabled?: boolean;
};

const DeleteButton = ({
	id,
	entityName,
	onDelete,
	className = "btn btn-sm btn-danger",
	label = "Delete",
	confirmMessage,
	errorMessage,
	disabled = false,
}: DeleteButtonProps) => {
	const [isDeleting, setIsDeleting] = useState(false);

	const handleClick = async () => {
		const message = confirmMessage ?? `Are you sure you want to delete ${entityName}: ${id}?`;

		if (!window.confirm(message)) return;

		setIsDeleting(true);
		try {
			await onDelete(id);
		} catch (error) {
			console.error(errorMessage ?? `Failed to delete ${entityName}:`, error);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<button
			type="button"
			className={className}
			onClick={handleClick}
			disabled={disabled || isDeleting}
		>
			{isDeleting ? "Deleting..." : `🗑 ${label}`}
		</button>
	);
};

export default DeleteButton;
