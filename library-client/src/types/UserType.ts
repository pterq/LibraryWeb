export interface UserType {
	//token: string;
	userId: number;
	firstName: string;
	lastName: string;
	email: string;
	role: "ADMIN" | "USER" | "LIBRARIAN";
}
