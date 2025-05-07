import pytest
from unittest.mock import patch, MagicMock
import json
from chatbot_assistant import DeliveryChatbot


class TestDeliveryChatbot:
    """Test class for DeliveryChatbot"""

    def test_init(self, mock_predictor):
        """Test initialization of DeliveryChatbot"""
        # Create chatbot with API key
        chatbot = DeliveryChatbot(mock_predictor, "test_api_key")

        # Verify initialization
        assert chatbot.predictor == mock_predictor
        assert chatbot.gemini_api is not None
        assert chatbot.gemini_api.api_key == "test_api_key"
        assert chatbot.chat_history == []

        # Create chatbot without API key
        with patch("os.environ.get", return_value=None):
            chatbot_no_key = DeliveryChatbot(mock_predictor)
            assert not chatbot_no_key.gemini_api.is_configured

    def test_process_query_with_api(self, mock_chatbot):
        """Test processing a query with Gemini API"""
        # Setup mock response
        test_response = "Here's your delivery information"
        mock_chatbot.gemini_api.generate_content = MagicMock(return_value=test_response)

        # Process a query
        response = mock_chatbot.process_query("When should I deliver to Aditya?")

        # Verify response and chat history
        assert response == test_response
        assert (
            len(mock_chatbot.chat_history) == 2
        )  # User message and assistant response
        assert mock_chatbot.chat_history[0]["role"] == "user"
        assert mock_chatbot.chat_history[1]["role"] == "assistant"

    def test_process_query_fallback(self, mock_chatbot):
        """Test fallback to mock response when API fails"""
        # Setup mock response to fail
        mock_chatbot.gemini_api.generate_content = MagicMock(
            side_effect=Exception("API Error")
        )

        # Mock the fallback method
        with patch.object(
            mock_chatbot, "_generate_mock_response", return_value="Fallback response"
        ):
            # Process a query
            response = mock_chatbot.process_query("When should I deliver to Aditya?")

            # Verify fallback was used
            assert response == "Fallback response"

    def test_build_system_context(self, mock_chatbot, mock_predictor):
        """Test building the system context for the chatbot"""
        # Patch predictor methods to return test data
        with patch.object(mock_predictor, "get_todays_orders", return_value=[]):
            with patch.object(mock_predictor, "predict_optimal_times", return_value=[]):
                # Build context with empty current_context
                context = mock_chatbot._build_system_context()

                # Verify context structure
                assert isinstance(context, str)
                assert "You are a helpful assistant" in context
                assert "Today is" in context

    def test_build_system_context_with_route(self, mock_chatbot, mock_predictor):
        """Test building system context with route information"""
        # Create test route data
        test_route = {
            "route": ["Start", "Customer1", "Customer2"],
            "total_distance": "10 km",
            "total_duration": "30 mins",
            "weather_conditions": "Sunny",
            "traffic_summary": "Light traffic",
            "festival_impact": "No festivals",
        }

        # Patch predictor methods to return test data
        with patch.object(mock_predictor, "get_todays_orders", return_value=[]):
            with patch.object(mock_predictor, "predict_optimal_times", return_value=[]):
                # Build context with route information
                context = mock_chatbot._build_system_context(
                    {"optimized_route": test_route}
                )

                # Verify route info is included
                assert "Optimized route:" in context
                assert "10 km" in context
                assert "30 mins" in context

    def test_generate_mock_response(self, mock_chatbot):
        """Test generation of mock responses"""
        # Define test queries and expected responses
        test_cases = [
            ("optimal time for Aditya", "best time"),
            ("traffic in Satellite", "traffic"),
            ("weather today", "weather"),
            ("festival", "event"),
            ("route", "route"),
            ("random query", "I don't have enough information"),
        ]

        # Test each query
        for query, expected_substring in test_cases:
            response = mock_chatbot._generate_mock_response(query, "System context")
            assert isinstance(response, str)
            assert response  # Not empty

    def test_chat_history_management(self, mock_chatbot):
        """Test chat history management"""
        # Setup mock response
        mock_chatbot.gemini_api.generate_content = MagicMock(
            return_value="Test response"
        )

        # Process multiple queries
        for i in range(12):  # More than the 10 history limit
            mock_chatbot.process_query(f"Query {i}")

        # Verify history is capped at 10 exchanges
        assert (
            len(mock_chatbot.chat_history) <= 20
        )  # 10 user messages + 10 assistant responses
