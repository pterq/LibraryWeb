export interface UserRoleType {
	name: "ADMIN" | "USER" | "LIBRARIAN";
}

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
	categories?: CategoryType[];
	coverImageUrl?: string;
}

export type BookPhysicalStatusType = "AVAILABLE" | "BORROWED" | "RESERVED";

export interface BookPhysicalType {
	id: number;
	inventoryCode: string;
	status: BookPhysicalStatusType;
	book: BookType;
}

export interface CategoryType {
	id: number;
	name: string;
}

export type LoanStatusType = "BORROWED" | "RETURNED" | "OVERDUE";

export interface LoanType {
	id: number;
	bookPhysical: BookPhysicalType;
	loanDate: Date;
	returnDate: Date;
	dueDate: Date;
	status: LoanStatusType;
	user: UserType;
}

export interface UserType {
	//token: string;
	userId: number;
	firstName: string;
	lastName: string;
	email: string;
	role: UserRoleType["name"];
}

export interface UserData {
	token: string;
	firstName: string;
	lastName: string;
	email: string;
	role: UserRoleType["name"];
}

export type FeeStatusType = "PAID" | "UNPAID" | "CANCELLED";

export type FeeType = {
	amount: number;
	createdAt: Date;
	id: number;
	loan: LoanType;
	paidAt: Date | null;
	status: FeeStatusType;
	user: UserType;
};

export interface ReservationType {
	id: number;
	user: UserType;
	copyId: number;
	reservedAt: Date;
	expiresAt: Date;
	bookPhysical: BookPhysicalType;
}

export interface ReservastionsType {
	reservations: ReservationType[];
}

//============================================

export interface CategoryCountType {
	id: number;
	name: string;
	numberOfBooks: number;
}

export interface FeeCountType {
	id: number;
	firstName: string;
	lastName: string;
	numberOfFees: number;
	numberOfFeesUnpaid: number;
	numberOfFeesPaid: number;
	numberOfFeesCancelled: number;
}

export interface LoanCountType {
	id: number;
	firstName: string;
	lastName: string;
	numberOfLoans: number;
}

export interface ReservationCountType {
	id: number;
	firstName: string;
	lastName: string;
	numberOfReservations: number;
}
