import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import BookModel from "../../models/BookModel";
import ReviewModel from "../../models/ReviewModel";

import { SpinnerLoading } from "../utils/SpinnerLoading";
import { StarsReview } from "../utils/StarsReview";
import { CheckoutAndReview } from "./CheckoutAndReview";
import { LatestReviews } from "./LatestReviews";

import bookImage from "../../Images/BooksImages/book-luv2code-1000.png";

export const BookCheckoutPage = () => {
  const { isAuthenticated, user, getAccessTokenSilently, loginWithRedirect, logout } = useAuth0();

  const { bookId } = useParams();

  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  // Review states
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);

  //Loans count state
  const [currentLoansCount, setCurrentLoansCount] = useState(0);
  const [isLoadingLoansCount, setIsLoadingLoansCount] = useState(true);

  //isBookCheck out?
  const [isBookCheckedOut, setIsBookCheckedOut] = useState(false);
  const [isLoadingCheckedOut, setIsLoadingCheckedOut] = useState(true);

  //fetch books
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const url = `http://localhost:8080/api/books/${bookId}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error("Something went wrong!");

        const responseJson = await response.json();
        const loadedBook: BookModel = {
          id: responseJson.id,
          title: responseJson.title,
          author: responseJson.author,
          description: responseJson.description,
          copies: responseJson.copies,
          copiesAvailable: responseJson.copiesAvailable,
          category: responseJson.category,
          img: responseJson.img,
        };

        setBook(loadedBook);
      } catch (error: any) {
        setHttpError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [bookId, isBookCheckedOut]);

  //fetch reviews
  useEffect(() => {
    const fetchBookReviews = async () => {
      try {
        const reviewUrl = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;
        const response = await fetch(reviewUrl);

        if (!response.ok) {
          throw new Error("Something went wrong while fetching reviews!");
        }

        const data = await response.json();
        const reviewsData = data._embedded.reviews;

        const loadedReviews: ReviewModel[] = [];
        let weightedStarReviews = 0;

        for (const review of reviewsData) {
          const newReview = new ReviewModel(
            review.id,
            review.userEmail,
            review.date,
            review.rating,
            review.bookId,
            review.reviewDescription
          );

          loadedReviews.push(newReview);
          weightedStarReviews += review.rating;
        }

        // Calculate and set average rating (rounded to nearest 0.5)
        if (loadedReviews.length > 0) {
          const average = weightedStarReviews / loadedReviews.length;
          const rounded = Math.round(average * 2) / 2;
          setTotalStars(Number(rounded.toFixed(1)));
        }

        setReviews(loadedReviews);
      } catch (error: any) {
        setHttpError(error.message);
      } finally {
        setIsLoadingReview(false);
      }
    };

    fetchBookReviews();
  }, [bookId]);

  //fetch loans
useEffect(() => {
  let isMounted = true;

  const fetchLoansCount = async () => {
    try {
      if (!isAuthenticated) {
        if (isMounted) setIsLoadingLoansCount(false);
        return;
      }

      // Get a JWT from Auth0 (works if you configured audience on the provider;
      // if not, add { authorizationParams: { audience: "<your API audience>" } } )
      const accessToken = await getAccessTokenSilently();

      const res = await fetch(
        "http://localhost:8080/api/books/secure/currentloans/count",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch current loans count.");

      // Backend returns a bare number (int)
      const count: number = await res.json();

      if (isMounted) {
        setCurrentLoansCount(count);
      }
    } catch (err: any) {
      if (isMounted) setHttpError(err.message ?? "Error fetching loans count.");
    } finally {
      if (isMounted) setIsLoadingLoansCount(false);
    }
  };

  fetchLoansCount();

  return () => {
    isMounted = false;
  };
}, [isAuthenticated, getAccessTokenSilently, isBookCheckedOut]);

//isbookcheckout useeffect
useEffect(() => {
  const controller = new AbortController();
  const signal = controller.signal;

  const fetchIsBookCheckedOut = async () => {
    try {
      if (!isAuthenticated || !bookId) {
        setIsLoadingCheckedOut(false);
        return;
      }

      const accessToken = await getAccessTokenSilently();

      const res = await fetch(
        `http://localhost:8080/api/books/secure/ischeckedout/byuser?bookId=${bookId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal,  // ✅ link request to AbortController
        }
      );

      if (!res.ok) throw new Error("Failed to fetch checked-out status.");

      const checked: boolean = await res.json();
      setIsBookCheckedOut(checked);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setHttpError(err.message ?? "Error fetching checked-out status.");
      }
    } finally {
      setIsLoadingCheckedOut(false);
    }
  };

  fetchIsBookCheckedOut();

  return () => {
    controller.abort(); // ✅ cancel fetch if component unmounts
  };
}, [isAuthenticated, bookId, getAccessTokenSilently]);



  if (isLoading || isLoadingReview || isLoadingLoansCount || isLoadingCheckedOut) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  //check out button
  const checkOutBook = async () => {
    try {
      if (!isAuthenticated || !bookId) {
        return;
      }

      const accessToken = await getAccessTokenSilently();

      const res = await fetch(
        `http://localhost:8080/api/books/secure/checkout?bookId=${bookId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const response = await res.json();

      setIsBookCheckedOut(true);

    } catch (err: any) {
      setHttpError(err.message ?? "Error checking out book.");
    }
  }

  return (
    <>
      {/* Desktop layout */}
      <div className="container d-none d-lg-block">
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            {book?.img ? (
              <img src={book.img} width="226" height="349" alt="Book" />
            ) : (
              <img src={bookImage} width="226" height="349" alt="Book" />
            )}
          </div>

          <div className="col-4 col-md-4 container mb-3">
            <div className="ml-2">
              <h2>{book?.title}</h2>
              <h5 className="text-primary">{book?.author}</h5>
              <p className="lead">{book?.description}</p>
              <StarsReview rating={totalStars} size={32} />
            </div>
          </div>

          <CheckoutAndReview book={book} mobile={false} currentLoansCount={currentLoansCount} isAuthentication={isAuthenticated} isCheckout={isBookCheckedOut} 
          onCheckout={checkOutBook}/>
          <hr />
          <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="container d-lg-none mt-5 mb-3">
        <div className="d-flex justify-content-center align-items-center">
          {book?.img ? (
            <img src={book.img} width="226" height="349" alt="Book" />
          ) : (
            <img src={bookImage} width="226" height="349" alt="Book" />
          )}
        </div>

        <div className="mt-4">
          <div className="ml-2">
            <h2>{book?.title}</h2>
            <h5 className="text-primary">{book?.author}</h5>
            <p className="lead">{book?.description}</p>
            <StarsReview rating={5} size={32} />
          </div>
        </div>

        <CheckoutAndReview book={book} mobile={true} currentLoansCount={currentLoansCount} isAuthentication={isAuthenticated} isCheckout={isBookCheckedOut} onCheckout={checkOutBook}/>
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
      </div>
    </>
  );
};

