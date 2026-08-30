import React from "react";

const Cart = () => {
	return (
		<div>
			Shopping Cart page content - here is the list of books added to the cart(reservations)
			<div>
				<button
					className="btn btn-primary"
					type="button"
					data-bs-toggle="offcanvas"
					data-bs-target="#offcanvasWithBothOptions"
					aria-controls="offcanvasWithBothOptions"
				>
					Enable both scrolling & backdrop
				</button>
				<div
					className="offcanvas offcanvas-end"
					data-bs-scroll="true"
					// tabIndex="-1"
					id="offcanvasWithBothOptions"
					aria-labelledby="offcanvasWithBothOptionsLabel"
				>
					<div className="offcanvas-header">
						<h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">
							Backdrop with scrolling
						</h5>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="offcanvas"
							aria-label="Close"
						></button>
					</div>
					<div className="offcanvas-body">
						<p>Try scrolling the rest of the page to see this option in action.</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Cart;
