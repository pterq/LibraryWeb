import React from "react";
import NavPanel from "./NavPanel";

const AdminPanelPage = () => {
	return (
		<div>
			<h1>Admin Panel</h1>

			<div className="container text-center">
				<div className="row row-cols-5 g-1">
					<div className="col">
						<NavPanel />
					</div>
					<div className="col">One of three columns</div>
					<div className="col">One of three columns</div>
					<div className="col">One of three columns</div>
					<div className="col">One of three columns</div>
				</div>
			</div>
		</div>
	);
};

export default AdminPanelPage;
