#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Delivery Time Predictor Demo

This script demonstrates how to use the DeliveryTimePredictor class to predict
optimal delivery times based on historical delivery data.
"""

import argparse
import pandas as pd
import json
from best_delivery_time_predictor import DeliveryTimePredictor, analyze_delivery_patterns

def format_time_predictions(predictions, top_n=3):
    """Format the top N predictions for display."""
    result = []
    for i, pred in enumerate(predictions[:top_n], 1):
        result.append(f"{i}. {pred['time']} (Success probability: {pred['success_probability']:.2f})")
    return result

def main():
    parser = argparse.ArgumentParser(description='Predict best delivery times')
    parser.add_argument('--train', action='store_true', help='Train a new model')
    parser.add_argument('--optimize', action='store_true', help='Optimize hyperparameters during training')
    parser.add_argument('--analyze', action='store_true', help='Analyze delivery patterns')
    parser.add_argument('--predict', action='store_true', help='Make predictions')
    parser.add_argument('--day', type=str, help='Day of the week for prediction')
    parser.add_argument('--area', type=str, help='Delivery area for prediction')
    parser.add_argument('--size', type=str, help='Package size for prediction')
    parser.add_argument('--model', type=str, help='Path to saved model file')
    parser.add_argument('--output', type=str, help='Output file for predictions (JSON format)')
    
    args = parser.parse_args()
    
    # Create predictor instance
    predictor = DeliveryTimePredictor()
    
    # Train new model if requested
    if args.train:
        print("Training new delivery time prediction model...")
        predictor.run_full_pipeline(optimize=args.optimize)
    
    # Analyze delivery patterns if requested
    if args.analyze:
        print("Analyzing delivery patterns...")
        insights = analyze_delivery_patterns()
        print("\nSuccess rate by hour:")
        for item in insights['success_by_hour']:
            print(f"Hour: {item['Hour']:2d}:00 - Success rate: {item['Success Rate']:.2f}")
        
        print("\nSuccess rate by day:")
        for item in insights['success_by_day']:
            print(f"Day: {item['Day']:10s} - Success rate: {item['Success Rate']:.2f}")
    
    # Load existing model if provided
    if args.model:
        print(f"Loading model from {args.model}...")
        predictor.load_model(args.model)
    
    # Make predictions if requested
    if args.predict:
        # If no specific parameters provided, show examples for all combinations
        if not (args.day and args.area and args.size):
            print("\nShowing prediction examples for various combinations:")
            
            days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            areas = ["Navrangpura", "Satellite", "Bodakdev", "Vastrapur", "Thaltej"]
            sizes = ["Small", "Medium", "Large"]
            
            results = {}
            
            for day in days:
                day_results = {}
                for area in areas[:2]:  # Just use the first two areas for the example
                    area_results = {}
                    for size in sizes:
                        predictions = predictor.predict_best_delivery_time(day, area, size)
                        top_times = format_time_predictions(predictions)
                        area_results[size] = top_times
                    day_results[area] = area_results
                results[day] = day_results
            
            # Display results
            for day, day_data in results.items():
                print(f"\n=== {day} ===")
                for area, area_data in day_data.items():
                    print(f"\n{area}:")
                    for size, predictions in area_data.items():
                        print(f"  {size} package:")
                        for pred in predictions:
                            print(f"    {pred}")
            
            # Save to JSON if output file specified
            if args.output:
                with open(args.output, 'w') as f:
                    json.dump(results, f, indent=2)
                print(f"\nResults saved to {args.output}")
                
        else:
            # Make prediction with specific parameters
            print(f"\nPredicting best delivery time for {args.size} package to {args.area} on {args.day}...")
            predictions = predictor.predict_best_delivery_time(args.day, args.area, args.size)
            
            print("\nTop recommended delivery times:")
            for i, pred in enumerate(predictions[:5], 1):
                print(f"{i}. {pred['time']} (Success probability: {pred['success_probability']:.2f})")

if __name__ == "__main__":
    main() 