import { useState } from "react";
import BookModel from "../../models/BookModel";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { SpinnerLoading } from "../utils/SpinnerLoading";
import bookImage from "../../Images/BooksImages/book-luv2code-1000.png";
import { StarsReview } from "../utils/StarsReview";

export const BookCheckoutPage = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

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
  }, []);

  if (isLoading) {
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
            <StarsReview rating={5} size={32}/>
          </div>
        </div>
        <hr />
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

      <div className="mt-4 ">
        <div className="ml-2">
          <h2>{book?.title}</h2>
          <h5 className="text-primary">{book?.author}</h5>
          <p className="lead">{book?.description}</p>
          <StarsReview rating={5} size={32}/>
        </div>
      </div>
      <hr />
    </div>
  </>
);

};
