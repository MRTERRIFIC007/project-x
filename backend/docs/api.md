# Delivery Management System API Documentation

This document outlines the API endpoints available in the Delivery Management System backend.

## Base URL

All endpoints are relative to the base URL of the server. For local development, this is typically:

```
http://localhost:5000
```

## Authentication

Most API endpoints currently do not require authentication.

## Data Formats

Unless otherwise specified, all request and response bodies use JSON format.

## Endpoints

### 1. Delivery Predictions

#### Get Optimal Delivery Times

```
POST /predict
```

Predicts optimal delivery times for a specific customer on a given day.

**Request Parameters:**

| Parameter | Type   | Required | Description                               |
| --------- | ------ | -------- | ----------------------------------------- |
| name      | string | Yes      | Customer name                             |
| day       | string | No       | Day of the week (defaults to current day) |

**Response:**

```json
{
  "customer_name": "John Smith",
  "customer_area": "Downtown",
  "day": "Monday",
  "optimal_times": [
    {
      "time_window": "10:00-12:00",
      "score": 0.85,
      "factors": {
        "historical_success": "High",
        "customer_preference": "Medium"
      }
    },
    {
      "time_window": "14:00-16:00",
      "score": 0.72,
      "factors": {
        "historical_success": "Medium",
        "customer_preference": "High"
      }
    }
  ],
  "real_time_factors": {
    "traffic": {
      "congestion_level": "Medium",
      "status": "Flowing with some delays"
    },
    "weather": {
      "conditions": "Partly Cloudy",
      "temperature": 72,
      "precipitation": 20
    }
  }
}
```

### 2. Order Management

#### Get All Pending Orders

```
GET /pending_orders
```

Retrieves all pending delivery orders.

**Response:**

```json
[
  {
    "order_id": "10001",
    "name": "John Smith",
    "address": "123 Main St",
    "area": "Downtown",
    "status": "pending",
    "delivery_day": "Monday",
    "optimal_time": "10:00-12:00",
    "parcel_details": {
      "weight": "1.5kg",
      "dimensions": "30x20x15cm"
    }
  },
  {
    "order_id": "10002",
    "name": "Jane Doe",
    "address": "456 Oak Ave",
    "area": "Suburb",
    "status": "in_transit",
    "delivery_day": "Monday",
    "optimal_time": "14:00-16:00",
    "parcel_details": {
      "weight": "2.3kg",
      "dimensions": "40x30x20cm"
    }
  }
]
```

#### Add New Order

```
POST /add_order
```

Creates a new delivery order.

**Request Body:**

```json
{
  "name": "John Smith",
  "address": "123 Main St",
  "area": "Downtown",
  "delivery_day": "Monday",
  "parcel_details": {
    "weight": "1.5kg",
    "dimensions": "30x20x15cm"
  }
}
```

**Response:**

```json
{
  "order_id": "10003",
  "status": "pending",
  "message": "Order created successfully"
}
```

#### Update Order Status

```
POST /update_order_status/<order_id>
```

Updates the status of an existing order.

**URL Parameters:**

| Parameter | Description            |
| --------- | ---------------------- |
| order_id  | Unique ID of the order |

**Request Body:**

```json
{
  "status": "in_transit"
}
```

**Response:**

```json
{
  "order_id": "10001",
  "message": "Order status updated successfully"
}
```

#### Mark Order as Delivered

```
GET /mark_delivered/<order_id>
```

Marks an order as delivered.

**URL Parameters:**

| Parameter | Description            |
| --------- | ---------------------- |
| order_id  | Unique ID of the order |

**Response:**

```json
{
  "order_id": "10001",
  "message": "Order marked as delivered"
}
```

### 3. Route Optimization

```
POST /optimize_route
```

Optimizes the delivery route for a set of orders.

**Request Body:**

```json
{
  "orders": [
    {
      "order_id": "10001",
      "name": "John Smith",
      "address": "123 Main St",
      "area": "Downtown"
    },
    {
      "order_id": "10002",
      "name": "Jane Doe",
      "address": "456 Oak Ave",
      "area": "Suburb"
    }
  ]
}
```

**Response:**

```json
{
  "optimized_route": [
    {
      "order_id": "10001",
      "name": "John Smith",
      "address": "123 Main St",
      "area": "Downtown",
      "estimated_arrival": "10:30"
    },
    {
      "order_id": "10002",
      "name": "Jane Doe",
      "address": "456 Oak Ave",
      "area": "Suburb",
      "estimated_arrival": "11:45"
    }
  ],
  "total_distance": "15km",
  "estimated_total_time": "2hr 15min"
}
```

### 4. Real-Time Data

```
GET /real_time_data
```

Retrieves real-time data affecting deliveries.

**Query Parameters:**

| Parameter | Type   | Required | Description                                     |
| --------- | ------ | -------- | ----------------------------------------------- |
| type      | string | No       | Data type: "weather", "traffic", or "festivals" |
| area      | string | No       | Specific area to get data for                   |

**Response Example (Weather):**

```json
{
  "weather": {
    "conditions": "Partly Cloudy",
    "temperature": {
      "current": 72,
      "feels_like": 75,
      "min": 65,
      "max": 80
    },
    "wind": {
      "speed": 10,
      "direction": "NE"
    },
    "precipitation": {
      "chance": 20,
      "amount": "0mm"
    },
    "last_updated": "2023-05-10T14:30:00Z"
  }
}
```

### 5. Geocoding

```
POST /geocode
```

Geocodes an address to get its coordinates.

**Request Body:**

```json
{
  "address": "123 Main St, Anytown, USA"
}
```

**Response:**

```json
{
  "coordinates": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "formatted_address": "123 Main St, Anytown, USA"
}
```

### 6. Chatbot Assistant

```
POST /chat
```

Interacts with the delivery chatbot assistant.

**Request Body:**

```json
{
  "message": "When will my package be delivered?",
  "customer_name": "John Smith",
  "order_id": "10001"
}
```

**Response:**

```json
{
  "response": "Hello John! Your package (Order #10001) is scheduled for delivery today between 10:00 AM and 12:00 PM. The delivery is currently on track with no delays.",
  "suggested_actions": [
    {
      "action": "track_order",
      "label": "Track Order"
    },
    {
      "action": "reschedule",
      "label": "Reschedule Delivery"
    }
  ]
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "error": "Required parameter 'name' is missing"
}
```

### 404 Not Found

```json
{
  "error": "Order with ID 10001 not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "An unexpected error occurred"
}
```
