import { Link } from "react-router-dom";
import BookModel from "../../models/BookModel";
import { LeaveAReview } from "../utils/LeaveAReview";

export const CheckoutAndReview: React.FC<{
  book: BookModel | undefined;
  mobile: boolean;
  currentLoansCount: number;
  isAuthentication: any; // keeping your original typing
  isCheckout: boolean;
  onCheckout: () => void;
  isReviewLeft: boolean;
  submitReview: any;
}> = (props) => {
  const copiesAvailable = props.book?.copiesAvailable ?? 0;

  let actionArea;

  if (!props.isAuthentication) {
    // Not signed in
    actionArea = (
      <Link to="/#" className="btn btn-success btn-lg">
        Sign in
      </Link>
    );
  } else if (props.isCheckout) {
    // Signed in AND already checked out this book
    actionArea = (
      <p className="mt-2 mb-0 text-info fw-semibold">
        You’ve checked this book out.
      </p>
    );
  } else if (props.currentLoansCount >= 5) {
    // Signed in but at max loans
    actionArea = (
      <p className="mt-2 mb-0 text-danger fw-semibold">
        You’ve reached the maximum loans limit (5).
      </p>
    );
  } else {
    // Signed in, not checked out, and under the limit
    actionArea = (
      <button onClick={props.onCheckout} className="btn btn-primary btn-lg">
        Check out
      </button>
    );
  }

  let reviewArea;

  if (!props.isReviewLeft && props.isAuthentication) {
     reviewArea = (
     <LeaveAReview submitReview={props.submitReview} />
    );
  } else if (props.isReviewLeft && props.isAuthentication) {
     reviewArea = (
      <p className="mt-2 mb-0 fw-semibold">
        Thank you for your review!
      </p>
     
    );
  } else{
    reviewArea = (
      <p className="mt-2 mb-0 fw-semibold">
        Please sign in to leave a review.
      </p>
    );
  }

  return (
    <div
      className={
        props.mobile ? "card d-flex mt-5" : "card col-3 container d-flex mb-5"
      }
    >
      <div className="card-body container">
        <div className="mt-3">
          <p>
            <b>{props.currentLoansCount}/5</b> books checked out
          </p>
          <hr />
          {copiesAvailable > 0 ? (
            <h4 className="text-success">Available</h4>
          ) : (
            <h4 className="text-danger">Wait List</h4>
          )}

          <div className="row">
            <p className="col-6 lead">
              <b>{props.book?.copies}</b> copies
            </p>
            <p className="col-6 lead">
              <b>{copiesAvailable}</b> available
            </p>
          </div>
        </div>

        {actionArea}

        <hr />
         <p className="mt-3">
          This number can change until placing order has been completed.
        </p>
        {reviewArea}
      </div>
    </div>
  );
};

