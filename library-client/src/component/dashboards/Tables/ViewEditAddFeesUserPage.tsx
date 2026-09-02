import FeeItemsTable from "./FeeItemsTable";
import ReturnButton from "../../common/ReturnButton";

import { actionFromLink, idFromLink, type PageAction } from "../../../context/DataFromLink";

const ViewEditAddFeesUserPage = () => {
	// tylko dla "view" próbujemy pobrać userId z URL
	const action: PageAction = actionFromLink;
	const linkId = idFromLink;

	const pageTitle = action === "view" ? "View User's Fees" : "Add Fees for New User";

	return (
		<div className="container py-3">
			<div className="d-flex flex-wrap gap-2 mb-3">
				<ReturnButton />
			</div>

			<h2>{pageTitle}ddddd</h2>

			{/* VIEW MODE */}
			{action === "view" && (
				<>
					{!linkId && (
						<p className="text-danger mb-3">Invalid or missing user id in URL.</p>
					)}

					{linkId && (
						<>
							<h4 className="mb-3">User Id: {linkId}</h4>

							{/* FeeItemsTable z userId → filtruje opłaty danego użytkownika */}
							<FeeItemsTable userId={linkId} />
						</>
					)}
				</>
			)}

			{/* ADD MODE */}
			{action === "add" && (
				<>
					<h4 className="mb-3">New Fees — User not created yet</h4>

					{/* FeeItemsTable bez userId → wyświetla pustą tabelę */}
					<FeeItemsTable userId={null} />
				</>
			)}
		</div>
	);
};

export default ViewEditAddFeesUserPage;
