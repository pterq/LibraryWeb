import React from "react";

const ReturnButton = () => {
	const handleBackClick = () => {
		window.history.back();
		setTimeout(() => {
			window.location.reload();
		}, 50);
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
