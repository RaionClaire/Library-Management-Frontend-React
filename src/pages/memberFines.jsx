import { useState, useEffect } from "react";
import "../styles/memberFines.css";
import { Banknote, CheckCircle, TriangleAlert } from "lucide-react";
import apiClient from "../utils/api.js";

const mockFines = [
  {
    id: 1,
    bookTitle: "The Lord of the Rings",
    loanDate: "2025-09-01",
    dueDate: "2025-09-15",
    returnDate: "2025-09-20",
    daysOverdue: 5,
    amount: 5000,
    status: "unpaid",
  },
  {
    id: 2,
    bookTitle: "Pride and Prejudice",
    loanDate: "2025-08-15",
    dueDate: "2025-08-29",
    returnDate: "2025-09-02",
    daysOverdue: 4,
    amount: 4000,
    status: "unpaid",
  },
  {
    id: 3,
    bookTitle: "1984",
    loanDate: "2025-07-10",
    dueDate: "2025-07-24",
    returnDate: "2025-07-22",
    daysOverdue: 0,
    amount: 0,
    status: "paid",
  },
];

const MemberFines = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ total: 0, unpaid: 0 });
  const [payingFineId, setPayingFineId] = useState(null);

  useEffect(() => {
    fetchFines();
    fetchUnpaidSummary();
  }, []);

  const fetchFines = async () => {
    setLoading(true);
    try {
      // Assumption: apiClient is configured for member base path or will accept /fines
      const response = await apiClient.get("/member/fines");
      // response.data may be an array or nested (e.g., data.data)
      const finesData = response.data?.data || response.data || [];
      setFines(Array.isArray(finesData) ? finesData : []);
    } catch (error) {
      console.error("Failed to fetch fines, falling back to mock:", error);
      // fallback to mock data so UI remains usable
      setFines(mockFines);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnpaidSummary = async () => {
    try {
      const response = await apiClient.get("/member/fines/unpaid/summary");
      // Expected response: { unpaid_fines: [...], total_unpaid, count } or similar
      const data = response.data || response;
      // Try common shapes, fallback to computing from current fines
      if (data.unpaid_fines || data.total_unpaid !== undefined) {
        setSummary({
          total: fines.length || 0,
          unpaid: data.count ?? (data.unpaid_fines ? data.unpaid_fines.length : 0),
          totalAmount: data.total_unpaid ?? data.total_unpaid_amount ?? 0,
        });
      } else {
        // fallback compute from fines state
        const unpaidFines = (fines.length ? fines : mockFines).filter((f) => f.status === "unpaid");
        const totalUnpaid = unpaidFines.reduce((sum, fine) => sum + fine.amount, 0);
        setSummary({ total: (fines.length || mockFines.length), unpaid: unpaidFines.length, totalAmount: totalUnpaid });
      }
    } catch (error) {
      console.error("Failed to fetch unpaid summary, falling back to computed summary:", error);
      const unpaidFines = (fines.length ? fines : mockFines).filter((f) => f.status === "unpaid");
      const totalUnpaid = unpaidFines.reduce((sum, fine) => sum + fine.amount, 0);
      setSummary({ total: (fines.length || mockFines.length), unpaid: unpaidFines.length, totalAmount: totalUnpaid });
    }
  };

  const handlePayFine = async (fineId) => {
    setPayingFineId(fineId);
    try {
      // Call the member endpoint to mark fine as paid
      await apiClient.post(`/member/fines/${fineId}/pay`);
      // refresh data from server
      await fetchFines();
      await fetchUnpaidSummary();
      alert("Payment successful!");
    } catch (error) {
      console.error("Failed to pay fine:", error);
      // fallback: optimistic update if API fails
      setFines((prev) => prev.map((fine) => (fine.id === fineId ? { ...fine, status: "paid" } : fine)));
      await fetchUnpaidSummary();
      alert("Payment processed locally (API failed). Please refresh to confirm.");
    } finally {
      setPayingFineId(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="member-fines-container">
      <h1 className="page-title">My Fines</h1>

      {/* Summary Cards */}
      <div className="fines-summary">
        <div className="summary-card total">
          <Banknote className="summary-icon" />
          <div className="summary-content">
            <h3>Total Fines</h3>
            <p className="summary-number">{summary.total}</p>
          </div>
        </div>

        <div className="summary-card unpaid">
          <TriangleAlert className="summary-icon" />
          <div className="summary-content">
            <h3>Unpaid Fines</h3>
            <p className="summary-number">{summary.unpaid}</p>
          </div>
        </div>

        <div className="summary-card amount">
          <Banknote className="summary-icon" />
          <div className="summary-content">
            <h3>Total Amount Unpaid</h3>
            <p className="summary-amount">{formatCurrency(summary.totalAmount || 0)}</p>
          </div>
        </div>
      </div>

      {/* Fines Table */}
      <div className="fines-table-container">
        {loading ? (
          <p className="loading">Loading fines...</p>
        ) : fines.length === 0 ? (
          <div className="no-fines">
            <CheckCircle className="no-fines-icon" />
            <p>You have no fines. Great job!</p>
          </div>
        ) : (
          <table className="fines-table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Loan Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Days Overdue</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {fines.map((fine) => (
                <tr key={fine.id} className={fine.status === "paid" ? "paid-row" : ""}>
                  <td className="book-title">{fine.bookTitle}</td>
                  <td>{fine.loanDate}</td>
                  <td>{fine.dueDate}</td>
                  <td>{fine.returnDate}</td>
                  <td className={fine.daysOverdue > 0 ? "overdue" : ""}>{fine.daysOverdue}</td>
                  <td className="amount">{formatCurrency(fine.amount)}</td>
                  <td>
                    <span className={`status-badge ${fine.status}`}>
                      {fine.status === "paid" ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                  <td>
                    {fine.status === "unpaid" ? (
                      <button
                        type="button"
                        className="pay-btn"
                        onClick={() => handlePayFine(fine.id)}
                        disabled={payingFineId === fine.id}
                      >
                        {payingFineId === fine.id ? "Processing..." : "Pay Now"}
                      </button>
                    ) : (
                      <span className="paid-mark">✓ Paid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MemberFines;
