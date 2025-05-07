import pytest
import pandas as pd
import json
import os
from unittest.mock import MagicMock, patch
from delivery_predictor import DeliveryPredictor
from chatbot_assistant import DeliveryChatbot
from gemini_api import GeminiAPI


@pytest.fixture
def mock_dataset():
    """Create a small mock dataset for testing"""
    data = {
        "Name": ["Aditya", "Aditya", "Vivaan", "Aarav", "Meera", "Kabir", "Kabir"],
        "Day of Delivery Attempt": [
            "Monday",
            "Tuesday",
            "Monday",
            "Wednesday",
            "Thursday",
            "Monday",
            "Monday",
        ],
        "Time": ["11 AM", "2 PM", "11 AM", "4 PM", "2 PM", "11 AM", "4 PM"],
        "Delivery Status": [
            "Success",
            "Success",
            "Failed",
            "Success",
            "Success",
            "Success",
            "Failed",
        ],
        "Weather": ["Sunny", "Cloudy", "Rainy", "Sunny", "Sunny", "Sunny", "Sunny"],
        "Traffic": [
            "Light",
            "Moderate",
            "Heavy",
            "Light",
            "Moderate",
            "Light",
            "Heavy",
        ],
        "Festival": [0, 0, 1, 0, 0, 0, 0],
    }
    return pd.DataFrame(data)


@pytest.fixture
def mock_predictor(mock_dataset, tmp_path):
    """Create a mock predictor with a test dataset"""
    # Save mock dataset to a temporary CSV file
    dataset_path = tmp_path / "test_dataset.csv"
    mock_dataset.to_csv(dataset_path, index=False)

    # Create a predictor with the test dataset
    with patch.object(DeliveryPredictor, "generate_pending_orders"):
        predictor = DeliveryPredictor(dataset_path=str(dataset_path))

    # Mock the real-time data methods
    predictor.get_real_time_data = MagicMock(return_value={})

    return predictor


@pytest.fixture
def mock_orders():
    """Create mock pending orders"""
    return [
        {
            "order_id": "10001",
            "name": "Kabir",
            "delivery_day": "Monday",
            "area": "Chandkheda",
            "address": "Near Chandkheda Gam Bus Stop, Chandkheda, Ahmedabad - 382424",
            "package_size": "Medium",
            "status": "Pending",
            "created_at": "2023-05-24 09:30:15",
        },
        {
            "order_id": "10002",
            "name": "Aditya",
            "delivery_day": "Tuesday",
            "area": "Satellite",
            "address": "Near Jodhpur Cross Road, Satellite, Ahmedabad - 380015",
            "package_size": "Small",
            "status": "Pending",
            "created_at": "2023-05-24 10:15:30",
        },
    ]


@pytest.fixture
def mock_weather_data():
    """Create mock weather data"""
    return {
        "temperature": {"current": 31, "feels_like": 33, "units": "Celsius"},
        "conditions": "Sunny",
        "precipitation": {"chance": 10, "type": "None"},
        "humidity": 65,
        "wind": {"speed": 12, "direction": "NW", "units": "km/h"},
        "warnings": ["Heat advisory: Stay hydrated"],
    }


@pytest.fixture
def mock_traffic_data():
    """Create mock traffic data"""
    return {
        "Satellite": {
            "congestion_level": 7,
            "delay_minutes": 15,
            "status": "Heavy traffic",
            "peak_areas": ["Shrivranjani Junction", "Iscon Cross Roads"],
        },
        "Navrangpura": {
            "congestion_level": 8,
            "delay_minutes": 20,
            "status": "Congested due to office hours",
            "peak_areas": ["Law Garden", "Gujarat College"],
        },
        "overall_city_congestion": 6,
        "status": "Moderate congestion in several areas",
    }


@pytest.fixture
def mock_festival_data():
    """Create mock festival data"""
    return {
        "has_festival_today": True,
        "festivals": [
            {
                "name": "Food Festival",
                "date": "2023-05-25",
                "time": "16:00 - 22:00",
                "location": "Riverfront",
                "crowd_size": "Large",
                "traffic_impact": "Moderate",
                "affected_areas": ["Satellite", "Navrangpura"],
            }
        ],
    }


@pytest.fixture
def mock_chatbot(mock_predictor):
    """Create a mock chatbot"""
    chatbot = DeliveryChatbot(mock_predictor)
    chatbot.gemini_api.generate_content = MagicMock(
        return_value="This is a test response"
    )
    return chatbot


@pytest.fixture
def flask_app():
    """Create a test Flask app"""
    from app import app

    app.config["TESTING"] = True
    return app


@pytest.fixture
def client(flask_app):
    """Create a test client for the Flask app"""
    with flask_app.test_client() as client:
        yield client
