import pytest
from unittest.mock import patch, MagicMock
import json
import os
from gemini_api import GeminiAPI


class TestGeminiAPI:
    """Test class for GeminiAPI"""

    def test_init_with_api_key(self):
        """Test initialization with API key"""
        # Mock genai
        with patch("gemini_api.genai") as mock_genai:
            # Create API with key
            api = GeminiAPI("test_api_key")

            # Verify initialization
            assert api.api_key == "test_api_key"
            assert api.is_configured is True
            mock_genai.configure.assert_called_once_with(api_key="test_api_key")

    def test_init_without_api_key(self):
        """Test initialization without API key"""
        # Mock genai and os.environ.get
        with patch("gemini_api.genai") as mock_genai:
            with patch("os.environ.get", return_value=None):
                # Create API without key
                api = GeminiAPI()

                # Verify initialization
                assert api.api_key is None
                assert api.is_configured is False
                mock_genai.configure.assert_not_called()

    def test_init_with_env_api_key(self):
        """Test initialization with API key from environment"""
        # Mock genai and os.environ.get
        with patch("gemini_api.genai") as mock_genai:
            with patch("os.environ.get", return_value="env_api_key"):
                # Create API without explicit key
                api = GeminiAPI()

                # Verify initialization
                assert api.api_key == "env_api_key"
                assert api.is_configured is True
                mock_genai.configure.assert_called_once_with(api_key="env_api_key")

    def test_init_no_genai_package(self):
        """Test initialization when genai package is not available"""
        # Mock genai to be None
        with patch("gemini_api.genai", None):
            # Create API
            api = GeminiAPI("test_api_key")

            # Verify initialization
            assert api.is_configured is False

    def test_generate_content(self):
        """Test content generation"""
        # Mock response
        mock_response = MagicMock()
        mock_response.text = "Generated content"

        # Mock chat object
        mock_chat = MagicMock()
        mock_chat.send_message.return_value = mock_response

        # Mock model
        mock_model = MagicMock()
        mock_model.start_chat.return_value = mock_chat

        # Mock genai module
        with patch("gemini_api.genai") as mock_genai:
            mock_genai.GenerativeModel.return_value = mock_model

            # Create API
            api = GeminiAPI("test_api_key")

            # Generate content
            content = api.generate_content(
                "Test prompt", system_content="System prompt"
            )

            # Verify content
            assert content == "Generated content"

            # Verify correct model was used
            mock_genai.GenerativeModel.assert_called_once()
            assert "gemini-1.5-flash" in mock_genai.GenerativeModel.call_args[0]

    def test_generate_content_with_chat_history(self):
        """Test content generation with chat history"""
        # Create test chat history
        chat_history = [
            {"role": "user", "content": "Hello"},
            {"role": "assistant", "content": "Hi there"},
        ]

        # Mock response
        mock_response = MagicMock()
        mock_response.text = "Generated content with history"

        # Mock chat object
        mock_chat = MagicMock()
        mock_chat.send_message.return_value = mock_response

        # Mock model
        mock_model = MagicMock()
        mock_model.start_chat.return_value = mock_chat

        # Mock genai module
        with patch("gemini_api.genai") as mock_genai:
            mock_genai.GenerativeModel.return_value = mock_model

            # Create API
            api = GeminiAPI("test_api_key")

            # Generate content with history
            content = api.generate_content("Test prompt", chat_history=chat_history)

            # Verify content
            assert content == "Generated content with history"

            # Verify history was used
            mock_model.start_chat.assert_called_once()
            # Check that history was passed to start_chat
            history_arg = mock_model.start_chat.call_args[1]["history"]
            assert len(history_arg) == 2
            assert history_arg[0]["role"] == "user"
            assert history_arg[1]["role"] == "model"

    def test_generate_content_not_configured(self):
        """Test content generation when API is not configured"""
        # Create API without configuration
        api = GeminiAPI()
        api.is_configured = False

        # Generate content
        content = api.generate_content("Test prompt")

        # Verify no content is returned
        assert content is None

    def test_generate_content_exception(self):
        """Test content generation with exception"""
        # Mock genai to raise an exception
        with patch("gemini_api.genai") as mock_genai:
            mock_genai.GenerativeModel.side_effect = Exception("Test exception")

            # Create API
            api = GeminiAPI("test_api_key")

            # Generate content
            content = api.generate_content("Test prompt")

            # Verify no content is returned on exception
            assert content is None

    def test_get_real_time_data(self):
        """Test getting real-time data"""
        # Mock response with JSON data
        mock_response = MagicMock()
        mock_response.text = '{"weather": "sunny", "temperature": 30}'

        # Mock chat object
        mock_chat = MagicMock()
        mock_chat.send_message.return_value = mock_response

        # Mock model
        mock_model = MagicMock()
        mock_model.start_chat.return_value = mock_chat

        # Mock genai module
        with patch("gemini_api.genai") as mock_genai:
            mock_genai.GenerativeModel.return_value = mock_model

            # Create API
            api = GeminiAPI("test_api_key")

            # Get real-time data
            data = api.get_real_time_data("weather", "Get current weather in Ahmedabad")

            # Verify data
            assert data == {"weather": "sunny", "temperature": 30}

    def test_get_real_time_data_json_in_code_block(self):
        """Test getting real-time data with JSON in code block"""
        # Mock response with JSON in code block
        mock_response = MagicMock()
        mock_response.text = '```json\n{"weather": "sunny", "temperature": 30}\n```'

        # Mock chat object
        mock_chat = MagicMock()
        mock_chat.send_message.return_value = mock_response

        # Mock model
        mock_model = MagicMock()
        mock_model.start_chat.return_value = mock_chat

        # Mock genai module
        with patch("gemini_api.genai") as mock_genai:
            mock_genai.GenerativeModel.return_value = mock_model

            # Create API
            api = GeminiAPI("test_api_key")

            # Get real-time data
            data = api.get_real_time_data("weather", "Get current weather in Ahmedabad")

            # Verify data
            assert data == {"weather": "sunny", "temperature": 30}

    def test_get_real_time_data_parse_error(self):
        """Test getting real-time data with parsing error"""
        # Mock response with invalid JSON
        mock_response = MagicMock()
        mock_response.text = "This is not JSON"

        # Mock chat object
        mock_chat = MagicMock()
        mock_chat.send_message.return_value = mock_response

        # Mock model
        mock_model = MagicMock()
        mock_model.start_chat.return_value = mock_chat

        # Mock genai module
        with patch("gemini_api.genai") as mock_genai:
            mock_genai.GenerativeModel.return_value = mock_model

            # Create API
            api = GeminiAPI("test_api_key")

            # Get real-time data
            data = api.get_real_time_data("weather", "Get current weather in Ahmedabad")

            # Verify error data - check if data is not None first
            assert data is not None
            assert "error" in data
            assert "raw_content" in data
            assert data["raw_content"] == "This is not JSON"

    def test_get_real_time_data_exception(self):
        """Test getting real-time data with exception"""
        # Mock genai to raise an exception
        with patch("gemini_api.genai") as mock_genai:
            mock_genai.GenerativeModel.side_effect = Exception("Test exception")

            # Create API
            api = GeminiAPI("test_api_key")

            # Get real-time data
            data = api.get_real_time_data("weather", "Get current weather in Ahmedabad")

            # Verify error data - check if data is not None first
            assert data is not None
            assert "error" in data
            assert "Test exception" in data["error"]
