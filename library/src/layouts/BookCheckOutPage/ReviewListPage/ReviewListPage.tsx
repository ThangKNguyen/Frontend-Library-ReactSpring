import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewModel from "../../../models/ReviewModel";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { Review } from "../../utils/Review";
import { Pagination } from "../../utils/Pagination";
export const ReviewListPage = () => {
    //useParams

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    
    
    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const {bookId} = useParams();

    //fetch reviews
  useEffect(() => {
    const fetchBookReviews = async () => {
      try {
        const reviewUrl = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${reviewsPerPage}`;
        const response = await fetch(reviewUrl);

        if (!response.ok) {
          throw new Error("Something went wrong while fetching reviews!");
        }

        const data = await response.json();
        const reviewsData = data._embedded.reviews;

        setTotalAmountOfReviews(data.page.totalElements);
        setTotalPages(data.page.totalPages);

        const loadedReviews: ReviewModel[] = [];


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
        }

        setReviews(loadedReviews);
      } catch (error: any) {
        setHttpError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookReviews();
  }, [currentPage]);

  if(isLoading){
    return(
        <SpinnerLoading/>
    )
  }

  if(httpError){
    return(
        <div className="container m-5">
            <p>{httpError}</p>
        </div>
    )
  }

  const indexOfLastReview: number = currentPage * reviewsPerPage;
  const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;
  let lastItem = reviewsPerPage * currentPage <= totalAmountOfReviews ? reviewsPerPage * currentPage : totalAmountOfReviews;
    
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-5">
            <div>
                <h3>Comments: ({reviews.length})</h3>
            </div>
            <p>
                {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items:
            </p>
            <div className="row">
                {reviews.map(review => (
                    <Review review={review} key={review.id} />
                ))}
            </div>

            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    );
}