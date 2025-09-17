import React, { useState } from "react";
import axios from "axios";
import type { Member } from "../types/Member";

// Form state: require all editable fields
type MemberFormState = Omit<Member, "id" | "registrationDate">;

// Payload sent to backend: LocalDate string for registrationDate
type PostMember = MemberFormState & { registrationDate: string };

function MemberForm() {
  const [member, setMember] = useState<MemberFormState>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const toLocalDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`; // yyyy-MM-dd
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Cast is safe because all inputs use keys of MemberFormState
    setMember((prev) => ({ ...prev, [name]: value } as MemberFormState));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: PostMember = {
      ...member,
      // Always send today's date in LocalDate format
      registrationDate: toLocalDate(new Date()),
    };

    axios
      .post("http://localhost:8080/members", payload)
      .then(() => alert("New Member added successfully!"))
      .catch((error) => console.error("Error adding new Member:", error));
  };

  return (
    <div className="container py-5">
      <form onSubmit={handleSubmit}>
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold text-primary mb-3">
                👥 Library Management System
              </h1>
              <p className="lead text-muted">
                Register a new member to the library
              </p>
            </div>

            <div className="card shadow-lg border-0">
              <div className="card-header bg-primary text-white py-4">
                <h3 className="card-title text-center mb-0">
                  📝 Register New Member
                </h3>
              </div>

              <div className="card-body p-5">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <span className="badge bg-light text-dark me-2">👤</span>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control form-control-lg border-2"
                      placeholder="Enter member's full name"
                      value={member.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <span className="badge bg-light text-dark me-2">📧</span>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-lg border-2"
                      placeholder="Enter email address"
                      value={member.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <span className="badge bg-light text-dark me-2">📞</span>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control form-control-lg border-2"
                      placeholder="Enter phone number"
                      value={member.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark mb-2">
                      <span className="badge bg-light text-dark me-2">🏠</span>
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      className="form-control form-control-lg border-2"
                      placeholder="Enter address"
                      value={member.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg me-md-2 px-4"
                    onClick={() =>
                      setMember({
                        name: "",
                        email: "",
                        phone: "",
                        address: "",
                      })
                    }
                  >
                    🔄 Reset Form
                  </button>

                  <button type="submit" className="btn btn-primary btn-lg px-5">
                    ➕ Register Member
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

export default MemberForm;
