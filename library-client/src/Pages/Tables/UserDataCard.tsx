import type { UserType } from "../../types/DbTypes";

const UserDataCard = ({ userData }: { userData: UserType }) => {
	return (
		<div className="card p-4 mt-3">
			<p>
				<strong>User ID:</strong> {userData.id}
			</p>

			<div className="row mt-3">
				{/* LEWA KOLUMNA */}
				<div className="col-md-6">
					<p>
						<strong>First Name:</strong> {userData.firstName}
					</p>
					<p>
						<strong>Last Name:</strong> {userData.lastName}
					</p>
					<p>
						<strong>Email:</strong> {userData.email}
					</p>
				</div>

				{/* PRAWA KOLUMNA */}
				<div className="col-md-6">
					<p>
						<strong>Phone:</strong> {userData.phone || "-"}
					</p>
					<p>
						<strong>Role:</strong> {userData.role}
					</p>
					<p>
						<strong>Has Unpaid Fees:</strong> {userData.hasFee ? "Yes" : "No"}
					</p>
				</div>
			</div>
		</div>
	);
};

export default UserDataCard;
