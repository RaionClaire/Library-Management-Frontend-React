import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/categories.css";
import { Tags, Book, Search } from "lucide-react";
import apiClient from "../utils/api.js";

// Category icon/color mapping
const categoryStyles = {
  "Fantasy": { icon: "🧙‍♂️", color: "#667eea" },
  "Romance": { icon: "💖", color: "#ec4899" },
  "Classic": { icon: "📚", color: "#8b5cf6" },
  "Science Fiction": { icon: "🚀", color: "#3b82f6" },
  "Mystery": { icon: "🔍", color: "#f59e0b" },
  "Biography": { icon: "👤", color: "#10b981" },
  "History": { icon: "🏛️", color: "#ef4444" },
  "Self-Help": { icon: "💡", color: "#f97316" },
  "default": { icon: "�", color: "#6b7280" }
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [searchQuery, categories]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/categories");
      const categoriesData = (response.data || []).map(cat => {
        const style = categoryStyles[cat.name] || categoryStyles.default;
        return {
          ...cat,
          icon: style.icon,
          color: style.color
        };
      });
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/categories/${categoryId}`);
  };

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h1 className="page-title">Browse Categories</h1>
        <p className="page-subtitle">Explore books by genre and topic</p>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Categories Grid */}
      {loading ? (
        <p className="loading">Loading categories...</p>
      ) : filteredCategories.length === 0 ? (
        <div className="no-results">
          <Tags className="no-results-icon" />
          <p>No categories found</p>
        </div>
      ) : (
        <div className="categories-grid">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => handleCategoryClick(category.id)}
              style={{ borderLeft: `6px solid ${category.color}` }}
            >
              <div className="category-icon" style={{ background: `${category.color}15` }}>
                <span className="icon-emoji">{category.icon}</span>
              </div>
              <div className="category-info">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">{category.description || "Explore books in this category"}</p>
                <div className="category-stats" style={{ color: category.color }}>
                  <Book className="stats-icon" />
                  <span>{category.books_count || category.booksCount || 0} Books</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
