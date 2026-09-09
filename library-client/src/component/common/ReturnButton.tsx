import React from "react";

interface ReturnButtonProps {
	onBack?: () => void;
	onReload?: () => void;
}

const ReturnButton: React.FC<ReturnButtonProps> = ({ onBack, onReload }) => {
	const handleBackClick = () => {
		if (onBack) {
			onBack();
		} else {
			window.history.back();
		}

		if (onReload) {
			onReload();
		} else {
			setTimeout(() => {
				window.location.reload();
			}, 50);
		}
	};

	return (
		<div className="mb-2 w-auto">
			<button className="btn btn-secondary" onClick={handleBackClick}>
				Back
			</button>
		</div>
	);
};

export default ReturnButton;
