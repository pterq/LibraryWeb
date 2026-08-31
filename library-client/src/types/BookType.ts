import type { AuthorsType } from "./AuthorsType";

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

{
	/*
Table books {
  id integer [pk, increment]
  title varchar [not null]
  description text
  isbn varchar [unique]
  published_year integer
  category_id integer [ref: > categories.id]
  cover_image_url varchar
}


Table books_physical {
  id integer [pk, increment]
  book_id integer [ref: > books.id]
  inventory_code varchar [unique]
  status varchar [not null] // available, reserved, borrowed, damaged, lost
}

    */
}

{
	/*
[
    {
        "book": {
            "bookAuthors": [],
            "category": null,
            "description": "A handbook of agile software craftsmanship",
            "id": 2,
            "isbn": "9780132350884",
            "publishedYear": 2008,
            "title": "Clean Code"
        },
        "createdAt": "2026-08-30T04:29:26.669671",
        "id": 3,
        "inventoryCode": "INV-2026-0021",
        "status": "AVAILABLE",
        "updatedAt": "2026-08-30T05:27:36.476013"
    },
    {
        "book": {
            "bookAuthors": [],
            "category": null,
            "description": "A handbook of agile software craftsmanship",
            "id": 4,
            "isbn": "97801323520884",
            "publishedYear": 2008,
            "title": "Clean Code222"
        },
        "createdAt": "2026-08-30T04:43:43.017284",
        "id": 4,
        "inventoryCode": "INV-222026-0021",
        "status": "BORROWED",
        "updatedAt": "2026-08-30T04:44:13.445138"
    },
    {
        "book": {
            "bookAuthors": [],
            "category": null,
            "description": "A handbook of agile software craftsmanship",
            "id": 4,
            "isbn": "97801323520884",
            "publishedYear": 2008,
            "title": "Clean Code222"
        },
        "createdAt": "2026-08-30T04:45:46.673667",
        "id": 5,
        "inventoryCode": "INV-e222026-0021",
        "status": "BORROWED",
        "updatedAt": "2026-08-30T05:03:46.144366"
    },
    {
        "book": {
            "bookAuthors": [],
            "category": null,
            "description": "A handbook of agile software craftsmanship",
            "id": 4,
            "isbn": "97801323520884",
            "publishedYear": 2008,
            "title": "Clean Code222"
        },
        "createdAt": "2026-08-30T04:51:20.49275",
        "id": 6,
        "inventoryCode": "INV-e222v026-0021",
        "status": "RESERVED",
        "updatedAt": "2026-08-30T04:51:30.535863"
    }
]
	*/
}
