import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../utils/SpinnerLoading";
import { SearchBook } from "./components/SeachBook";
import { Pagination } from "../utils/Pagination";

export const SearchBooksPage = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);
  //Holds the currently active page.
  //Initialized to 1 (page numbers are 1-based in your UI, but 0-based in backend URL).
  const [currentPage, setCurrentPage] = useState(1);

  const [booksPerPage] = useState(5);
  const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  //for the input
  const [search, setSearch] = useState("");
  //for the url
  const [searchUrl, setSearchUrl] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // You subtract 1 from currentPage because your backend uses 0-based pagination.
        // So if you're on page 1 in the UI, you fetch page=0
        const baseUrl: string = "http://localhost:8080/api/books";
        let url: string = "";

        //if there's no search, just retrieve everything, but if there is a search, use the search url
        if (searchUrl === "") {
          url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
        } else {
          url = baseUrl + searchUrl;
        }

        const response = await fetch(url);

        if (!response.ok) throw new Error("Something went wrong!");

        const responseJson = await response.json();
        const booksData = responseJson._embedded.books;

        //get from backend
        setTotalAmountOfBooks(responseJson.page.totalElements);
        setTotalPages(responseJson.page.totalPages);

        const loadedBooks = booksData.map(
          (book: any) =>
            new BookModel(
              book.id,
              book.title,
              book.author,
              book.description,
              book.copies,
              book.copiesAvailable,
              book.category,
              book.img
            )
        );

        setBooks(loadedBooks);
      } catch (error: any) {
        setHttpError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
    window.scrollTo(0, 0);
  }, [currentPage, searchUrl]);

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
  //if the input is empty while searching, set the url to empty, else set it to the search url
  const searchHandleChange = () => {
    if (search === "") {
      setSearchUrl("");
    } else {
      setSearchUrl(
        `/search/findByTitleContaining?title=${search}&page=0&size=${booksPerPage}`
      );
    }
  };

  // These calculate the range of items being shown on the current page.
  // Example: page 2 with 5 books/page → items 6 to 10.
  // These aren't used directly in rendering now, but may be useful for displaying text like "Showing 6 to 10 of 22".
  const indexOfLastBook: number = currentPage * booksPerPage;
  const indexOfFirstBook: number = indexOfLastBook - booksPerPage;

  //Calculates the ending index of the books shown on the current page.
  //If it's the last page and has fewer than 5 books, it caps to totalAmountOfBooks.
  let lastItem =
    booksPerPage * currentPage <= totalAmountOfBooks
      ? booksPerPage * currentPage
      : totalAmountOfBooks;

  // Updates currentPage when user clicks on a page number.
  // This will trigger a re-render and fetch new books because it's part of the useEffect dependency.
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="container">
        <div>
          <div className="row mt-5">
            <div className="col-6">
              <div className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-labelledby="Search"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className="btn btn-outline-success"
                  type="submit"
                  onClickCapture={() => searchHandleChange()}
                >
                  Search
                </button>
              </div>
            </div>

            <div className="col-4">
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Category
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      All
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Front End
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Back End
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Data
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      DevsOps
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {totalAmountOfBooks > 0 ? (
            <>
              <div className="mt-3">
                <h5>Number of results: ({totalAmountOfBooks})</h5>
              </div>
              <p>
                {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks}{" "}
                items
              </p>
              {/* each will represent a book */}
              {books.map((book) => (
                <SearchBook book={book} key={book.id} />
              ))}
            </>
          ) : (
            <div className="m-5">
              <div>
                <h3>Can't find what you're looking for?</h3>
              </div>
              <a
                type="button"
                className="btn main-color btn-md px-4 me-md-2 fw-bold text-white"
                href="/search"
              >
                Library Services
              </a>
            </div>
          )}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
            />
          )}
        </div>
      </div>
    </div>
  );
};
