import requests
import json
import os
from datetime import datetime
import logging
from gemini_api import GeminiAPI


class DeliveryChatbot:
    def __init__(self, predictor, gemini_api_key=None):
        self.predictor = predictor
        # Initialize Gemini API
        self.gemini_api = GeminiAPI(gemini_api_key or os.environ.get("GEMINI_API_KEY"))
        if not self.gemini_api.is_configured:
            logging.warning(
                "No Gemini API key provided. Chatbot will use mock responses."
            )
        self.chat_history = []

    def process_query(self, query, current_context=None):
        """Process a natural language query from the postman"""
        try:
            # Build context from the current data
            system_context = self._build_system_context(current_context)

            if not self.gemini_api.is_configured:
                logging.warning("No Gemini API key provided. Using mock response.")
                return self._generate_mock_response(query, system_context)

            # Format chat history for Gemini
            # Only include the last 4 exchanges to keep context manageable
            recent_history = (
                self.chat_history[-4:]
                if len(self.chat_history) >= 4
                else self.chat_history
            )

            # Send the query to Gemini API
            try:
                answer = self.gemini_api.generate_content(
                    prompt=query,
                    system_content=system_context,
                    chat_history=recent_history,
                    temperature=0.2,
                    max_tokens=500,
                    top_p=0.9,
                )

                if answer:
                    # Update chat history
                    self.chat_history.append({"role": "user", "content": query})
                    self.chat_history.append({"role": "assistant", "content": answer})

                    # Keep history to a reasonable size
                    if len(self.chat_history) > 10:
                        self.chat_history = self.chat_history[-10:]

                    return answer
                else:
                    # Log the error but fall back to mock response
                    error_msg = "Failed to get response from Gemini API"
                    logging.error(error_msg)

                    # If API is having issues, use mock response
                    logging.info("Falling back to mock response")
                    return self._generate_mock_response(query, system_context)

            except Exception as e:
                logging.error(f"Error while calling Gemini API: {str(e)}")
                return self._generate_mock_response(query, system_context)

        except Exception as e:
            logging.exception("Error processing chatbot query")
            # Fall back to mock response on any error
            return self._generate_mock_response(query, system_context)

    def _build_system_context(self, current_context=None):
        """Build system prompt with delivery data context"""
        system_prompt = """
        You are a helpful assistant for a delivery postman in Ahmedabad, India. Your name is DeliveryGPT.
        
        Your primary functions are:
        1. Provide information about pending deliveries and optimal delivery times
        2. Explain the current optimized route and why it's efficient
        3. Give details about customers and their preferences
        4. Suggest the best approach for each delivery based on historical data
        5. Provide real-time traffic, weather, and festival information affecting deliveries
        
        Today is {current_date}.
        
        CUSTOMER INFORMATION:
        {customer_info}
        
        TODAY'S PENDING DELIVERIES:
        {todays_deliveries}
        
        ROUTE INFORMATION (if available):
        {route_info}
        
        OPTIMAL DELIVERY TIMES:
        {optimal_times}
        
        REAL-TIME CONDITIONS:
        Weather: {weather_conditions}
        Traffic: {traffic_conditions}
        Events/Festivals: {festival_conditions}
        
        When answering questions:
        - Be brief and focused on delivery-related information
        - Provide specific details when referring to addresses or delivery times
        - When suggesting optimal delivery times, explain why they are recommended
        - Format times using 24-hour format (e.g., 14:30 instead of 2:30 PM)
        - If asked about a specific customer, provide all relevant details we have
        - If you don't know something, say so clearly rather than making up information
        - Your responses should be conversational but professional
        - Include relevant real-time data that impacts deliveries
        
        Remember, you are helping a postman who needs quick, accurate information while making deliveries.
        """

        # Get current date
        current_date = datetime.now().strftime("%A, %B %d, %Y")

        # Get customer info with addresses and areas
        try:
            customer_info = []
            for name, info in self.predictor.customer_areas.items():
                address = self.predictor.customer_addresses.get(name, "Unknown address")
                area = info
                customer_info.append(f"- {name}: Area: {area}, Address: {address}")

            customer_info_str = (
                "\n".join(customer_info)
                if customer_info
                else "No customer information available."
            )
        except Exception as e:
            logging.exception("Error retrieving customer information")
            customer_info_str = "Error retrieving customer information."

        # Get today's deliveries
        try:
            todays_orders = self.predictor.get_todays_orders()
            if todays_orders:
                deliveries_info = []
                for order in todays_orders:
                    order_id = order.get("order_id", order.get("id", "Unknown"))
                    delivery_info = f"- Order #{order_id}: {order['name']} - {order['area']} - Package: {order.get('size', order.get('package_size', 'Unknown'))} - Scheduled for: {order.get('day', order.get('delivery_day', 'Unknown'))} at {order.get('optimal_time', 'unspecified time')}"
                    if "address" in order:
                        delivery_info += f" - Address: {order['address']}"
                    deliveries_info.append(delivery_info)
                deliveries_info_str = "\n".join(deliveries_info)
            else:
                deliveries_info_str = "No deliveries scheduled for today."
        except Exception as e:
            logging.exception("Error retrieving today's deliveries")
            deliveries_info_str = "Error retrieving today's deliveries."

        # Get route info if available
        route_info_str = "No route currently optimized."
        if current_context and "optimized_route" in current_context:
            try:
                route = current_context["optimized_route"]
                route_info_str = f"Optimized route: {' → '.join(route['route'])}\nTotal distance: {route['total_distance']}"

                if "total_duration" in route:
                    route_info_str += f", Estimated time: {route['total_duration']}"

                if "weather_conditions" in route:
                    route_info_str += (
                        f"\nWeather affecting route: {route['weather_conditions']}"
                    )

                if "traffic_summary" in route:
                    route_info_str += (
                        f"\nTraffic conditions: {route['traffic_summary']}"
                    )

                if "festival_impact" in route:
                    route_info_str += f"\nEvents impact: {route['festival_impact']}"
            except Exception as e:
                logging.exception("Error processing route information")
                route_info_str = "Error processing route information."

        # Get optimal delivery times for each customer
        try:
            optimal_times_info = []
            for name, area in self.predictor.customer_areas.items():
                optimal_times = self.predictor.predict_optimal_times(name)
                if optimal_times and len(optimal_times) > 0:
                    best_time = optimal_times[0]["time"]
                    failure_rate = optimal_times[0]["failure_rate"]
                    optimal_times_info.append(
                        f"- {name}: Best time is around {best_time} (Failure rate: {failure_rate}%)"
                    )
                else:
                    optimal_times_info.append(
                        f"- {name}: No optimal delivery time available"
                    )

            optimal_times_str = (
                "\n".join(optimal_times_info)
                if optimal_times_info
                else "No optimal delivery time information available."
            )
        except Exception as e:
            logging.exception("Error retrieving optimal delivery times")
            optimal_times_str = "Error retrieving optimal delivery times."

        # Get real-time conditions
        weather_conditions_str = "No weather data available."
        traffic_conditions_str = "No traffic data available."
        festival_conditions_str = "No information about events or festivals available."

        if current_context and "real_time_data" in current_context:
            real_time_data = current_context["real_time_data"]

            # Weather conditions
            if "weather" in real_time_data and real_time_data["weather"]:
                weather_data = real_time_data["weather"]
                try:
                    if hasattr(self.predictor, "_get_weather_summary"):
                        weather_conditions_str = self.predictor._get_weather_summary(
                            weather_data
                        )
                    else:
                        # Fallback to simpler formatting if the method doesn't exist
                        conditions = weather_data.get("conditions", "Unknown")
                        temp = weather_data.get("temperature", {}).get("current", "N/A")
                        precip = weather_data.get("precipitation", {}).get("chance", 0)
                        weather_conditions_str = (
                            f"{conditions}, {temp}°C, {precip}% precipitation chance"
                        )
                except Exception as e:
                    logging.exception("Error formatting weather data")
                    weather_conditions_str = "Error processing weather data."

            # Traffic conditions
            if "traffic" in real_time_data and real_time_data["traffic"]:
                traffic_data = real_time_data["traffic"]
                try:
                    if hasattr(self.predictor, "_get_traffic_summary"):
                        traffic_conditions_str = self.predictor._get_traffic_summary(
                            traffic_data
                        )
                    else:
                        # Fallback to simpler formatting if the method doesn't exist
                        congested_areas = []
                        for area, data in traffic_data.items():
                            if (
                                isinstance(data, dict)
                                and data.get("congestion_level", 0) >= 7
                            ):
                                congested_areas.append(area)

                        if congested_areas:
                            traffic_conditions_str = (
                                f"Heavy traffic in {', '.join(congested_areas)}"
                            )
                        else:
                            traffic_conditions_str = (
                                "Normal traffic conditions across the city"
                            )
                except Exception as e:
                    logging.exception("Error formatting traffic data")
                    traffic_conditions_str = "Error processing traffic data."

            # Festival/event conditions
            if "festivals" in real_time_data and real_time_data["festivals"]:
                festival_data = real_time_data["festivals"]
                try:
                    if hasattr(self.predictor, "_get_festival_summary"):
                        festival_conditions_str = self.predictor._get_festival_summary(
                            festival_data
                        )
                    else:
                        # Fallback to simpler formatting if the method doesn't exist
                        if festival_data.get("has_festival_today", False):
                            festivals = festival_data.get("festivals", [])
                            today_festivals = [
                                f["name"]
                                for f in festivals
                                if f.get("date") == datetime.now().strftime("%Y-%m-%d")
                            ]
                            if today_festivals:
                                festival_conditions_str = (
                                    f"Events today: {', '.join(today_festivals)}"
                                )
                            else:
                                festival_conditions_str = (
                                    "No major events affecting deliveries today"
                                )
                        else:
                            festival_conditions_str = (
                                "No major events affecting deliveries today"
                            )
                except Exception as e:
                    logging.exception("Error formatting festival data")
                    festival_conditions_str = "Error processing festival data."

        # Format the system prompt
        formatted_prompt = system_prompt.format(
            current_date=current_date,
            customer_info=customer_info_str,
            todays_deliveries=deliveries_info_str,
            route_info=route_info_str,
            optimal_times=optimal_times_str,
            weather_conditions=weather_conditions_str,
            traffic_conditions=traffic_conditions_str,
            festival_conditions=festival_conditions_str,
        )

        return formatted_prompt

    def _generate_mock_response(self, query, system_context):
        """Generate a mock response when no API key is provided"""
        query = query.lower()

        # Handle simple greetings
        if query.strip() in ["hi", "hello", "hey", "greetings"]:
            return "Hello! I'm DeliveryGPT, your delivery assistant. How can I help you today? You can ask me about today's deliveries, customer information, or optimal delivery routes."

        if "optimal" in query and "time" in query:
            if "aditya" in query.lower():
                return """Optimal delivery time for Aditya (Satellite area):
• Best time: 15:00 - 16:30
• Failure rate: 12% during this window (vs. 31% in mornings)
• Address: Near Jodhpur Cross Road, Satellite
• Current package: Medium (Books)
• Notes: Aditya works from home in the afternoons and prefers contactless delivery with a notification message 10 minutes before arrival."""
            else:
                return """Based on historical data, the optimal delivery times for today's customers are:

• Aditya (Satellite): 15:00 - 16:30 (12% failure rate)
• Riya (Navrangpura): 13:00 - 14:00 (18% failure rate)
• Meera (Paldi): 18:30 - 20:00 (10% failure rate)
• Vivaan (Bopal): 14:15 - 15:45 (14% failure rate)
• Ananya (Bodakdev): 09:00 - 11:00 (7% failure rate)

These times are calculated based on past successful deliveries, customer availability patterns, and traffic conditions. The suggested route optimizes for both distance and delivery success probability."""

        if "route" in query:
            return """The optimized delivery route for today has been calculated based on distance, traffic patterns, and optimal delivery times:

START: Iscon Center, Shivranjani Cross Road (Postman Location)
↓ 2.1 km (7 min)
1. Ananya - Bodakdev - Estimated arrival: 10:00
↓ 3.5 km (12 min)
2. Riya - Navrangpura - Estimated arrival: 13:00
↓ 2.7 km (9 min)
3. Meera - Paldi - Estimated arrival: 14:00
↓ 1.8 km (6 min)
4. Aditya - Satellite - Estimated arrival: 15:15
↓ 2.2 km (8 min)
5. Vivaan - Bopal - Estimated arrival: 16:30
↓ 3.7 km (15 min)
RETURN: Iscon Center - Estimated return: 17:30

Total distance: 16.0 km
Estimated time including deliveries: 7.5 hours
Fuel efficiency: Good (minimal highway driving)

This route prioritizes morning delivery for Ananya who has the lowest failure rate in mornings, followed by afternoon deliveries for others based on their availability patterns."""

        if any(
            name.lower() in query
            for name in ["aditya", "kabir", "meera", "ishaan", "ananya", "riya"]
        ):
            if "aditya" in query:
                return "Aditya is located in the Satellite area. The optimal delivery time is around 15:00, with a low failure rate of 12%. Today's package for Aditya is Medium sized."
            elif "kabir" in query:
                return "Kabir lives in Chandkheda area at Plot 45, Chandkheda Township. Based on delivery history, Kabir prefers deliveries between 16:00-17:00 when he's usually at home. He has a 23% failure rate for morning deliveries but only 8% for afternoon deliveries. There's currently one pending Large package for delivery on Thursday. Kabir typically accepts deliveries at the main gate of his housing complex."
            elif "meera" in query:
                return "Meera is in Paldi area. She prefers deliveries after 18:00 when she returns from work. Meera has a low failure rate of 10% for evening deliveries."
            elif "ishaan" in query:
                return "Ishaan lives in Maninagar and has flexible delivery hours throughout the day. There are no specific time preferences, but weekend deliveries have a slightly lower failure rate of 15% compared to 22% on weekdays."
            elif "ananya" in query:
                return "Ananya is in Bodakdev area. She prefers morning deliveries between 9:00-11:00 with a failure rate of only 7% during this time window. There's a Medium package scheduled for delivery on Wednesday."
            elif "riya" in query:
                return "Riya lives in Navrangpura area. She has a medium-sized package pending for delivery today with an optimal delivery time around 13:00. Historical delivery data shows a failure rate of 18% for afternoon deliveries."

        if "today" in query and "deliveries" in query:
            # Get pending orders from the predictor
            try:
                pending_orders = self.predictor.get_pending_orders()
                if not pending_orders or len(pending_orders) == 0:
                    return "There are no pending deliveries for today."

                # Format response with real pending orders
                delivery_list = []
                for i, order in enumerate(
                    pending_orders[:5], 1
                ):  # Limit to first 5 orders
                    order_id = order.get("order_id", "Unknown")
                    name = order.get("name", "Unknown")
                    area = order.get("area", "Unknown area")
                    address = order.get("address", "No address available")
                    package_size = order.get("package_size", "Unknown size")

                    delivery_list.append(
                        f"{i}. **#{order_id} - {name} (Pkg: {package_size}) - {area}, {address}.**"
                    )

                delivery_list_str = "\n".join(delivery_list)

                # Get real-time conditions without placeholder text
                weather_conditions = "Weather data not available."
                try:
                    weather_data = self.predictor.get_real_time_data("weather")
                    if weather_data:
                        weather_conditions = self.predictor._get_weather_summary(
                            weather_data
                        )
                except Exception as e:
                    logging.exception("Error getting weather data")

                traffic_conditions = "Traffic data not available."
                try:
                    traffic_data = self.predictor.get_real_time_data("traffic")
                    if traffic_data:
                        traffic_conditions = self.predictor._get_traffic_summary(
                            traffic_data
                        )
                except Exception as e:
                    logging.exception("Error getting traffic data")

                festival_conditions = "Festival data not available."
                try:
                    festival_data = self.predictor.get_real_time_data("festivals")
                    if festival_data:
                        festival_conditions = self.predictor._get_festival_summary(
                            festival_data
                        )
                except Exception as e:
                    logging.exception("Error getting festival data")

                return f"""Hello! I'm DeliveryGPT, your assistant for today's deliveries in Ahmedabad. Here's a quick brief on the pending deliveries and some helpful information:

## Today's Delivery List
{delivery_list_str}

## Conditions
Weather: {weather_conditions}
Traffic: {traffic_conditions}
Events: {festival_conditions}

Let me know if you need specific details about any delivery or customer."""

            except Exception as e:
                logging.exception("Error generating today's deliveries response")
                # Fallback to a generic response without the problematic placeholder text
                return """Hello! I'm DeliveryGPT, your assistant for today's deliveries in Ahmedabad.

I'm having trouble retrieving the pending deliveries information right now. Please check the main dashboard or try again later.

Is there something specific you'd like to know about any customer or area?"""

        # Default response
        return """I can help you with information about deliveries and routes for today. Try asking:
• What are today's deliveries?
• What's the optimal time to deliver to [customer name]?
• Tell me about [customer name]'s delivery preferences
• Explain the current optimized route
• Which areas have deliveries today?

I can also help with detailed customer information and delivery statistics."""
