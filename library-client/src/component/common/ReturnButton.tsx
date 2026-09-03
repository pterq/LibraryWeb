import React from "react";

const ReturnButton = () => {
	/*
	const handleBackClick = () => {
		const shouldGoBack = window.confirm(
			"Not saved changes will be lost. Do you want to continue?",
		);
		if (shouldGoBack) {
			window.history.back();
		}
	};
	*/
	const handleBackClick = () => {
		window.history.back();
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
