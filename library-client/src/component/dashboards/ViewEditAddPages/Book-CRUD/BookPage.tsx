import { useState } from "react";
import ReturnButton from "../../../common/ReturnButton";

import { actionFromLink, idFromLink, type PageAction } from "../../../../context/DataFromLink";
import BookSearchGoogle from "./BookSearchGoogle";
import BookAddEdit, {
	DEFAULT_AUTOFILL_SELECTION,
	EMPTY_BOOK_FORM,
	type AutofillSelection,
	type BookFormData,
} from "./BookAddEdit";

const BookPage = () => {
	const action: PageAction = actionFromLink;
	const linkId = idFromLink;

	const [isEditing, setIsEditing] = useState(action === "add");
	const isReadOnly = action === "view" && !isEditing;

	const [formData, setFormData] = useState<BookFormData>(EMPTY_BOOK_FORM);
	const [originalFormData, setOriginalFormData] = useState<BookFormData>(EMPTY_BOOK_FORM);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [autofillSelection, setAutofillSelection] = useState<AutofillSelection>(
		DEFAULT_AUTOFILL_SELECTION,
	);

	return (
		<div className="container py-3">
			<ReturnButton />
			<div className="row g-4">
				<BookAddEdit
					action={action}
					linkId={linkId != null ? String(linkId) : null}
					isEditing={isEditing}
					setIsEditing={setIsEditing}
					isReadOnly={isReadOnly}
					formData={formData}
					setFormData={setFormData}
					originalFormData={originalFormData}
					setOriginalFormData={setOriginalFormData}
					error={error}
					setError={setError}
					autofillSelection={autofillSelection}
					setAutofillSelection={setAutofillSelection}
					showLoading={isLoading}
					setShowLoading={setIsLoading}
				/>

				<div className="d-none d-lg-flex col-lg-2 justify-content-center">
					<div className="h-100 border-start" />
				</div>

				<div className="col-12 col-lg-5">
					<div className="mt-0 pt-0">
						<h2 className="mb-3">Search & Autofill</h2>
						<BookSearchGoogle
							onSelect={(book) => {
								setFormData((prev) => ({
									...prev,
									title: autofillSelection.title ? book.title : prev.title,
									description: autofillSelection.description
										? book.description
										: prev.description,
									isbn: autofillSelection.isbn ? book.isbn : prev.isbn,
									publishedYear: autofillSelection.publishedYear
										? book.publishedYear
										: prev.publishedYear,
									coverImageUrl: autofillSelection.coverImageUrl
										? (book.coverUrl ?? "")
										: prev.coverImageUrl,
								}));

								if (action === "view") {
									setIsEditing(true);
								}
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BookPage;
