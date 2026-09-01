import React from "react";
import LoanItemsTable from "../Tables/LoanItemsTable";

type PageAction = "view" | "add";

const ViewEditAddLoansUserPage = () => {
	const path = window.location.pathname;
	const action: PageAction = path.includes("/view") ? "view" : "add";

	// tylko dla "view" próbujemy pobrać userId z URL
	const rawId = path.split("/").pop() ?? "";
	const parsedUserId = Number(rawId);
	const userIdFromPath = action === "view" && Number.isFinite(parsedUserId) ? parsedUserId : null;

	const pageTitle = action === "view" ? "View User's Loans" : "Add User's Loans";

	return (
		<div className="container py-3">
			<div className="d-flex flex-wrap gap-2 mb-3">
				<button className="btn btn-secondary" onClick={() => window.history.back()}>
					Back
				</button>
			</div>

			<h2>{pageTitle}</h2>

			{/* VIEW MODE */}
			{action === "view" && (
				<>
					{!userIdFromPath && (
						<p className="text-danger mb-3">Invalid or missing user id in URL.</p>
					)}

					{userIdFromPath && (
						<>
							<h4 className="mb-3">User Id: {userIdFromPath}</h4>
							<LoanItemsTable userId={userIdFromPath} />
						</>
					)}
				</>
			)}

			{/* ADD MODE */}
			{action === "add" && (
				<>
					<h4 className="mb-3">New Loan — User not created yet</h4>

					{/* LoanItemsTable bez userId → powinna wyświetlić pustą tabelę */}
					<LoanItemsTable userId={null} />
				</>
			)}
		</div>
	);
};

export default ViewEditAddLoansUserPage;
