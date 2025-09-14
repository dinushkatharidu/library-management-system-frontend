import { useEffect, useState } from "react";
import axios from "axios";
import type { Book } from "../types/Book";

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    axios
      .get<Book[]>("http://localhost:8080/books")
      .then((response) => setBooks(response.data))
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Book List</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Publisher</th>
            <th>Year</th>
            <th>Available</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.isbn}</td>
              <td>{book.publisher}</td>
              <td>{book.publicationYear}</td>
              <td>{book.availableQuantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookList;
