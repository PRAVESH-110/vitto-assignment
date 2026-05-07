# MSME Lending Decision System MVP

This is a production-grade MVP for a Fintech Lending Decision System. It processes loan applications for Micro, Small, and Medium Enterprises (MSMEs), evaluating their financial profiles through a rules-based decision engine to yield an instant credit decision.

## Architecture & Tech Stack

### Backend (Node.js + Express)
- **MVC Pattern**: Clear separation of routes, controllers, and models.
- **Service Layer**: Business logic (Decision Engine) is decoupled from controllers (`services/decisionEngine.js`).
- **Database**: MongoDB with Mongoose (with schemas for BusinessProfile, Application, Decision, and AuditLog).
- **Validation**: Express-validator middleware for robust request validation.
- **Security & Performance**: Helmet for security headers, express-rate-limit for abuse prevention, and Morgan for logging.
- **Error Handling**: Centralized asynchronous error handling middleware.

### Frontend (React + Vite)
- **Styling**: Tailwind CSS with custom glassmorphism and modern UI components.
- **Routing**: React Router DOM for SPA navigation.
- **Micro-Animations**: Framer Motion is used to provide fluid entry animations and dynamic feedback.
- **Component Architecture**: Reusable generic components (`InputField`, `SelectField`, `StatusBadge`, `Loader`, `ErrorAlert`).

---

## Setup & Run Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas URI)

### 1. Backend Setup
```bash
cd Backend-vitto
npm install
```

Ensure your `.env` file exists at `Backend-vitto/.env` with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/vitto_loan_db
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
# Server will run on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd Frontend-vitto
npm install
```

Create a `.env` file at `Frontend-vitto/.env` (optional, defaults to localhost:5000/api):
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
# Server will run on http://localhost:5173
```

---

## API Documentation

### `GET /api/health`
Check if the server is running.
- **Response**: `{ "success": true, "message": "Server is healthy", "data": { "timestamp": "..." } }`

### `POST /api/applications`
Submit a new MSME loan application.
- **Body**:
  ```json
  {
    "ownerName": "John Doe",
    "pan": "ABCDE1234F",
    "businessType": "Private Limited",
    "monthlyRevenue": 500000,
    "loanAmount": 1000000,
    "tenure": 24,
    "loanPurpose": "Expansion"
  }
  ```
- **Success Response (201)**:
  ```json
  {
    "success": true,
    "message": "Application processed successfully",
    "data": {
      "applicationId": "64xyz...",
      "status": "APPROVED",
      "score": 750,
      "reasonCodes": [],
      "riskSummary": "Low risk. Strong financial indicators."
    }
  }
  ```

### `GET /api/applications/:id`
Fetch the details and decision result of a specific application.

---

## Decision Logic Explanation

The core logic resides in `src/services/decisionEngine.js`. 
- **Base Score**: 650
- **Score Range**: 300 - 900

**Signals Evaluated:**
1. **Revenue-to-EMI Ratio**: Calculates the affordability. Ratios > 8 add 100 points, 4-8 add 50 points, < 4 deducts 100 points.
2. **Loan-to-Revenue Ratio**: Measures over-leverage. < 3 adds 50 points, 3-6 deducts 20 points, > 6 deducts 100 points.
3. **Tenure Risk**: Short (< 6 months) or long (> 48 months) tenures are penalized by 50 points. Ideal tenure (12-36) adds 30 points.
4. **Fraud/Validation**: Immediate rejection for malformed PAN, negative values, or unrealistic requests (Loan > 100x Revenue).

**Thresholds:**
- `>= 700`: APPROVED
- `600 - 699`: APPROVED_WITH_WARNINGS
- `< 600`: REJECTED

---

## Edge Case Handling

- **Invalid Form Data**: express-validator catches missing fields, negative numbers, and invalid enums before hitting the DB.
- **Malformed PAN / Unrealistic Math**: Decision engine catches business logic flaws (like a loan 1000x the revenue) and auto-rejects without crashing.
- **API Failures**: Handled via centralized error middleware to ensure the client always receives a structured JSON response (never raw HTML error stacks).
- **Duplicate Businesses**: The controller checks for existing profiles via PAN and updates their revenue rather than creating duplicate profiles.

---

## Assumptions
- PAN is used as the unique identifier for a business profile.
- EMI is calculated simplistically as `Loan Amount / Tenure` (ignoring interest rate for this MVP).
- Authentication/Authorization is bypassed for this MVP as per requirements.

---

## Future Improvements
- Add complex EMI calculation involving an active interest rate and reducing balance.
- Integrate third-party API hooks (e.g., CIBIL/Experian) to augment the base score.
- Implement webhooks or a polling endpoint for asynchronous processing if the decision engine becomes computationally heavy.
- Add user authentication (JWT) for business owners and bank admins.

## Tradeoffs 
I've used MongoDB as the sole Database because 
1) Its the only database I'm comfortable working with, given the time constraint 
2) I didn't feel the need to use Postgres given the conditions and the requirements of the project at the current scale