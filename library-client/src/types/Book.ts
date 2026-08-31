export interface Book {
	id: number;
	title: string;
	description: string;
	imageUrl?: string;
	isbn: string;
	publishedYear: number;
	bookAuthors: string[];
}
