export type UserRoleType = "ADMIN" | "USER" | "LIBRARIAN";

export interface AuthorType {
	id: number;
	firstName: string;
	lastName: string;
	biography: string;
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
	authors: AuthorsType[];
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
	copy: BookPhysicalType;
	loanDate: Date;
	returnDate: Date;
	dueDate: Date;
	status: LoanStatusType;
	user: UserType;
}

export interface UserType {
	//token: string;
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string | null;
	role: UserRoleType;
	hasFee: boolean;
}

export interface UserData {
	token: string;
	firstName: string;
	lastName: string;
	email: string;
	role: UserRoleType;
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

export interface CategoriesWithCountsType {
	id: number;
	name: string;
	countBooks: number;
}

export interface FeesWithCountsType {
	id: number;
	fee: FeeType;
	user: UserType;
	countFees: number;
	countUnpaid: number;
	countPaid: number;
	countCancelled: number;
}

export interface UserDtoType {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
}

export interface LoanCountType {
	id: number;
	userDto: UserDtoType;
	countLoans: number;
}

export interface ReservationCountType {
	id: number;
	reservation: ReservationType;
	countReservations: number;
	user: UserType;
}
