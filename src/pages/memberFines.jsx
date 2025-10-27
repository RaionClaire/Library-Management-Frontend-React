import { useState, useEffect } from "react";
import "../styles/memberFines.css";
import { FaMoneyBillWave, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
// import apiClient from "../utils/api.js";

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

  const fetchFines = () => {
    setLoading(true);
    try {
      // Real API call when backend is available:
      // const response = await apiClient.get("/member/fines");
      // setFines(response.data);
      
      // Mock data for now
      setFines(mockFines);
    } catch (error) {
      console.error("Failed to fetch fines:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnpaidSummary = () => {
    try {
      // Real API call when backend is available:
      // const response = await apiClient.get("/member/fines/unpaid/summary");
      // setSummary(response.data);
      
      // Mock calculation
      const unpaidFines = mockFines.filter(f => f.status === "unpaid");
      const totalUnpaid = unpaidFines.reduce((sum, fine) => sum + fine.amount, 0);
      setSummary({
        total: mockFines.length,
        unpaid: unpaidFines.length,
        totalAmount: totalUnpaid,
      });
    } catch (error) {
      console.error("Failed to fetch unpaid summary:", error);
    }
  };

  const handlePayFine = async (fineId) => {
    setPayingFineId(fineId);
    try {
      // Real API call when backend is available:
      // await apiClient.post(`/member/fines/${fineId}/pay`);
      
      // Mock payment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFines(fines.map(fine =>
        fine.id === fineId ? { ...fine, status: "paid" } : fine
      ));
      
      fetchUnpaidSummary();
      alert("Payment successful!");
    } catch (error) {
      console.error("Failed to pay fine:", error);
      alert("Payment failed. Please try again.");
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
          <FaMoneyBillWave className="summary-icon" />
          <div className="summary-content">
            <h3>Total Fines</h3>
            <p className="summary-number">{summary.total}</p>
          </div>
        </div>

        <div className="summary-card unpaid">
          <FaExclamationTriangle className="summary-icon" />
          <div className="summary-content">
            <h3>Unpaid Fines</h3>
            <p className="summary-number">{summary.unpaid}</p>
          </div>
        </div>

        <div className="summary-card amount">
          <FaMoneyBillWave className="summary-icon" />
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
            <FaCheckCircle className="no-fines-icon" />
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
