export type UserRoleType = "ADMIN" | "USER" | "LIBRARIAN";
export type BookPhysicalStatusType = "AVAILABLE" | "BORROWED" | "RESERVED";
export type LoanStatusType = "BORROWED" | "RETURNED" | "OVERDUE";
export type FeeStatusType = "PAID" | "UNPAID" | "CANCELLED";

//============================================================================

export interface AuthorType {
	id: number;
	firstName: string;
	lastName: string;
	biography: string;
}

//============================================================================
export interface BookType {
	id: number;
	title: string;
	description: string;
	imageUrl: string | null;
	isbn: string;
	publishedYear: number;
	categories: CategoryType[];
	authors: AuthorType[];
}

//============================================================================
export interface BookPhysicalType {
	id: number;
	inventoryCode: string;
	status: BookPhysicalStatusType;
	book: BookType;
}

//============================================================================
export interface CategoryType {
	id: number;
	name: string;
}

//============================================================================
export interface LoanType {
	id: number;
	copy: BookPhysicalType;
	loanDate: Date;
	returnDate: Date;
	dueDate: Date;
	status: LoanStatusType;
	user: UserType;
}

//===========================================================================
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

export interface UserDtoType {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
}

//===========================================================================
export type FeeType = {
	amount: number;
	createdAt: Date;
	id: number;
	loan: LoanType;
	paidAt: Date | null;
	status: FeeStatusType;
	user: UserType;
};

//===========================================================================

export interface CartType {
	id: number;
	user: UserType;
	copy: BookPhysicalType;
	reservedAt: Date;
	expiresAt: Date;
	bookPhysical: BookPhysicalType;
}

//============================================================================
export interface CategoriesWithCountsType {
	id: number;
	name: string;
	countBooks: number;
}

export interface FeesWithCountsType {
	id: number;
	user: UserType;
	countFees: number;
	countUnpaid: number;
	countPaid: number;
	countCancelled: number;
}

export interface LoanCountType {
	id: number;
	user: UserDtoType;
	countLoans: number;
	countBorrowed: number;
	countReturned: number;
	countOverdue: number;
}

export interface CartCountType {
	id: number;
	user: UserDtoType;
	countReservations: number;
}

//============================================================================
//interafaces for CRUD operations
export interface AuthorForm {
	firstName: string;
	lastName: string;
	biography: string;
}

export interface CategoryForm {
	name: string;
}

export interface UserData {
	token: string;
	firstName: string;
	lastName: string;
	email: string;
	role: UserRoleType;
}
