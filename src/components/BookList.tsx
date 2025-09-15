import { useEffect, useState } from "react";
import axios from "axios";
import type { Book } from "../types/Book";

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null); // Track which book is being edited
  const [editedBook, setEditedBook] = useState<Partial<Book>>({}); // Store the book being edited

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    axios
      .get<Book[]>("http://localhost:8080/books")
      .then((response) => setBooks(response.data))
      .catch((error) => console.error("Error fetching books:", error));
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      axios
        .delete(`http://localhost:8080/books/${id}`)
        .then(() => {
          alert("Book deleted successfully!");
          fetchBooks();
        })
        .catch((error) => console.error("Error deleting book:", error));
    }
  };

  const handleEditClick = (book: Book) => {
    setIsEditing(book.id);
    setEditedBook(book);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setEditedBook({
      ...editedBook,
      [name]: type === "number" ? Number(value) : value,
    });
  };
  const handleReload = () => {
    fetchBooks();
  };

  const handleSaveEdit = (id: number) => {
    axios
      .put(`http://localhost:8080/books/${id}`, editedBook)
      .then(() => {
        alert("Book updated successfully!");
        setIsEditing(null);
        fetchBooks();
      })
      .catch((error) => console.error("Error updating book:", error));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Book List</h2>
        <button className="btn btn-primary btn-sm me-2" onClick={handleReload}>
          Reaload
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Publisher</th>
            <th>Year</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              {isEditing === book.id ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="title"
                      value={editedBook.title || ""}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="author"
                      value={editedBook.author || ""}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="isbn"
                      value={editedBook.isbn || ""}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="publisher"
                      value={editedBook.publisher || ""}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="publicationYear"
                      value={editedBook.publicationYear || ""}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="availableQuantity"
                      value={editedBook.availableQuantity || ""}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleSaveEdit(book.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setIsEditing(null)}
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.isbn}</td>
                  <td>{book.publisher}</td>
                  <td>{book.publicationYear}</td>
                  <td>{book.availableQuantity}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEditClick(book)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(book.id)}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookList;
