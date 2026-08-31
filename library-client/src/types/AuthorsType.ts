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
