# Car Parking Management System

A full-stack web application built for XWZ LTD to manage car parking lots, record entries and exits, calculate fees, and generate reports.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, React Router v6, React Hook Form, Axios
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT & bcrypt

## Features
- Role-based Access Control (Admin & Attendant)
- Parking Lot Registration and Management
- Automated space availability tracking
- Car entry recording with printable ticket generation
- Car exit processing with automated fee calculation and printable bill generation
- Real-time Dashboard with key metrics
- Detailed incoming and outgoing revenue reports (Admin only)
- API documentation with Swagger UI

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- PostgreSQL running locally (Default port: 5432)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run Prisma migrations to set up the database schema:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Seed the database with initial data (Admin, Attendant, and Parkings):
   ```bash
   npx prisma db seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will run on http://localhost:5000*
   *Swagger documentation will be available at http://localhost:5000/api-docs*

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on http://localhost:5173*

## Testing the Application

1. **Login:**
   - Admin account: `admin@xwz.com` / `admin123`
   - Attendant account: `jean@xwz.com` / `attend123`

2. **Dashboard:**
   - View high-level stats like total parkings, cars currently parked, and today's revenue.

3. **Car Flow (Entry to Exit):**
   - Go to "Record Entry" (Sidebar).
   - Enter a plate number (e.g., RAA 123 A) and select a parking lot. Submit.
   - A ticket is generated. Note the **Ticket ID**. Click "Print Ticket" to see the print view.
   - Go to "Record Exit" (Sidebar).
   - Paste the Ticket ID and submit.
   - A bill is generated showing the duration and cost. The space in the parking lot is freed up. Click "Print Bill" to see the print view.

4. **Reports (Admin Only):**
   - Log in as Admin.
   - Go to "Reports".
   - Select dates and click "Generate Report" to view incoming cars or outgoing cars and revenue collected.


