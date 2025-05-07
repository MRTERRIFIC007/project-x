#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Best Delivery Time Predictor

This module uses XGBoost to predict the optimal delivery times based on historical delivery data.
The model analyzes patterns in successful and failed deliveries to recommend the best time
for future deliveries.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import xgboost as xgb
import pickle
import os
from datetime import datetime

class DeliveryTimePredictor:
    """Class for predicting the best delivery times using XGBoost."""
    
    def __init__(self, data_path='dataset.csv'):
        """
        Initialize the DeliveryTimePredictor.
        
        Args:
            data_path (str): Path to the CSV dataset file.
        """
        self.data_path = data_path
        self.model = None
        self.encoders = {}
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
        self.feature_names = None
        
        # Create directory for models if it doesn't exist
        os.makedirs('delivery_time_models', exist_ok=True)
        
    def load_and_preprocess_data(self):
        """
        Load data from CSV and preprocess it for training.
        
        Returns:
            DataFrame: Preprocessed data
        """
        # Load data
        df = pd.read_csv(self.data_path)
        
        # Extract hour from time string
        df['Hour'] = df['Time'].apply(lambda x: int(x.split(' ')[0]))
        
        # Convert AM/PM to 24-hour format
        df['Hour'] = df.apply(
            lambda row: row['Hour'] if 'AM' in row['Time'] else 
                       (row['Hour'] + 12 if row['Hour'] < 12 else row['Hour']), 
            axis=1
        )
        
        # Encode categorical variables
        categorical_cols = ['Day of Delivery Attempt', 'Area', 'Package Size']
        
        for col in categorical_cols:
            le = LabelEncoder()
            df[col + '_encoded'] = le.fit_transform(df[col])
            self.encoders[col] = le
        
        # Create target variable (1 for Success, 0 for Fail)
        le_status = LabelEncoder()
        df['Delivery_Status_Encoded'] = le_status.fit_transform(df['Delivery Status'])
        self.encoders['Delivery Status'] = le_status
        
        return df
    
    def prepare_features(self, df):
        """
        Prepare feature set for model training.
        
        Args:
            df (DataFrame): Preprocessed dataframe
            
        Returns:
            tuple: X (features) and y (target)
        """
        # Select features
        features = [
            'Hour', 
            'Day of Delivery Attempt_encoded', 
            'Area_encoded',
            'Package Size_encoded'
        ]
        
        # Save feature names for later use
        self.feature_names = features
        
        # Prepare data
        X = df[features]
        y = df['Delivery_Status_Encoded']
        
        return X, y
    
    def split_data(self, X, y, test_size=0.2, random_state=42):
        """
        Split data into training and testing sets.
        
        Args:
            X (DataFrame): Features
            y (Series): Target variable
            test_size (float): Proportion of data to use for testing
            random_state (int): Random seed
            
        Returns:
            tuple: X_train, X_test, y_train, y_test
        """
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state
        )
        
        return self.X_train, self.X_test, self.y_train, self.y_test
    
    def train_model(self, params=None):
        """
        Train XGBoost model.
        
        Args:
            params (dict): XGBoost parameters
            
        Returns:
            XGBoost model: Trained model
        """
        if params is None:
            params = {
                'objective': 'binary:logistic',
                'max_depth': 6,
                'learning_rate': 0.1,
                'subsample': 0.8,
                'colsample_bytree': 0.8,
                'n_estimators': 100,
                'random_state': 42
            }
        
        # Create and train model
        model = xgb.XGBClassifier(**params)
        model.fit(
            self.X_train, 
            self.y_train,
            eval_set=[(self.X_test, self.y_test)],
            early_stopping_rounds=10,
            verbose=False
        )
        
        self.model = model
        return model
    
    def evaluate_model(self):
        """
        Evaluate model performance.
        
        Returns:
            dict: Evaluation metrics
        """
        y_pred = self.model.predict(self.X_test)
        accuracy = accuracy_score(self.y_test, y_pred)
        
        print(f"Model Accuracy: {accuracy:.4f}")
        print("\nClassification Report:")
        print(classification_report(self.y_test, y_pred))
        
        # Create confusion matrix
        cm = confusion_matrix(self.y_test, y_pred)
        
        # Plot confusion matrix
        plt.figure(figsize=(8, 6))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                    xticklabels=['Failed', 'Success'],
                    yticklabels=['Failed', 'Success'])
        plt.xlabel('Predicted')
        plt.ylabel('Actual')
        plt.title('Confusion Matrix')
        plt.savefig('delivery_time_models/confusion_matrix.png')
        
        # Feature importance
        plt.figure(figsize=(10, 6))
        xgb.plot_importance(self.model)
        plt.title('Feature Importance')
        plt.savefig('delivery_time_models/feature_importance.png')
        
        return {
            'accuracy': accuracy,
            'classification_report': classification_report(self.y_test, y_pred, output_dict=True)
        }
    
    def optimize_hyperparameters(self):
        """
        Perform grid search to find optimal hyperparameters.
        
        Returns:
            dict: Best parameters
        """
        param_grid = {
            'max_depth': [3, 5, 7],
            'learning_rate': [0.05, 0.1, 0.2],
            'n_estimators': [50, 100, 200],
            'subsample': [0.6, 0.8, 1.0],
            'colsample_bytree': [0.6, 0.8, 1.0]
        }
        
        grid_search = GridSearchCV(
            estimator=xgb.XGBClassifier(objective='binary:logistic', random_state=42),
            param_grid=param_grid,
            scoring='accuracy',
            cv=3,
            verbose=1
        )
        
        grid_search.fit(self.X_train, self.y_train)
        
        print(f"Best parameters: {grid_search.best_params_}")
        print(f"Best accuracy: {grid_search.best_score_:.4f}")
        
        # Train model with best parameters
        self.train_model(grid_search.best_params_)
        
        return grid_search.best_params_
    
    def save_model(self, filename=None):
        """
        Save trained model and encoders to file.
        
        Args:
            filename (str): Filename to save model
            
        Returns:
            str: Path to saved model
        """
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"delivery_time_models/xgboost_model_{timestamp}.pkl"
        
        # Save model and encoders
        with open(filename, 'wb') as f:
            pickle.dump({
                'model': self.model,
                'encoders': self.encoders,
                'feature_names': self.feature_names
            }, f)
        
        print(f"Model saved to {filename}")
        return filename
    
    def load_model(self, filename):
        """
        Load trained model from file.
        
        Args:
            filename (str): Path to saved model
            
        Returns:
            XGBoost model: Loaded model
        """
        with open(filename, 'rb') as f:
            data = pickle.load(f)
        
        self.model = data['model']
        self.encoders = data['encoders']
        self.feature_names = data['feature_names']
        
        return self.model
    
    def predict_best_delivery_time(self, day, area, package_size):
        """
        Predict the best time for delivery.
        
        Args:
            day (str): Day of the week
            area (str): Delivery area
            package_size (str): Package size
            
        Returns:
            dict: Recommended delivery times with success probabilities
        """
        if self.model is None:
            raise ValueError("Model not trained or loaded. Please train or load a model first.")
        
        # Encode inputs
        day_encoded = self.encoders['Day of Delivery Attempt'].transform([day])[0]
        area_encoded = self.encoders['Area'].transform([area])[0]
        package_size_encoded = self.encoders['Package Size'].transform([package_size])[0]
        
        # Check all possible hours and get success probability
        results = []
        for hour in range(8, 24):  # Consider delivery hours from 8 AM to 11 PM
            features = np.array([[hour, day_encoded, area_encoded, package_size_encoded]])
            
            # Get success probability
            probability = self.model.predict_proba(features)[0][1]
            
            # Format hour for display
            if hour < 12:
                formatted_time = f"{hour} AM"
            elif hour == 12:
                formatted_time = "12 PM"
            else:
                formatted_time = f"{hour-12} PM"
                
            results.append({
                'time': formatted_time,
                'hour': hour,
                'success_probability': probability
            })
        
        # Sort results by success probability
        results.sort(key=lambda x: x['success_probability'], reverse=True)
        
        return results
    
    def run_full_pipeline(self, optimize=True):
        """
        Run the full model training pipeline.
        
        Args:
            optimize (bool): Whether to optimize hyperparameters
            
        Returns:
            dict: Model evaluation metrics
        """
        print("Loading and preprocessing data...")
        df = self.load_and_preprocess_data()
        
        print("Preparing features...")
        X, y = self.prepare_features(df)
        
        print("Splitting data...")
        self.split_data(X, y)
        
        if optimize:
            print("Optimizing hyperparameters...")
            best_params = self.optimize_hyperparameters()
            print(f"Best parameters: {best_params}")
        else:
            print("Training model with default parameters...")
            self.train_model()
        
        print("Evaluating model...")
        metrics = self.evaluate_model()
        
        print("Saving model...")
        self.save_model()
        
        return metrics


def analyze_delivery_patterns(data_path='dataset.csv'):
    """
    Analyze delivery patterns and generate insights.
    
    Args:
        data_path (str): Path to the CSV dataset file
        
    Returns:
        dict: Delivery pattern insights
    """
    # Load data
    df = pd.read_csv(data_path)
    
    # Extract hour from time string
    df['Hour'] = df['Time'].apply(lambda x: int(x.split(' ')[0]))
    
    # Convert AM/PM to 24-hour format
    df['Hour'] = df.apply(
        lambda row: row['Hour'] if 'AM' in row['Time'] else 
                   (row['Hour'] + 12 if row['Hour'] < 12 else row['Hour']), 
        axis=1
    )
    
    # Create output directory for plots
    os.makedirs('delivery_analysis', exist_ok=True)
    
    # Calculate success rate by hour
    success_by_hour = df.groupby('Hour')['Delivery Status'].apply(
        lambda x: (x == 'Success').mean()
    ).reset_index()
    success_by_hour.columns = ['Hour', 'Success Rate']
    
    # Calculate success rate by day
    success_by_day = df.groupby('Day of Delivery Attempt')['Delivery Status'].apply(
        lambda x: (x == 'Success').mean()
    ).reset_index()
    success_by_day.columns = ['Day', 'Success Rate']
    
    # Calculate success rate by area
    success_by_area = df.groupby('Area')['Delivery Status'].apply(
        lambda x: (x == 'Success').mean()
    ).reset_index()
    success_by_area.columns = ['Area', 'Success Rate']
    
    # Calculate success rate by package size
    success_by_size = df.groupby('Package Size')['Delivery Status'].apply(
        lambda x: (x == 'Success').mean()
    ).reset_index()
    success_by_size.columns = ['Package Size', 'Success Rate']
    
    # Plot success rate by hour
    plt.figure(figsize=(12, 6))
    sns.barplot(x='Hour', y='Success Rate', data=success_by_hour)
    plt.title('Delivery Success Rate by Hour')
    plt.xlabel('Hour of Day (24-hour format)')
    plt.ylabel('Success Rate')
    plt.xticks(range(len(success_by_hour)), 
              [f"{h}:00" for h in success_by_hour['Hour']])
    plt.savefig('delivery_analysis/success_by_hour.png')
    
    # Plot success rate by day
    plt.figure(figsize=(12, 6))
    sns.barplot(x='Day', y='Success Rate', data=success_by_day)
    plt.title('Delivery Success Rate by Day of Week')
    plt.xlabel('Day of Week')
    plt.ylabel('Success Rate')
    plt.savefig('delivery_analysis/success_by_day.png')
    
    # Plot success rate by area
    plt.figure(figsize=(14, 6))
    sns.barplot(x='Area', y='Success Rate', data=success_by_area)
    plt.title('Delivery Success Rate by Area')
    plt.xlabel('Area')
    plt.ylabel('Success Rate')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('delivery_analysis/success_by_area.png')
    
    # Plot success rate by package size
    plt.figure(figsize=(10, 6))
    sns.barplot(x='Package Size', y='Success Rate', data=success_by_size)
    plt.title('Delivery Success Rate by Package Size')
    plt.xlabel('Package Size')
    plt.ylabel('Success Rate')
    plt.savefig('delivery_analysis/success_by_size.png')
    
    # Return insights
    return {
        'success_by_hour': success_by_hour.to_dict('records'),
        'success_by_day': success_by_day.to_dict('records'),
        'success_by_area': success_by_area.to_dict('records'),
        'success_by_size': success_by_size.to_dict('records')
    }


if __name__ == "__main__":
    # Analyze delivery patterns
    print("Analyzing delivery patterns...")
    analyze_delivery_patterns()
    
    # Train model
    print("\nTraining delivery time prediction model...")
    predictor = DeliveryTimePredictor()
    predictor.run_full_pipeline(optimize=True)
    
    # Example of making predictions
    print("\nPrediction example:")
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    areas = ["Navrangpura", "Satellite", "Bodakdev", "Vastrapur", "Thaltej"]
    sizes = ["Small", "Medium", "Large"]
    
    for day in days:
        for area in areas[:2]:  # Just use the first two areas for the example
            for size in sizes:
                predictions = predictor.predict_best_delivery_time(day, area, size)
                best_time = predictions[0]
                print(f"Best delivery time for {size} package to {area} on {day}: "
                      f"{best_time['time']} (Success probability: {best_time['success_probability']:.2f})") 