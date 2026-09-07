export type UserRoleType = "ADMIN" | "USER" | "LIBRARIAN";
export type BookPhysicalStatusType = "AVAILABLE" | "BORROWED" | "RESERVED";
export type LoanStatusType = "RESERVED" | "BORROWED" | "RETURNED" | "OVERDUE";
export type FeeStatusType = "PAID" | "PENDING" | "CANCELLED";

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
export interface BookPhysicalResponse {
	copyId: number;
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
export interface LoanResponse {
	id: number;
	copy: BookPhysicalResponse;
	reservedAt: Date;
	expiresAt: Date;
	loanDate: Date;
	dueDate: Date;
	returnDate: Date;
	status: LoanStatusType;
	user: UserType;
}

//===========================================================================
export interface UserType {
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
	phone: string;
}

//===========================================================================
export type FeeType = {
	id: number;
	loan: LoanResponse;
	amount: number;
	createdAt: Date;
	paidAt: Date | null;
	status: FeeStatusType;
	user: UserType;
};

//============================================================================
export interface CategoriesWithCountsResponse {
	id: number;
	name: string;
	bookCount: number;
}

export interface FeesCountType {
	id: number;
	user: UserType;
	countFees: number;
	countPending: number;
	countPaid: number;
	countCancelled: number;
}

export interface LoanCountType {
	id: number;
	user: UserDtoType;
	countLoans: number;
	countReserved: number;
	countBorrowed: number;
	countReturned: number;
	countOverdue: number;
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

export interface BookPhysicalForm {
	bookId: number;
	inventoryCode: string;
	status: BookPhysicalStatusType;
}

export interface RegisterUserForm {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	password: string;
}

export interface EmptyRegisterUserForm extends RegisterUserForm {
	password2: string;
}

export interface AdminRegisterForm extends RegisterUserForm {}

export interface RegisterUserResponse {
	userId: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string | null;
	role: string;
	createdAt: string;
	accessToken: string;
	tokenType: string;
	tokenExpiresAt: string;
}

export interface LoginUserForm {
	email: string;
	password: string;
}

export interface LoginUserResponse {
	userId: number;
	email: string;
	firstName: string;
	lastName: string;
	role: string;
	hasFees?: boolean;
	accessToken: string;
	//tokenType: string;
	tokenExpiresAt: string;
	phone: string | null;
}

export interface UserForm {}

export interface UserResponse {
	userId: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string | null;
	role: UserRoleType;
	hasFee: boolean;
}

export interface CartItemForm {
	userId: number;
	copyId: number;
	reservedAt: string;
	//expiresAt: string;
}

export interface LoanAddToCartForm {
	userId: number;
	bookId: number;
}
