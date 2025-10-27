import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/authors.css";
import { FaUser, FaBook, FaSearch } from "react-icons/fa";
import apiClient from "../utils/api.js";

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuthors();
  }, []);

  useEffect(() => {
    filterAuthors();
  }, [searchQuery, authors]);

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/authors");
      setAuthors(response.data || []);
    } catch (error) {
      console.error("Failed to fetch authors:", error);
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAuthors = () => {
    if (!searchQuery.trim()) {
      setFilteredAuthors(authors);
    } else {
      const filtered = authors.filter(author =>
        author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAuthors(filtered);
    }
  };

  const handleAuthorClick = (authorId) => {
    navigate(`/authors/${authorId}`);
  };

  return (
    <div className="authors-container">
      <div className="authors-header">
        <h1 className="page-title">Browse Authors</h1>
        <p className="page-subtitle">Discover books by your favorite authors</p>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search authors by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Authors Grid */}
      {loading ? (
        <p className="loading">Loading authors...</p>
      ) : filteredAuthors.length === 0 ? (
        <div className="no-results">
          <FaUser className="no-results-icon" />
          <p>No authors found</p>
        </div>
      ) : (
        <div className="authors-grid">
          {filteredAuthors.map((author) => (
            <div
              key={author.id}
              className="author-card"
              onClick={() => handleAuthorClick(author.id)}
            >
              <div className="author-avatar">
                <img 
                  src={author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&size=150&background=4CAF50&color=fff`} 
                  alt={author.name}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&size=150&background=4CAF50&color=fff`;
                  }}
                />
              </div>
              <div className="author-info">
                <h3 className="author-name">{author.name}</h3>
                <p className="author-bio">{author.biography || author.bio || "No biography available"}</p>
                <div className="author-stats">
                  <FaBook className="stats-icon" />
                  <span>{author.books_count || author.booksCount || 0} Books</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Authors;
