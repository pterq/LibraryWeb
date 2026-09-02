import React from "react";

const ReturnButton = () => {
	return (
		<div className="mb-2 w-auto">
			<button className="btn btn-secondary" onClick={() => window.history.back()}>
				Back
			</button>
		</div>
	);
};

export default ReturnButton;
