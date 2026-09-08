import { useEffect, useState } from "react";
import apiUsers from "../../../../api/apiUsers";
import type { UserType } from "../../../../types/DbTypes";
import UserLoansView from "./UserLoansView";
import UserFeesView from "./UserFeesView";

type Props = {
	id: number;
	onBack: () => void;
	onReload: () => void;
	showMessage: (text: string) => void;
};

const EMPTY: UserType = {
	id: 0,
	firstName: "",
	lastName: "",
	email: "",
	phone: "",
	role: "USER",
	hasFee: false,
};

type UserDetailsTab = "loans" | "fees" | "cart" | null;

const ViewUser = ({ id, onBack, onReload }: Props) => {
	const [data, setData] = useState(EMPTY);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<UserDetailsTab>(null);

	useEffect(() => {
		let active = true;

		const load = async () => {
			setIsLoading(true);
			setError(null);

			console.log("Loading user data for ID:", id);

			try {
				const user = await apiUsers.getUserById(id);
				if (!active) return;

				console.log("Fetching user data:", user);

				setData({
					id: Number(id),
					firstName: user.firstName ?? "",
					lastName: user.lastName ?? "",
					email: user.email ?? "",
					phone: user.phone ?? "",
					role: user.role ?? "USER",
					hasFee: user.hasFee ?? false,
				});
			} catch {
				if (active) setError("Failed to load user.");
			} finally {
				if (active) setIsLoading(false);
			}
		};

		load();
		return () => {
			active = false;
		};
	}, [id]);

	return (
		<div className="container-fluid py-3">
			<div className="d-flex gap-2 mb-3">
				<button
					className="btn btn-secondary"
					onClick={() => {
						onBack();
						onReload();
					}}
				>
					Back
				</button>
				<h2>View User Data</h2>
			</div>

			{isLoading && <p>Loading...</p>}
			{error && <p className="text-danger">{error}</p>}

			<div className="mt-3">
				<div className="card p-4 mt-3">
					<p>
						<strong>User ID:</strong> {data.id}
					</p>

					<div className="row mt-3">
						{/* LEWA KOLUMNA */}
						<div className="col-md-6">
							<p>
								<strong>First Name:</strong> {data.firstName}
							</p>
							<p>
								<strong>Last Name:</strong> {data.lastName}
							</p>
							<p>
								<strong>Email:</strong> {data.email}
							</p>
						</div>

						{/* PRAWA KOLUMNA */}
						<div className="col-md-6">
							<p>
								<strong>Phone:</strong> {data.phone || "-"}
							</p>
							<p>
								<strong>Role:</strong> {data.role}
							</p>
							<p>
								<strong>Has Unpaid Fees:</strong> {data.hasFee ? "Yes" : "No"}
							</p>
						</div>
					</div>
				</div>

				<div className="d-flex flex-wrap gap-2 mt-4">
					<button
						className={`btn ${activeTab === "loans" ? "btn-primary" : "btn-outline-primary"}`}
						onClick={() =>
							setActiveTab((current) => (current === "loans" ? null : "loans"))
						}
					>
						Loans
					</button>
					<button
						className={`btn ${activeTab === "fees" ? "btn-warning" : "btn-outline-warning"}`}
						onClick={() =>
							setActiveTab((current) => (current === "fees" ? null : "fees"))
						}
					>
						Fees
					</button>
				</div>

				<div className="mt-4">
					{activeTab === "loans" && <UserLoansView userId={id} />}
					{activeTab === "fees" && <UserFeesView userId={id} />}
				</div>
			</div>
		</div>
	);
};

export default ViewUser;
