import { useEffect, useState } from "react";

// Example types you can refine later
type DashboardStats = {
  totalBooks: number;
  availableBooks: number;
  members: number;
  activeBorrowings: number;
  overdue: number;
};

type RecentBorrowing = {
  id: number;
  memberName: string;
  bookTitle: string;
  borrowedAt: string; // date string
};

// Placeholder async fetches (replace with real API calls)
async function fetchStats(): Promise<DashboardStats> {
  // TODO: call backend endpoints and map results
  return {
    totalBooks: 120,
    availableBooks: 95,
    members: 42,
    activeBorrowings: 18,
    overdue: 3,
  };
}

async function fetchRecentBorrowings(): Promise<RecentBorrowing[]> {
  // TODO: call backend recent borrowings endpoint
  return [
    {
      id: 1,
      memberName: "Alice",
      bookTitle: "Clean Code",
      borrowedAt: "2025-09-18",
    },
    {
      id: 2,
      memberName: "Bob",
      bookTitle: "Domain-Driven Design",
      borrowedAt: "2025-09-18",
    },
    {
      id: 3,
      memberName: "Clara",
      bookTitle: "Effective Java",
      borrowedAt: "2025-09-17",
    },
  ];
}

function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<RecentBorrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [s, r] = await Promise.all([
          fetchStats(),
          fetchRecentBorrowings(),
        ]);
        if (mounted) {
          setStats(s);
          setRecent(r);
        }
      } catch {
        // handle silently or set an error state
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    // TODO: route to a search page or filter results
    alert("Search feature not implemented yet: " + search);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="position-relative">
        <div
          className="py-5 mb-4 rounded-4 text-white"
          style={{
            background:
              "linear-gradient(105deg, #3b4cca 0%, #1e2764 45%, #101632 100%)",
          }}
        >
          <div className="container">
            <div className="row align-items-center g-4">
              <div className="col-lg-7">
                <h1 className="display-5 fw-semibold mb-3">
                  Welcome to Your Library Hub
                </h1>
                <p className="lead mb-4">
                  Manage books, members, borrowing & returns efficiently. Keep
                  track of availability, fines and more — all in one place.
                </p>
                <div className="d-flex flex-wrap gap-2">
                  <a
                    href="/borrow-return"
                    className="btn btn-warning btn-lg fw-semibold"
                  >
                    <i className="bi bi-journal-plus me-2" /> Borrow / Return
                  </a>
                  <a href="/books" className="btn btn-outline-light btn-lg">
                    <i className="bi bi-bookshelf me-2" /> Manage Books
                  </a>
                  <a href="/members" className="btn btn-outline-light btn-lg">
                    <i className="bi bi-people me-2" /> Members
                  </a>
                </div>
              </div>
              <div className="col-lg-5 d-none d-lg-block">
                <div
                  className="bg-white bg-opacity-10 rounded-4 p-4 shadow-sm border border-light border-opacity-25"
                  style={{ backdropFilter: "blur(4px)" }}
                >
                  <h5 className="text-warning mb-3">
                    <i className="bi bi-lightning-charge-fill me-2" />
                    Quick Search
                  </h5>
                  <form onSubmit={handleGlobalSearch}>
                    <div className="input-group input-group-lg">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search books or members..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <button className="btn btn-warning fw-semibold">
                        <i className="bi bi-search" />
                      </button>
                    </div>
                  </form>
                  <small className="d-block mt-2 text-white-50">
                    Example: "Clean Code" or "Alice"
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats & Quick Actions */}
      <section className="container mb-5">
        <div className="row g-4">
          {/* Stats Column */}
          <div className="col-lg-8">
            <div className="row g-4">
              <div className="col-sm-6 col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p className="text-uppercase small text-muted mb-1">
                          Total Books
                        </p>
                        <h3 className="mb-0">
                          {loading ? "…" : stats?.totalBooks ?? 0}
                        </h3>
                      </div>
                      <span className="badge bg-primary-subtle text-primary">
                        <i className="bi bi-book-half" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <p className="text-uppercase small text-muted mb-1">
                      Available
                    </p>
                    <h3 className="mb-0">
                      {loading ? "…" : stats?.availableBooks ?? 0}
                    </h3>
                    <div className="progress mt-2" style={{ height: 6 }}>
                      <div
                        className="progress-bar bg-success"
                        style={{
                          width:
                            stats && stats.totalBooks
                              ? `${Math.round(
                                  (stats.availableBooks / stats.totalBooks) *
                                    100
                                )}%`
                              : "0%",
                        }}
                      />
                    </div>
                    <small className="text-muted">
                      {stats?.totalBooks
                        ? `${Math.round(
                            (stats.availableBooks / stats.totalBooks) * 100
                          )}% in stock`
                        : ""}
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <p className="text-uppercase small text-muted mb-1">
                      Members
                    </p>
                    <h3 className="mb-0">
                      {loading ? "…" : stats?.members ?? 0}
                    </h3>
                    <small className="text-success">
                      <i className="bi bi-person-check me-1" />
                      Active community
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <p className="text-uppercase small text-muted mb-1">
                      Active Borrowings
                    </p>
                    <h3 className="mb-0">
                      {loading ? "…" : stats?.activeBorrowings ?? 0}
                    </h3>
                    <small className="text-info">
                      <i className="bi bi-arrow-left-right me-1" />
                      In circulation
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <p className="text-uppercase small text-muted mb-1">
                      Overdue
                    </p>
                    <h3 className="mb-0 text-danger">
                      {loading ? "…" : stats?.overdue ?? 0}
                    </h3>
                    <small className="text-danger">
                      <i className="bi bi-exclamation-triangle me-1" />
                      Needs attention
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-transparent">
                <h6 className="mb-0 fw-semibold">
                  <i className="bi bi-lightning-charge text-warning me-2" />
                  Quick Actions
                </h6>
              </div>
              <div className="list-group list-group-flush">
                <a
                  href="/borrow-return"
                  className="list-group-item list-group-item-action d-flex align-items-center"
                >
                  <i className="bi bi-journal-plus me-3 text-primary fs-5" />
                  Borrow / Return
                </a>
                <a
                  href="/books"
                  className="list-group-item list-group-item-action d-flex align-items-center"
                >
                  <i className="bi bi-bookshelf me-3 text-success fs-5" />
                  Manage Books
                </a>
                <a
                  href="/members"
                  className="list-group-item list-group-item-action d-flex align-items-center"
                >
                  <i className="bi bi-people me-3 text-info fs-5" />
                  Manage Members
                </a>
                <a
                  href="/reports"
                  className="list-group-item list-group-item-action d-flex align-items-center"
                >
                  <i className="bi bi-graph-up me-3 text-danger fs-5" />
                  Reports / Analytics
                </a>
                <a
                  href="/settings"
                  className="list-group-item list-group-item-action d-flex align-items-center"
                >
                  <i className="bi bi-gear me-3 text-secondary fs-5" />
                  Settings
                </a>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent">
                <h6 className="mb-0 fw-semibold">
                  <i className="bi bi-megaphone text-primary me-2" />
                  Announcements
                </h6>
              </div>
              <div className="card-body small">
                <ul className="list-unstyled mb-0">
                  <li className="mb-3">
                    <span className="badge bg-warning text-dark me-2">New</span>
                    Fine calculation module updated.
                  </li>
                  <li className="mb-3">
                    <span className="badge bg-info me-2">Info</span>
                    Scheduled maintenance on Sunday 02:00–03:00.
                  </li>
                  <li>
                    <span className="badge bg-success me-2">Tip</span>
                    Use Reports to view overdue trends.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Borrowings */}
      <section className="container mb-5">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-semibold">
              <i className="bi bi-clock-history me-2 text-secondary" />
              Recently Borrowed
            </h6>
            <a href="/borrow-history" className="small text-decoration-none">
              View All →
            </a>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "40%" }}>Book</th>
                  <th style={{ width: "30%" }}>Member</th>
                  <th style={{ width: "20%" }}>Borrowed At</th>
                  <th style={{ width: "10%" }} className="text-end">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-muted">
                      No recent borrowings.
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-muted">
                      Loading…
                    </td>
                  </tr>
                )}
                {!loading &&
                  recent.map((r) => (
                    <tr key={r.id}>
                      <td className="fw-medium">{r.bookTitle}</td>
                      <td>{r.memberName}</td>
                      <td>{r.borrowedAt}</td>
                      <td className="text-end">
                        <span className="badge bg-primary-subtle text-primary">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pb-5">
        <div className="container text-center text-muted small">
          <div>
            <i className="bi bi-bookmark-star me-1" />
            Library Management System &copy; {new Date().getFullYear()}
          </div>
          <div>Built with React & Bootstrap</div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
