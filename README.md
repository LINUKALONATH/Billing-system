# PurchaseBillApp

A 2-page web application with Login and Purchase Bill functionality built with **Angular 18** and **ASP.NET Core 8 Web API**.

## Project Structure

```
PurchaseBillApp/
├── frontend/purchase-bill-ui/    # Angular 18 SPA
├── backend/PurchaseBill.API/     # ASP.NET Core 8 Web API
├── database/                     # SQL Server scripts
├── README.md
└── PurchaseBillApp.sln
```

## Setup Instructions

### 1. Database Setup
1. Open SQL Server Management Studio (SSMS)
2. Connect to your SQL Server instance
3. Run `database/01_CreateDatabase.sql`

### 2. Backend Setup
```bash
cd backend/PurchaseBill.API
dotnet restore
dotnet run
```
API starts at `http://localhost:5000` with Swagger at `http://localhost:5000/swagger`

### 3. Frontend Setup
```bash
cd frontend/purchase-bill-ui
npm install
npm start
```
App runs at `http://localhost:4200`

## Login Credentials
- **Email:** info@enhanzer.com
- **Password:** Welcome#5

## Features

### Task 1: Login Page
- Email and password validation
- Calls external API at `https://ez-staging-api.azurewebsites.net/api/External_Api/POS_Api/Invoke`
- Saves user locations to SQL Server `Location_Details` table
- Error messages for failed login
- Route protection for unauthorized access

### Task 2: Purchase Bill Page
- Item autocomplete (Mango, Apple, Banana, Orange, Grapes, Kiwi, Strawberry)
- Batch dropdown populated from Location_Details table
- Fields: Standard Cost, Standard Price, Margin, Qty, Free Qty, Discount
- Auto-calculations:
  - Total Cost = (Standard Cost x Qty) - Discount%
  - Total Selling = Standard Price x Qty
- Add items to table
- Summary panel showing Total Items and Total Quantity

## API Endpoints

### POST /api/auth/login
Authenticates user via external API and saves locations to database.

**Request:**
```json
{
  "email": "info@enhanzer.com",
  "password": "Welcome#5"
}
```

### GET /api/auth/locations?email={email}
Returns saved locations for a user.

## Technologies Used
- Angular 18 (Standalone Components)
- ASP.NET Core 8 Web API
- Entity Framework Core 8
- SQL Server
- TypeScript
