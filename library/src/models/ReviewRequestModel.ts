class ReviewRequestModel {
    bookId: number = 0;
    reviewDescription?: string;
    rating: number = 0;

    constructor(bookId: number, reviewDescription?: string, rating: number = 0) {
        this.bookId = bookId;
        this.reviewDescription = reviewDescription;
        this.rating = rating;
    }
}

export default ReviewRequestModel