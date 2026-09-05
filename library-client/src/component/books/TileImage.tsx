import React from "react";

interface TileImageProps {
	src: string;
	alt: string;
}

const TileImage: React.FC<TileImageProps> = ({ src, alt }) => {
	return (
		<img
			src={src}
			alt={alt}
			className="card-img-top w-50 mx-auto d-block mt-3"
			style={{
				width: "150px", // stała szerokość
				height: "220px", // stała wysokość
				objectFit: "cover", // przycina, ale zachowuje proporcje
				borderRadius: "4px",
			}}
		/>
	);
};

export default TileImage;
