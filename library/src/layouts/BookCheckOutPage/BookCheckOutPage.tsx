import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import BookModel from "../../models/BookModel";
import ReviewModel from "../../models/ReviewModel";

import { SpinnerLoading } from "../utils/SpinnerLoading";
import { StarsReview } from "../utils/StarsReview";
import { CheckoutAndReview } from "./CheckoutAndReview";
import { LatestReviews } from "./LatestReviews";

import bookImage from "../../Images/BooksImages/book-luv2code-1000.png";

export const BookCheckoutPage = () => {
  const { bookId } = useParams();

  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  // Review states
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);

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
  }, [bookId]);

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

  if (isLoading || isLoadingReview) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
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

          <CheckoutAndReview book={book} mobile={false} />
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

        <CheckoutAndReview book={book} mobile={true} />
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
      </div>
    </>
  );
};

