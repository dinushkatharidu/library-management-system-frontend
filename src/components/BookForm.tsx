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
    <div className="container py-5">
      <form onSubmit={handleSubmit}>
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold text-primary mb-3">
                📚 Library Management System
              </h1>
              <p className="lead text-muted">
                Add a new book to your collection
              </p>
            </div>

            <div className="card shadow-lg border-0">
              <div className="card-header bg-primary text-white py-4">
                <h3 className="card-title text-center mb-0">📖 Add New Book</h3>
              </div>

              <div className="card-body p-5">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <span className="badge bg-light text-dark me-2">📖</span>
                      Book Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      className="form-control form-control-lg border-2"
                      placeholder="Enter book title"
                      value={book.title || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <span className="badge bg-light text-dark me-2">✍️</span>
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      className="form-control form-control-lg border-2"
                      placeholder="Enter author name"
                      value={book.author || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <span className="badge bg-light text-dark me-2">🔢</span>
                      ISBN
                    </label>
                    <input
                      type="text"
                      name="isbn"
                      className="form-control form-control-lg border-2"
                      placeholder="Enter ISBN number"
                      value={book.isbn || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <span className="badge bg-light text-dark me-2">🏢</span>
                      Publisher
                    </label>
                    <input
                      type="text"
                      name="publisher"
                      className="form-control form-control-lg border-2"
                      placeholder="Enter publisher name"
                      value={book.publisher || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row mb-5">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <span className="badge bg-light text-dark me-2">📅</span>
                      Publication Year
                    </label>
                    <input
                      type="number"
                      name="publicationYear"
                      className="form-control form-control-lg border-2"
                      placeholder="2024"
                      min="1900"
                      max="2030"
                      value={book.publicationYear || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <span className="badge bg-light text-dark me-2">📦</span>
                      Total Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      className="form-control form-control-lg border-2"
                      placeholder="10"
                      min="0"
                      value={book.quantity || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <span className="badge bg-light text-dark me-2">✅</span>
                      Available Quantity
                    </label>
                    <input
                      type="number"
                      name="availableQuantity"
                      className="form-control form-control-lg border-2"
                      placeholder="10"
                      min="0"
                      value={book.availableQuantity || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg me-md-2 px-4"
                    onClick={() => setBook({})}
                  >
                    🔄 Reset Form
                  </button>

                  <button type="submit" className="btn btn-primary btn-lg px-5">
                    ➕ Add Book
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default BookForm;
