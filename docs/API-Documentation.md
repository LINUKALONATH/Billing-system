# PurchaseBillApp - API Documentation

Base URL: `http://localhost:5000/api` or `https://localhost:5001/api`

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/login`
Authenticates a user and retrieves available location permissions.

**Request Payload (`LoginRequestDto`):**
```json
{
  "username": "admin",
  "password": "password123",
  "locationId": 1
}
```

**Response (`ApiResponse<LoginResponseDto>`):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "simulated_jwt_token_sample_abc123",
    "username": "admin",
    "fullName": "System Administrator",
    "userId": 1,
    "selectedLocationId": 1,
    "selectedLocationName": "Main Store - Central Warehouse",
    "locations": [
      { "locationId": 1, "locationCode": "LOC-001", "locationName": "Main Store - Central Warehouse", "isDefault": true }
    ]
  }
}
```

---

## 2. Location Endpoints (`/api/locations`)

### `GET /api/locations`
Get all active locations/branches.

---

## 3. Purchase Bill Endpoints (`/api/purchase-bills`)

### `GET /api/purchase-bills/items/search?query={searchTerm}`
Searches item master list by item name or item code for auto-complete.

### `GET /api/purchase-bills/items/{itemId}/batches?locationId={locationId}`
Retrieves active batch list for a specific product and location.

### `POST /api/purchase-bills`
Submits a complete purchase invoice with line items.
