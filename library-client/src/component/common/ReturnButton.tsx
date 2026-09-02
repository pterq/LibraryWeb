import React from "react";

const ReturnButton = () => {
	return (
		<div className="">
			<button className="btn btn-secondary" onClick={() => window.history.back()}>
				Back
			</button>
		</div>
	);
};

export default ReturnButton;
