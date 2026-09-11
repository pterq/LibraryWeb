import type { UserType } from "../../types/DbTypes";
import { useAuth } from "../../context/AuthContext";

const UserDataCard = ({ userData }: { userData: UserType | null }) => {
	const { role } = useAuth();

	return (
		<div className="card container-fluid p-4 mt-3">
			<h5>
				<strong>User information</strong>
			</h5>

			{role !== "USER" && (
				<p>
					<strong>User ID:</strong> {userData?.id}
				</p>
			)}

			<div className="row">
				{/* LEWA KOLUMNA */}
				<div className="col-md-6">
					<p>
						<strong>First Name:</strong> {userData?.firstName}
					</p>
					<p>
						<strong>Last Name:</strong> {userData?.lastName}
					</p>
					<p>
						<strong>Email:</strong> {userData?.email}
					</p>
				</div>

				{/* PRAWA KOLUMNA */}
				<div className="col-md-6">
					<p>
						<strong>Phone:</strong> {userData?.phone || "-"}
					</p>
					<p>
						<strong>Role:</strong> {userData?.role}
					</p>
					<p>
						<strong>Has Unpaid Fees:</strong> {userData?.hasFees ? "Yes" : "No"}
					</p>
				</div>
			</div>
		</div>
	);
};

export default UserDataCard;
