export interface AuthorType {
	id: number;
	firstName: string;
	lastName: string;
	bio: string;
}

export interface AuthorsType {
	id: number;
	authors: AuthorType[];
}

export interface BookType {
	id: number;
	title: string;
	description: string;
	isbn: string;
	publishedYear: number;
	authors: AuthorsType;
	coverImageUrl?: string;
}

export interface BookPhysicalType {
	id: number;
	inventoryCode: string;
	status: "AVAILABLE" | "BORROWED" | "RESERVED";
	book: BookType;
}

export interface CategoryType {
	id: number;
	name: string;
}

export interface LoanType {
	id: number;
	bookPhysical: BookPhysicalType;
	loanDate: Date;
	returnDate: Date;
	dueDate: Date;
	status: "BORROWED" | "RETURNED" | "OVERDUE";
	user: UserType;
}

export interface UserType {
	//token: string;
	userId: number;
	firstName: string;
	lastName: string;
	email: string;
	role: "ADMIN" | "USER" | "LIBRARIAN";
}

export type FeeType = {
	amount: number;
	createdAt: Date;
	id: number;
	loan: LoanType;
	paidAt: Date | null;
	status: "PAID" | "UNPAID" | "CANCELLED";
	user: UserType;
};

export interface ReservationType {
	id: number;
	userId: number;
	copyId: number;
	reservedAt: Date;
	expiresAt: Date;
}
