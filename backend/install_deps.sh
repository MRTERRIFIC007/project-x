#!/bin/bash

# Install dependencies using pip
pip install -r requirements.txt

# Display success message
echo "Dependencies installed successfully!"
echo "Make sure to set your GEMINI_API_KEY environment variable before running the application."
echo "You can do this by adding the following to your .env file or exporting directly:"
echo "GEMINI_API_KEY=your_api_key_here" 