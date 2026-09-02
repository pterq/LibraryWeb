import { useEffect, useState } from "react";
import "./ImageFrame.css";
import placeholderImage from "../../assets/book-placeholder.jpg";

interface ImageFrameProps {
	imageUrl?: string | null;
	alt?: string;
}

const ImageFrame = ({ imageUrl, alt = "Preview image" }: ImageFrameProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const resolvedImageUrl = imageUrl?.trim() ? imageUrl : placeholderImage;

	const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
		const element = event.currentTarget;
		element.onerror = null;
		element.src = placeholderImage;
	};

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		};

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleEscape);

		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen]);

	return (
		<div className="image-frame-container border">
			<img
				src={resolvedImageUrl}
				alt={alt}
				className="image-frame-thumbnail"
				onError={handleImageError}
				onClick={() => setIsOpen(true)}
			/>

			{isOpen && (
				<div
					className="image-frame-overlay"
					onClick={() => setIsOpen(false)}
					role="presentation"
				>
					<img
						src={resolvedImageUrl}
						alt={alt}
						className="image-frame-open"
						onError={handleImageError}
						onClick={(event) => event.stopPropagation()}
					/>
				</div>
			)}
		</div>
	);
};

export default ImageFrame;
