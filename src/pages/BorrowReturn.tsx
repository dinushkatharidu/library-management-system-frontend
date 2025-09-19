import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080";
const BORROW_API = `${API}/borrow`; // matches @RequestMapping("/borrow") in backend

type Member = { id: number; name: string };
type Book = { id: number; title: string; quantity: number };

// Aligning name with backend 'Borrowing' entity (previously named Loan)
type Borrowing = {
  id: number;
  member: Member;
  book: Book;
  borrowedAt: string;
  dueAt: string;
  returnedAt?: string | null;
  fineCents: number;
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === "string") return data;
    if (data && typeof data === "object" && "message" in data) {
      const msg = (data as { message?: unknown }).message;
      if (typeof msg === "string" && msg.trim().length > 0) return msg;
    }
    return error.message || fallback;
  }
  if (error instanceof Error) return error.message || fallback;
  return fallback;
}

function BorrowReturn() {
  const [members, setMembers] = useState<Member[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<number | "">("");
  const [mode, setMode] = useState<"borrow" | "return">("borrow");
  const [activeBorrowings, setActiveBorrowings] = useState<Borrowing[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<number | "">("");
  const [message, setMessage] = useState<string>("");

  // Initial data load
  useEffect(() => {
    axios.get<Member[]>(`${API}/members`).then((r) => setMembers(r.data));
    axios.get<Book[]>(`${API}/books`).then((r) => setBooks(r.data));
  }, []);

  // Load active borrowings when member or mode changes
  useEffect(() => {
    setMessage("");
    setSelectedBookId("");
    if (selectedMemberId !== "") {
      axios
        .get<Borrowing[]>(`${BORROW_API}/active`, {
          params: { memberId: selectedMemberId },
        })
        .then((r) => setActiveBorrowings(r.data))
        .catch((error: unknown) => {
          setMessage(
            getErrorMessage(error, "Failed to load active borrowings.")
          );
          setActiveBorrowings([]);
        });
    } else {
      setActiveBorrowings([]);
    }
  }, [selectedMemberId, mode]);

  const availableBooks = useMemo(
    () => books.filter((b) => (b.quantity ?? 0) > 0),
    [books]
  );

  const canBorrow = useMemo(
    () =>
      selectedMemberId !== "" &&
      activeBorrowings.length < 2 &&
      selectedBookId !== "",
    [selectedMemberId, activeBorrowings.length, selectedBookId]
  );

  const refreshAfterChange = async (memberId: number | "") => {
    if (memberId === "") return;
    const [booksRes, borrowingsRes] = await Promise.all([
      axios.get<Book[]>(`${API}/books`),
      axios.get<Borrowing[]>(`${BORROW_API}/active`, {
        params: { memberId },
      }),
    ]);
    setBooks(booksRes.data);
    setActiveBorrowings(borrowingsRes.data);
  };

  const handleBorrow = async () => {
    if (!canBorrow || selectedMemberId === "" || selectedBookId === "") return;
    setMessage("");
    try {
      const res = await axios.post<Borrowing>(`${BORROW_API}/borrow`, {
        memberId: selectedMemberId,
        bookId: selectedBookId,
      });
      setMessage(
        `Borrowed "${res.data.book.title}". Due on ${res.data.dueAt}.`
      );
      await refreshAfterChange(selectedMemberId);
      setSelectedBookId("");
    } catch (error: unknown) {
      setMessage(getErrorMessage(error, "Borrow failed."));
    }
  };

  const handleReturn = async (borrowingId: number) => {
    setMessage("");
    try {
      const res = await axios.post<Borrowing>(
        `${BORROW_API}/${borrowingId}/return`
      );
      const fine = (res.data.fineCents ?? 0) / 100;
      setMessage(
        fine > 0
          ? `Returned "${res.data.book.title}". Fine: ${fine.toFixed(2)}`
          : `Returned "${res.data.book.title}". No fine.`
      );
      await refreshAfterChange(selectedMemberId);
    } catch (error: unknown) {
      setMessage(getErrorMessage(error, "Return failed."));
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
                setSelectedMemberId(
                  e.target.value ? Number(e.target.value) : ""
                )
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
            Active borrowings: {activeBorrowings.length} / 2
            {activeBorrowings.length >= 2 && (
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
                  setSelectedBookId(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
                disabled={
                  selectedMemberId === "" || activeBorrowings.length >= 2
                }
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
          <h5 className="mb-3">Active Borrowings</h5>
          {selectedMemberId === "" ? (
            <div className="text-muted">Select a member to see borrowings.</div>
          ) : activeBorrowings.length === 0 ? (
            <div className="text-muted">No active borrowings.</div>
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
                  {activeBorrowings.map((br) => (
                    <tr key={br.id}>
                      <td>{br.book.title}</td>
                      <td>{br.borrowedAt}</td>
                      <td>{br.dueAt}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleReturn(br.id)}
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
