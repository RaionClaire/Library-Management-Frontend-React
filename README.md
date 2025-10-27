# E-Library Frontend - React Application

A modern e-library management system frontend built with React 19, designed to work seamlessly with a Laravel backend API.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- Laravel backend API running (optional - has mock mode)

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd e-library

# Install dependencies
npm install

# Start development server
npm start
```

The app will run at `http://localhost:1234`

---

## 📁 Project Structure

```
e-library/
├── src/
│   ├── App.jsx                    # Main app component
│   ├── index.jsx                  # Entry point
│   ├── components/                # Reusable components
│   │   ├── sidebar.jsx           # Navigation sidebar
│   │   ├── AuthorsTable.jsx      # Admin authors table
│   │   ├── BooksTable.jsx        # Admin books table
│   │   ├── CategoriesTable.jsx   # Admin categories table
│   │   ├── LoansTable.jsx        # Admin loans table
│   │   ├── FinesTable.jsx        # Admin fines table
│   │   └── Reports.jsx           # Admin reports
│   ├── pages/                     # Page components
│   │   ├── Home.jsx              # Book browsing with search/filter
│   │   ├── login.jsx             # Login page
│   │   ├── register.jsx          # Registration page
│   │   ├── profil.jsx            # User profile
│   │   ├── totalBuku.jsx         # Books statistics
│   │   ├── detailBuku.jsx        # Book details
│   │   ├── pinjamBuku.jsx        # Borrow book form
│   │   ├── peminjamanAktif.jsx   # Active loans
│   │   ├── notifikasi.jsx        # Notifications
│   │   ├── memberFines.jsx       # Member fines management
│   │   ├── authors.jsx           # Browse authors
│   │   ├── authorDetail.jsx      # Author details + books
│   │   ├── categories.jsx        # Browse categories
│   │   ├── categoryDetail.jsx    # Category details + books
│   │   ├── AdminDashboard.jsx    # Admin dashboard
│   │   ├── lupaPassword.jsx      # Forgot password
│   │   └── ubahPassword.jsx      # Change password
│   ├── router/
│   │   └── AppRouter.jsx         # Route configuration
│   ├── styles/                    # CSS files
│   └── utils/
│       └── api.js                # **API client & mock mode**
├── package.json
└── README.md
```

---

## 🔌 Backend Integration Guide

### Step 1: Configure Backend URL

Edit `src/utils/api.js`:

```javascript
const API_BASE_URL = "http://localhost:8000/api"; // Change to your backend URL
const USE_MOCK_MODE = false; // Set to false to use real backend
```

### Step 2: Ensure Backend is Running

Your Laravel backend should be running at `http://localhost:8000` with these routes configured (see Laravel `routes/api.php`).

### Step 3: Update API Calls in Components

Each component has commented API integration points. Simply **uncomment the real API calls** and **remove/comment the mock data**.

---

## 🗺️ API Endpoints Mapping

### **Public Routes** (No Auth Required)

| Frontend Page | Method | Endpoint | Description |
|--------------|--------|----------|-------------|
| `login.jsx` | POST | `/login` | User login |
| `register.jsx` | POST | `/register` | User registration |

---

### **Authenticated Routes** (All Users)

| Frontend Page | Method | Endpoint | Description |
|--------------|--------|----------|-------------|
| `profil.jsx` | GET | `/me` | Get current user |
| `profil.jsx` | PUT | `/profile` | Update profile |
| `sidebar.jsx` | POST | `/logout` | Logout user |

---

### **Admin Routes** (`/admin/*`)

#### **Authors Management**
| Component | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| `AuthorsTable.jsx` | GET | `/admin/authors` | List all authors |
| `AuthorsTable.jsx` | POST | `/admin/authors` | Create author |
| `AuthorsTable.jsx` | PUT | `/admin/authors/{id}` | Update author |
| `AuthorsTable.jsx` | DELETE | `/admin/authors/{id}` | Delete author |

#### **Categories Management**
| Component | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| `CategoriesTable.jsx` | GET | `/admin/categories` | List all categories |
| `CategoriesTable.jsx` | POST | `/admin/categories` | Create category |
| `CategoriesTable.jsx` | PUT | `/admin/categories/{id}` | Update category |
| `CategoriesTable.jsx` | DELETE | `/admin/categories/{id}` | Delete category |

#### **Books Management**
| Component | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| `BooksTable.jsx` | GET | `/admin/books` | List all books |
| `BooksTable.jsx` | POST | `/admin/books` | Create book |
| `BooksTable.jsx` | PUT | `/admin/books/{id}` | Update book |
| `BooksTable.jsx` | DELETE | `/admin/books/{id}` | Delete book |

#### **Loans Management**
| Component | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| `LoansTable.jsx` | GET | `/admin/loans` | List all loans |
| `LoansTable.jsx` | POST | `/admin/loans` | Create loan |
| `LoansTable.jsx` | PUT | `/admin/loans/{id}` | Update loan |
| `LoansTable.jsx` | DELETE | `/admin/loans/{id}` | Delete loan |
| `LoansTable.jsx` | POST | `/admin/loans/{id}/return` | Return book |
| `LoansTable.jsx` | POST | `/admin/loans/{id}/extend` | Extend due date |

#### **Fines Management**
| Component | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| `FinesTable.jsx` | GET | `/admin/fines` | List all fines |
| `FinesTable.jsx` | POST | `/admin/fines` | Create fine |
| `FinesTable.jsx` | PUT | `/admin/fines/{id}` | Update fine |
| `FinesTable.jsx` | DELETE | `/admin/fines/{id}` | Delete fine |
| `FinesTable.jsx` | POST | `/admin/fines/{id}/pay` | Pay fine |
| `FinesTable.jsx` | GET | `/admin/fines/unpaid/summary` | Unpaid summary |
| `FinesTable.jsx` | GET | `/admin/fines/calculate/{loanId}` | Calculate fine |

#### **Reports (Admin Only)**
| Component | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| `Reports.jsx` | GET | `/admin/reports/loans/statistics` | Loan stats |
| `Reports.jsx` | GET | `/admin/reports/loans/trend` | Loan trends |
| `Reports.jsx` | GET | `/admin/reports/books/most-borrowed` | Most borrowed |
| `Reports.jsx` | GET | `/admin/reports/books/inventory` | Inventory |
| `Reports.jsx` | GET | `/admin/reports/books/by-category` | Books by category |
| `Reports.jsx` | GET | `/admin/reports/members/most-active` | Active members |
| `Reports.jsx` | GET | `/admin/reports/members/statistics` | Member stats |
| `Reports.jsx` | GET | `/admin/reports/loans/overdue` | Overdue loans |
| `Reports.jsx` | GET | `/admin/reports/fines` | Fine reports |
| `Reports.jsx` | GET | `/admin/reports/comprehensive` | Full report |

---

### **Member Routes** (`/member/*`)

#### **Member Loans**
| Component | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| `peminjamanAktif.jsx` | GET | `/member/loans` | Get member's loans |
| `peminjamanAktif.jsx` | GET | `/member/loans/{id}` | Get loan details |

#### **Member Fines**
| Component | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| `memberFines.jsx` | GET | `/member/fines` | Get member's fines |
| `memberFines.jsx` | GET | `/member/fines/{id}` | Get fine details |
| `memberFines.jsx` | GET | `/member/fines/unpaid/summary` | Unpaid summary |
| `memberFines.jsx` | POST | `/member/fines/{id}/pay` | Pay fine |

#### **Member Notifications**
| Component | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| `notifikasi.jsx` | GET | `/member/notifications/summary` | Notification summary |
| `notifikasi.jsx` | GET | `/member/notifications/near-due` | Near due loans |
| `notifikasi.jsx` | GET | `/member/notifications/overdue` | Overdue loans |

---

### **Shared Routes** (Admin & Member)

#### **Books (Read-Only for Members)**
| Component | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| `Home.jsx` | GET | `/books` | List all books |
| `detailBuku.jsx` | GET | `/books/{id}` | Get book details |
| `totalBuku.jsx` | GET | `/books-total` | Total books count |
| `Home.jsx` | GET | `/books/search?keyword={keyword}` | Search books |
| `Home.jsx` | GET | `/books/filter/category?category={category}` | Filter by category |
| `Home.jsx` | GET | `/books/filter/author?author={author}` | Filter by author |

#### **Authors (Read-Only for Members)**
| Component | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| `authors.jsx` | GET | `/authors` | List all authors |
| `authorDetail.jsx` | GET | `/authors/{id}` | Get author + books |

#### **Categories (Read-Only for Members)**
| Component | Method | Endpoint | Description |
|-----------|--------|----------|-------------|
| `categories.jsx` | GET | `/categories` | List all categories |
| `categoryDetail.jsx` | GET | `/categories/{id}` | Get category + books |

---

## 🔄 Switching from Mock Mode to Real Backend

### Example: `memberFines.jsx`

**Current (Mock Mode):**
```javascript
useEffect(() => {
  const fetchFines = () => {
    setLoading(true);
    // Mock data
    setFines(mockFines);
    setLoading(false);
  };

  fetchFines();
}, []);
```

**After Backend Connection:**
```javascript
useEffect(() => {
  const fetchFines = async () => {
    setLoading(true);
    try {
      // Uncomment this:
      const response = await apiClient.get("/member/fines");
      setFines(response.data);
      
      // Remove mock data:
      // setFines(mockFines);
    } catch (error) {
      console.error("Error fetching fines:", error);
      setError("Failed to load fines");
    } finally {
      setLoading(false);
    }
  };

  fetchFines();
}, []);
```

### Example: `Home.jsx` (Search Books)

**Current (Mock Mode):**
```javascript
const handleSearch = (e) => {
  const keyword = e.target.value;
  setSearchKeyword(keyword);
  
  // Mock filtering
  const filtered = mockBooks.filter(book =>
    book.title.toLowerCase().includes(keyword.toLowerCase()) ||
    book.author.toLowerCase().includes(keyword.toLowerCase())
  );
  setFilteredBooks(filtered);
};
```

**After Backend Connection:**
```javascript
const handleSearch = async (e) => {
  const keyword = e.target.value;
  setSearchKeyword(keyword);
  
  if (keyword.trim() === "") {
    // Reset to all books
    const response = await apiClient.get("/books");
    setFilteredBooks(response.data);
  } else {
    // Search via API
    const response = await apiClient.get(`/books/search?keyword=${keyword}`);
    setFilteredBooks(response.data);
  }
};
```

---

## 🛠️ Authentication Flow

### Login Process
1. User submits credentials at `/login`
2. Frontend sends `POST /login` with `{ email, password }`
3. Backend returns `{ token, user: { id, name, email, role } }`
4. Frontend stores token in `localStorage` as `token`
5. Frontend stores user data in `localStorage` as `user`
6. Redirect based on role:
   - `admin` → `/admin-dashboard`
   - `member` → `/home`

### API Client Configuration
The `apiClient` in `src/utils/api.js` automatically includes the token:

```javascript
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Logout Process
1. User clicks logout button
2. Frontend sends `POST /logout`
3. Backend invalidates token (if using Sanctum)
4. Frontend clears `localStorage`
5. Redirect to `/login`

---

## 🎭 Mock Mode Features

### What is Mock Mode?
Mock mode allows the frontend to work **without a running backend**. Perfect for:
- Frontend development and testing
- UI/UX design iterations
- Demo presentations
- Backend downtime

### How It Works
1. Check if backend is available
2. If not, use mock data stored in components
3. All CRUD operations work in memory (not persisted)
4. First registered user becomes admin automatically

### Mock Data Locations
Each component has mock data at the top:

```javascript
// Example: memberFines.jsx
const mockFines = [
  {
    id: 1,
    book_title: "The Great Gatsby",
    amount: 15000,
    status: "unpaid",
    due_at: "2024-01-15",
  },
  // ... more mock data
];
```

### Disabling Mock Mode
Set `USE_MOCK_MODE = false` in `src/utils/api.js`

---

## 🧪 Testing the Frontend

### Test User Accounts (Mock Mode)
When you register the **first user**, they automatically become `admin`.

**Admin User:**
```
Email: admin@test.com
Password: password123
Role: admin
```

**Member User (register second):**
```
Email: member@test.com
Password: password123
Role: member
```

### Testing Checklist

#### Public Routes
- [ ] Register new user
- [ ] Login with credentials
- [ ] Forgot password flow

#### Member Features
- [ ] Browse books (Home page)
- [ ] Search books by keyword
- [ ] Filter by category
- [ ] Filter by author
- [ ] View book details
- [ ] Borrow a book
- [ ] View active loans
- [ ] View fines
- [ ] Pay a fine
- [ ] View notifications
- [ ] Browse authors
- [ ] View author details
- [ ] Browse categories
- [ ] View category details
- [ ] Update profile
- [ ] Change password
- [ ] Logout

#### Admin Features
- [ ] Access admin dashboard
- [ ] Manage authors (CRUD)
- [ ] Manage categories (CRUD)
- [ ] Manage books (CRUD)
- [ ] Manage loans (CRUD)
- [ ] Manage fines (CRUD)
- [ ] View reports
- [ ] All member features

---

## 🔧 Troubleshooting

### Issue: "Network Error" when connecting to backend

**Solution:**
1. Ensure Laravel backend is running: `php artisan serve`
2. Check `API_BASE_URL` in `src/utils/api.js` matches your backend URL
3. Enable CORS in Laravel (`config/cors.php`):
   ```php
   'paths' => ['api/*'],
   'allowed_origins' => ['http://localhost:1234'],
   'allowed_methods' => ['*'],
   'allowed_headers' => ['*'],
   'supports_credentials' => true,
   ```

### Issue: "401 Unauthorized" on API calls

**Solution:**
1. Check if token is stored: `console.log(localStorage.getItem("token"))`
2. Verify token is valid in backend
3. Check if route requires authentication middleware
4. Ensure `Authorization: Bearer {token}` header is sent

### Issue: "403 Forbidden" on admin routes

**Solution:**
1. Verify user role: `console.log(JSON.parse(localStorage.getItem("user")).role)`
2. Ensure user has `admin` role in database
3. Check Laravel middleware: `role:admin`

### Issue: Mock data not updating after edit

**Solution:**
Mock mode stores data in memory only. Refresh the page to reset.
For persistent testing, connect to real backend.

---

## 📦 Build for Production

```bash
# Build optimized production bundle
npm run build

# Output will be in /dist folder
# Deploy /dist to your web server
```

### Environment Variables (Optional)
Create `.env` file:
```
API_BASE_URL=https://your-backend-url.com/api
```

Update `src/utils/api.js`:
```javascript
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000/api";
```

---

## 🎨 Features Overview

### User Features (Member)
✅ Browse books with search and filters  
✅ View book details (title, author, category, availability)  
✅ Borrow books  
✅ View active loans  
✅ View and pay fines  
✅ Receive notifications (near due, overdue)  
✅ Browse authors and categories  
✅ Update profile  
✅ Change password  

### Admin Features
✅ All member features  
✅ Manage authors (add, edit, delete)  
✅ Manage categories (add, edit, delete)  
✅ Manage books (add, edit, delete)  
✅ Manage loans (approve, return, extend)  
✅ Manage fines (calculate, pay, delete)  
✅ View comprehensive reports:
  - Loan statistics and trends
  - Most borrowed books
  - Book inventory
  - Most active members
  - Overdue loans
  - Fine reports

### UI/UX Features
✅ Modern gradient design  
✅ Icon-based navigation  
✅ Smooth animations  
✅ Mobile responsive  
✅ Loading states  
✅ Error handling  
✅ Role-based access control  
✅ Professional card layouts  

---

## 🤝 Backend Developer Guide

### What You Need to Provide

1. **Laravel Backend Running**
   - Install dependencies: `composer install`
   - Configure `.env` (database, app key)
   - Run migrations: `php artisan migrate`
   - Start server: `php artisan serve`

2. **CORS Configuration**
   - Allow frontend origin: `http://localhost:1234`
   - Allow credentials: `supports_credentials => true`

3. **API Response Format**
   - Use consistent JSON structure
   - Return appropriate HTTP status codes
   - Include error messages in response

4. **Authentication (Laravel Sanctum)**
   - Login returns: `{ token, user: { id, name, email, role } }`
   - Protect routes with `auth:sanctum` middleware
   - Implement role-based middleware: `role:admin` or `role:member`

5. **API Endpoints**
   - Follow the routes defined in Laravel `routes/api.php`
   - All endpoints listed in this README must work
   - Return paginated results for large datasets

### Example Response Formats

**Success Response:**
```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "message": "Data fetched successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message here",
  "errors": { /* validation errors */ }
}
```

**Login Response:**
```json
{
  "token": "1|abc123...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Development Notes

- Built with **React 19.2.0**
- Uses **React Router 6.30.1** for navigation
- Bundled with **Parcel 2.16.0**
- API client using **Axios 1.12.2**
- Icons from **React Icons 5.5.0**
- State management with **React Hooks**
- CSS modules for styling

---

## 🚀 Ready to Connect!

This frontend is **100% ready** to connect to your Laravel backend. Just update the API URL, uncomment the API calls, and you're good to go!

Happy coding! 🎉
