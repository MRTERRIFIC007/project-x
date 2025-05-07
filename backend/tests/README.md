# Delivery Prediction System Tests

This directory contains tests for the Delivery Prediction System backend.

## Test Structure

- `unit/`: Unit tests for individual components

  - `test_delivery_predictor.py`: Tests for the DeliveryPredictor class
  - `test_chatbot_assistant.py`: Tests for the DeliveryChatbot class
  - `test_app.py`: Tests for the Flask application routes
  - `test_gemini_api.py`: Tests for the GeminiAPI wrapper

- `integration/`: Integration tests for the whole system

  - `test_delivery_system.py`: End-to-end tests for delivery workflow

- `fixtures/`: Shared test fixtures and data

## Running Tests

### Install Test Dependencies

```bash
# Install all development dependencies
uv add pytest pytest-cov pytest-mock -d
```

### Run All Tests

```bash
# Run all tests with coverage
pytest
```

### Run Specific Test Suites

```bash
# Run only unit tests
pytest tests/unit/

# Run only tests for a specific component
pytest tests/unit/test_delivery_predictor.py

# Run only integration tests
pytest tests/integration/
```

### View Coverage Report

After running tests with the coverage option, you can view the HTML coverage report:

```bash
# The HTML report will be in the htmlcov/ directory
# Open the index.html file in a web browser
```

## Troubleshooting

- Make sure the `.env` file is properly set up with test API keys if necessary
- For integration tests, some external services might need to be mocked
- If you see import errors, ensure that the project root is in your PYTHONPATH
