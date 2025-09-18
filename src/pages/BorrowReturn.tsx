import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080";

type Member = { id: number; name: string };
type Book = { id: number; title: string; quantity: number };
type Loan = {
  id: number;
  member: Member;
  book: Book;
  borrowedAt: string; // LocalDate string
  dueAt: string;      // LocalDate string
  returnedAt?: string | null;
  fineCents: number;
};

function BorrowReturn() {
  const [members, setMembers] = useState<Member[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<number | "">("");
  const [mode, setMode] = useState<"borrow" | "return">("borrow");

  const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<number | "">("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    axios.get<Member[]>(`${API}/members`).then((r) => setMembers(r.data));
    axios.get<Book[]>(`${API}/books`).then((r) => setBooks(r.data));
  }, []);

  useEffect(() => {
    setMessage("");
    setSelectedBookId("");
    if (selectedMemberId !== "") {
      axios
        .get<Loan[]>(`${API}/loans/active`, {
          params: { memberId: selectedMemberId },
        })
        .then((r) => setActiveLoans(r.data));
    } else {
      setActiveLoans([]);
    }
  }, [selectedMemberId, mode]);

  const availableBooks = useMemo(
    () => books.filter((b) => (b.quantity ?? 0) > 0),
    [books]
  );

  const canBorrow = useMemo(
    () => selectedMemberId !== "" && activeLoans.length < 2 && selectedBookId !== "",
    [selectedMemberId, activeLoans.length, selectedBookId]
  );

  const handleBorrow = async () => {
    if (!canBorrow || selectedMemberId === "" || selectedBookId === "") return;
    setMessage("");
    try {
      const res = await axios.post<Loan>(`${API}/loans/borrow`, {
        memberId: selectedMemberId,
        bookId: selectedBookId,
      });
      setMessage(
        `Borrowed "${res.data.book.title}". Due on ${res.data.dueAt}.`
      );
      // Refresh stock and active loans
      const [booksRes, loansRes] = await Promise.all([
        axios.get<Book[]>(`${API}/books`),
        axios.get<Loan[]>(`${API}/loans/active`, {
          params: { memberId: selectedMemberId },
        }),
      ]);
      setBooks(booksRes.data);
      setActiveLoans(loansRes.data);
      setSelectedBookId("");
    } catch (e: any) {
      setMessage(e?.response?.data || "Borrow failed.");
    }
  };

  const handleReturn = async (loanId: number) => {
    setMessage("");
    try {
      const res = await axios.post<Loan>(`${API}/loans/${loanId}/return`);
      const fine = (res.data.fineCents ?? 0) / 100;
      setMessage(
        fine > 0
          ? `Returned "${res.data.book.title}". Fine: ${fine.toFixed(2)}`
          : `Returned "${res.data.book.title}". No fine.`
      );
      // Refresh lists
      const [booksRes, loansRes] = await Promise.all([
        axios.get<Book[]>(`${API}/books`),
        axios.get<Loan[]>(`${API}/loans/active`, {
          params: { memberId: selectedMemberId },
        }),
      ]);
      setBooks(booksRes.data);
      setActiveLoans(loansRes.data);
    } catch (e: any) {
      setMessage(e?.response?.data || "Return failed.");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">Borrow & Return</h2>

      <div className="card p-3 mb-3">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label">Select Member</label>
            <select
              className="form-select"
              value={selectedMemberId}
              onChange={(e) =>
                setSelectedMemberId(e.target.value ? Number(e.target.value) : "")
              }
            >
              <option value="">-- choose member --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Action</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="modeBorrow"
                  name="mode"
                  value="borrow"
                  checked={mode === "borrow"}
                  onChange={() => setMode("borrow")}
                />
                <label className="form-check-label" htmlFor="modeBorrow">
                  Borrow
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="modeReturn"
                  name="mode"
                  value="return"
                  checked={mode === "return"}
                  onChange={() => setMode("return")}
                />
                <label className="form-check-label" htmlFor="modeReturn">
                  Return
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      {mode === "borrow" ? (
        <div className="card p-3">
          <div className="mb-2">
            Active loans: {activeLoans.length} / 2
            {activeLoans.length >= 2 && (
              <span className="text-danger ms-2">Limit reached</span>
            )}
          </div>

          <div className="row g-3 align-items-end">
            <div className="col-md-6">
              <label className="form-label">Available Books</label>
              <select
                className="form-select"
                value={selectedBookId}
                onChange={(e) =>
                  setSelectedBookId(e.target.value ? Number(e.target.value) : "")
                }
                disabled={selectedMemberId === "" || activeLoans.length >= 2}
              >
                <option value="">-- choose book --</option>
                {availableBooks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} (qty: {b.quantity})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <button
                className="btn btn-primary w-100"
                onClick={handleBorrow}
                disabled={!canBorrow}
              >
                Borrow
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-3">
          <h5 className="mb-3">Active Loans</h5>
          {selectedMemberId === "" ? (
            <div className="text-muted">Select a member to see loans.</div>
          ) : activeLoans.length === 0 ? (
            <div className="text-muted">No active loans.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Borrowed</th>
                    <th>Due</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {activeLoans.map((loan) => (
                    <tr key={loan.id}>
                      <td>{loan.book.title}</td>
                      <td>{loan.borrowedAt}</td>
                      <td>{loan.dueAt}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleReturn(loan.id)}
                        >
                          Return
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BorrowReturn;