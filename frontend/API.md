# Optimized Delivery API Documentation

## API Endpoints

### Main Dashboard

- **URL**: `/`
- **Method**: `GET`
- **Description**: Renders the main dashboard with pending orders, today's orders, and real-time data
- **Response Format**: HTML page
- **Status Codes**:
  - `200`: Success

### Delivery Time Prediction

- **URL**: `/predict`
- **Method**: `POST`
- **Description**: Predicts optimal delivery times for a customer on a specific day
- **Request Formats**: JSON or Form data
- **Request Parameters**:
  - `name` (required): Customer name (string)
  - `day` (optional): Day of the week (string, defaults to current day)
- **Response Format**: JSON
- **Response Schema**:
  ```json
  {
    "customer_name": "string",
    "customer_area": "string",
    "day": "string",
    "optimal_times": ["string"],
    "real_time_factors": {
      "traffic": {
        "congestion_level": "string",
        "status": "string"
      },
      "weather": {
        "conditions": "string",
        "temperature": "number",
        "precipitation": "number"
      },
      "festival": {
        "name": "string",
        "impact": "string"
      }
    }
  }
  ```
- **Status Codes**:
  - `200`: Success
  - `400`: Bad Request - Missing required parameters
- **Example Request (JSON)**:
  ```json
  {
    "name": "John Doe",
    "day": "Monday"
  }
  ```
- **Example Response**:
  ```json
  {
    "customer_name": "John Doe",
    "customer_area": "Downtown",
    "day": "Monday",
    "optimal_times": ["9:00-10:00", "14:00-15:00"],
    "real_time_factors": {
      "traffic": { "congestion_level": "Medium", "status": "Flowing" },
      "weather": {
        "conditions": "Rainy",
        "temperature": 15,
        "precipitation": 60
      }
    }
  }
  ```

### Pending Orders

- **URL**: `/pending_orders`
- **Method**: `GET`
- **Description**: Retrieves all pending orders
- **Response Format**: JSON
- **Response Schema**:
  ```json
  [
    {
      "order_id": "string",
      "name": "string",
      "delivery_day": "string",
      "area": "string",
      "address": "string",
      "package_size": "string",
      "status": "string",
      "created_at": "string"
    }
  ]
  ```
- **Status Codes**:
  - `200`: Success
  - `500`: Server Error
- **Example Response**:
  ```json
  [
    {
      "order_id": "10001",
      "name": "John Doe",
      "delivery_day": "Monday",
      "area": "Downtown",
      "address": "123 Main St",
      "package_size": "Medium",
      "status": "Pending",
      "created_at": "2023-06-01 14:30:00"
    },
    {
      "order_id": "10002",
      "name": "Jane Smith",
      "delivery_day": "Wednesday",
      "area": "Suburb",
      "address": "456 Oak Ave",
      "package_size": "Large",
      "status": "Processing",
      "created_at": "2023-06-01 15:45:00"
    }
  ]
  ```

### Add Order

- **URL**: `/add_order`
- **Method**: `POST`
- **Description**: Creates a new order
- **Request Format**: JSON
- **Request Parameters**:
  ```json
  {
    "name": "string", // Customer name (required)
    "delivery_day": "string", // Day of the week for delivery (required)
    "area": "string", // Delivery area (required)
    "address": "string", // Delivery address (required)
    "package_size": "string" // Size of the package (required)
  }
  ```
- **Response Format**: JSON
- **Response Schema**:
  ```json
  {
    "order_id": "string",
    "name": "string",
    "delivery_day": "string",
    "area": "string",
    "address": "string",
    "package_size": "string",
    "status": "string",
    "created_at": "string"
  }
  ```
- **Status Codes**:
  - `200`: Success
  - `500`: Server Error
- **Example Request**:
  ```json
  {
    "name": "Jane Smith",
    "delivery_day": "Wednesday",
    "area": "Suburb",
    "address": "123 Main St",
    "package_size": "Medium"
  }
  ```
- **Example Response**:
  ```json
  {
    "order_id": "10003",
    "name": "Jane Smith",
    "delivery_day": "Wednesday",
    "area": "Suburb",
    "address": "123 Main St",
    "package_size": "Medium",
    "status": "Pending",
    "created_at": "2023-06-02 09:15:00"
  }
  ```

### Update Order Status

- **URL**: `/update_order_status/<order_id>`
- **Method**: `POST`
- **Description**: Updates the status of an existing order
- **Path Parameters**:
  - `order_id`: ID of the order to update
- **Request Format**: JSON
- **Request Parameters**:
  ```json
  {
    "status": "string" // New status for the order (required)
  }
  ```
- **Response Format**: JSON
- **Response Schema**:
  ```json
  {
    "success": true
  }
  ```
  or
  ```json
  {
    "error": "string",
    "details": "string" // Optional
  }
  ```
- **Status Codes**:
  - `200`: Success
  - `500`: Server Error
- **Example Request**:
  ```json
  {
    "status": "Out for Delivery"
  }
  ```
- **Example Response**:
  ```json
  {
    "success": true
  }
  ```

### Mark Order as Delivered

- **URL**: `/mark_delivered/<order_id>`
- **Method**: `GET`
- **Description**: Marks an order as delivered (successful or failed)
- **Path Parameters**:
  - `order_id`: Integer ID of the order to mark as delivered
- **Query Parameters**:
  - `success` (optional): Boolean indicating if delivery was successful (default: true)
- **Response**: Redirects to dashboard
- **Status Codes**:
  - `302`: Redirect
- **Example Request**:
  ```
  GET /mark_delivered/10001?success=false
  ```

### Chatbot Interaction

- **URL**: `/chat`
- **Method**: `POST`
- **Description**: Sends a message to the delivery chatbot and gets a response
- **Request Format**: JSON
- **Request Parameters**:
  ```json
  {
    "message": "string" // User's message (required)
  }
  ```
- **Response Format**: JSON
- **Response Schema**:
  ```json
  {
    "response": "string"
  }
  ```
  or
  ```json
  {
    "error": "string",
    "details": "string" // Optional
  }
  ```
- **Status Codes**:
  - `200`: Success
  - `400`: Bad Request - Empty or missing message
  - `500`: Server Error
- **Example Request**:
  ```json
  {
    "message": "What's the best time to deliver to Downtown today?"
  }
  ```
- **Example Response**:
  ```json
  {
    "response": "Based on current traffic and weather conditions, the best delivery window for Downtown today would be between 10:00-11:30 AM."
  }
  ```

### Route Optimization

- **URL**: `/optimize_route`
- **Method**: `POST`
- **Description**: Generates an optimized delivery route for selected orders
- **Request Format**: JSON
- **Request Parameters**:
  ```json
  {
    "order_ids": ["string"] // Array of order IDs to include in optimization (required)
  }
  ```
- **Response Format**: JSON
- **Response Schema**: Optimized route information (structure depends on implementation)
- **Status Codes**:
  - `200`: Success
  - `500`: Server Error
- **Example Request**:
  ```json
  {
    "order_ids": ["10001", "10002", "10003"]
  }
  ```
- **Example Response**:
  ```json
  {
    "total_distance": 15.3,
    "estimated_time": "90 minutes",
    "route": [
      {
        "order_id": "10002",
        "address": "456 Oak Ave",
        "customer": "Jane Smith"
      },
      {
        "order_id": "10001",
        "address": "123 Main St",
        "customer": "John Doe"
      },
      {
        "order_id": "10003",
        "address": "789 Pine Rd",
        "customer": "Bob Johnson"
      }
    ]
  }
  ```

### Real-time Data

- **URL**: `/real_time_data`
- **Method**: `GET`
- **Description**: Retrieves real-time data about weather, traffic, or local events
- **Query Parameters**:
  - `type` (required): Type of data to retrieve - One of: `traffic`, `weather`, `festivals`, `all`
  - `area` (optional): Specific area to get data for
- **Response Format**: JSON
- **Response Schema**: Varies based on the type parameter
  - For `type=all`:
    ```json
    {
      "weather": {
        // Weather data object
      },
      "traffic": {
        // Traffic data object
      },
      "festivals": {
        // Festivals data object
      },
      "timestamp": "string",
      "weather_summary": "string",
      "traffic_summary": "string",
      "festival_summary": "string"
    }
    ```
- **Status Codes**:
  - `200`: Success
  - `400`: Bad Request - Invalid data type
- **Example Request**:
  ```
  GET /real_time_data?type=weather
  ```
- **Example Response**:
  ```json
  {
    "conditions": "Partly Cloudy",
    "temperature": {
      "current": 22,
      "min": 18,
      "max": 25
    },
    "precipitation": {
      "chance": 20,
      "type": "Rain"
    },
    "wind": {
      "speed": 10,
      "direction": "NE"
    }
  }
  ```

### Geocoding

- **URL**: `/geocode`
- **Method**: `POST`
- **Description**: Geocodes an address to get coordinates
- **Request Format**: Form data
- **Request Parameters**:
  - `address` (required): Address to geocode
- **Response Format**: JSON
- **Response Schema**:
  ```json
  {
    "lat": "number",
    "lon": "number",
    "display_name": "string"
  }
  ```
  or
  ```json
  {
    "error": "string"
  }
  ```
- **Status Codes**:
  - `200`: Success
  - `400`: Bad Request - Missing address
  - `404`: Not Found - Address could not be geocoded
  - `500`: Server Error
- **Example Request**:
  ```
  POST /geocode
  address=1600 Pennsylvania Avenue, Washington DC
  ```
- **Example Response**:
  ```json
  {
    "lat": 38.8977,
    "lon": -77.0365,
    "display_name": "The White House, 1600, Pennsylvania Avenue Northwest, Ward 2, Washington, District of Columbia, 20500, United States"
  }
  ```
