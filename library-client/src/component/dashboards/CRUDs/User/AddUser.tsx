import { useMemo, useState } from "react";
import apiUsers from "../../../../api/apiUsers";
import { useAuth } from "../../../../context/AuthContext";
import type { UserType, EmptyRegisterUserForm } from "../../../../types/DbTypes";
import RegisterForm from "../../../common/RegisterForm";

type Props = {
	onBack: () => void;
	onReload: () => void;
	showMessage: (text: string) => void;
};

const USER_ROLES: UserType["role"][] = ["ADMIN", "LIBRARIAN", "USER"];

const EMPTY_FORM: EmptyRegisterUserForm = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	password2: "",
	phone: "",
};

const AddUser = ({ onBack, onReload, showMessage }: Props) => {
	const [formData, setFormData] = useState(EMPTY_FORM);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const auth = useAuth();

	const allowedRoles = useMemo<UserType["role"][]>(() => {
		if (auth.role === "ADMIN") return ["ADMIN", "LIBRARIAN", "USER"];
		if (auth.role === "LIBRARIAN") return ["USER"];
		return ["USER"];
	}, [auth.role]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.password !== formData.password2) {
			setError("Passwords do not match.");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			await apiUsers.registerUser({
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email,
				password: formData.password,
				phone: formData.phone.trim(),
			});

			onReload();
			showMessage("User has been added.");
			onBack();
		} catch {
			setError("Failed to create user.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<button className="btn btn-secondary" onClick={onBack}>
				Back
			</button>

			<RegisterForm
				form={formData}
				setForm={setFormData}
				onSubmit={handleSubmit}
				showPassword={showPassword}
				setShowPassword={setShowPassword}
				error={error}
				isLoading={isLoading}
				title="Add User"
			/>
		</>
	);
};

export default AddUser;
