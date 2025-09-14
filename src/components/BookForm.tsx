import React, { useState } from "react";
import axios from "axios";
import type { Book } from "../types/Book";
function BookForm() {
  const [book, setBook] = useState<Partial<Book>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/books", book)
      .then(() => alert("Book added successfully!"))
      .catch((error) => console.error("Error adding book:", error));
  };

  return (
    <div className="container mt-4">
      <h2>Add Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Author</label>
          <input
            type="text"
            name="author"
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">ISBN</label>
          <input
            type="text"
            name="isbn"
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Publisher</label>
          <input
            type="text"
            name="publisher"
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Book
        </button>
      </form>
    </div>
  );
}

export default BookForm;
