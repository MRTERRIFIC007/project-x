import os
import json
import logging
from datetime import datetime
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Try to import the generativeai library, with a helpful error message if not installed
try:
    from google import generativeai as genai
except ImportError:
    logging.error(
        "google-generativeai package not installed. Please install it using: pip install google-generativeai"
    )
    genai = None


class GeminiAPI:
    """
    Wrapper class for interacting with Google's Gemini API
    """

    def __init__(self, api_key=None):
        """
        Initialize the Gemini API with the provided API key.

        Args:
            api_key (str, optional): The Gemini API key. If not provided,
                                     it will be fetched from environment variables.
        """
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY")

        # Check if we can use the Gemini API
        if not genai:
            logging.error(
                "Cannot initialize Gemini API: google-generativeai package not available"
            )
            self.is_configured = False
        elif not self.api_key:
            logging.warning("No Gemini API key provided. Will use mock responses.")
            self.is_configured = False
        else:
            # Configure the Gemini API with the key
            genai.configure(api_key=self.api_key)
            self.is_configured = True

    def generate_content(
        self,
        prompt,
        system_content=None,
        chat_history=None,
        temperature=0.2,
        max_tokens=500,
        top_p=0.9,
    ):
        """
        Generate content using Gemini API.

        Args:
            prompt (str): The prompt to send to the model
            system_content (str, optional): System prompt content
            chat_history (list, optional): List of previous messages
            temperature (float): Controls randomness (0.0-1.0)
            max_tokens (int): Maximum number of tokens to generate
            top_p (float): Controls diversity of output

        Returns:
            str: Generated content or error message
        """
        if not self.is_configured or not genai:
            return None

        try:
            # Setup generation config using the proper GenerationConfig class
            generation_config = genai.GenerationConfig(
                temperature=temperature,
                top_p=top_p,
                max_output_tokens=max_tokens,
            )

            # Initialize the model (using gemini-1.5-flash as default model)
            model = genai.GenerativeModel(
                "gemini-1.5-flash", generation_config=generation_config
            )

            # Prepare the chat history
            history = []
            if chat_history:
                for message in chat_history:
                    role = message.get("role", "user")
                    content = message.get("content", "")
                    if role == "user":
                        history.append({"role": "user", "parts": [content]})
                    elif role == "assistant":
                        history.append({"role": "model", "parts": [content]})

            # Start a chat session
            chat = model.start_chat(history=history)

            # If system content is provided, use it
            if system_content:
                system_message = {"role": "system", "parts": [system_content]}
                # Note: In Gemini API system messages are handled differently
                # This functionality might need adjustment based on Gemini's specific API

            # Generate content with the model
            response = chat.send_message(prompt)

            return response.text

        except Exception as e:
            logging.error(f"Error generating content with Gemini API: {str(e)}")
            return None

    def get_real_time_data(self, data_type, prompt, system_content=None):
        """
        Fetch real-time data formatted as JSON.

        Args:
            data_type (str): Type of data ('traffic', 'weather', or 'festivals')
            prompt (str): The specific prompt to get the data
            system_content (str, optional): System prompt content

        Returns:
            dict: JSON structured response or error dictionary
        """
        if not self.is_configured or not genai:
            return None

        try:
            # Use a lower temperature for more factual outputs
            generation_config = genai.GenerationConfig(
                temperature=0.1,
                top_p=0.9,
                max_output_tokens=1024,
            )

            # Initialize the model
            model = genai.GenerativeModel(
                "gemini-1.5-flash", generation_config=generation_config
            )

            # Prepare system instruction to get structured JSON
            json_system_content = (
                system_content
                or "You are an AI assistant providing factual, real-time information in JSON format. Return the data in a structured JSON format without any explanatory text."
            )

            # Start a chat with the system instruction
            chat = model.start_chat(
                history=[
                    {"role": "user", "parts": [json_system_content]},
                    {
                        "role": "model",
                        "parts": [
                            "I'll provide structured JSON data without explanatory text."
                        ],
                    },
                ]
            )

            # Send the specific prompt to get real-time data
            response = chat.send_message(
                f"{prompt} Return the data in a structured JSON format without any explanatory text."
            )

            # Try to parse JSON from the response
            try:
                # First, try to parse the entire content as JSON
                data = json.loads(response.text)
                return data
            except json.JSONDecodeError:
                # If direct parsing fails, try to extract JSON from code blocks
                content = response.text
                if "```json" in content and "```" in content.split("```json", 1)[1]:
                    json_str = content.split("```json", 1)[1].split("```", 1)[0]
                    data = json.loads(json_str)
                    return data
                elif "```" in content and "```" in content.split("```", 1)[1]:
                    json_str = content.split("```", 1)[1].split("```", 1)[0]
                    data = json.loads(json_str)
                    return data
                else:
                    # If all parsing attempts fail
                    return {
                        "error": "Failed to parse JSON from the response",
                        "raw_content": content,
                    }

        except Exception as e:
            logging.error(f"Error getting real-time data with Gemini API: {str(e)}")
            return {"error": f"API error: {str(e)}"}
