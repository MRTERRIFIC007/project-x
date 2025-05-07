# Delivery Time Predictor

An XGBoost-based machine learning model to predict optimal delivery times based on historical delivery data. This tool analyzes patterns in successful and failed deliveries to recommend the best times for future deliveries, helping to improve delivery success rates.

## Features

- **Data Analysis**: Analyze delivery patterns by time, day, area, and package size
- **Prediction Model**: Train an XGBoost model to predict delivery success probability
- **Hyperparameter Optimization**: Fine-tune the model for optimal performance
- **Visualization**: Generate visualizations of delivery success patterns
- **Command-line Interface**: Easy-to-use CLI for training, analyzing, and making predictions

## Directory Structure

```
.
├── best_delivery_time_predictor.py     # Main implementation of prediction model
├── delivery_time_predictor_demo.py     # Demo script for using the predictor
├── delivery_predictor_requirements.txt # Dependencies required to run the model
├── dataset.csv                         # Historical delivery data
├── delivery_time_models/               # Directory to store trained models
└── delivery_analysis/                  # Directory to store analysis visualizations
```

## Requirements

All required Python libraries are listed in the `delivery_predictor_requirements.txt` file. You can install them with:

```bash
pip install -r delivery_predictor_requirements.txt
```

## Usage

### Analyzing Delivery Patterns

To analyze patterns in the historical delivery data:

```bash
python delivery_time_predictor_demo.py --analyze
```

This will generate visualizations of delivery success rates by hour, day, area, and package size in the `delivery_analysis/` directory.

### Training a Model

To train a new prediction model:

```bash
python delivery_time_predictor_demo.py --train
```

For optimized performance with hyperparameter tuning:

```bash
python delivery_time_predictor_demo.py --train --optimize
```

The trained model will be saved in the `delivery_time_models/` directory.

### Making Predictions

To make predictions for specific delivery parameters:

```bash
python delivery_time_predictor_demo.py --predict --day Monday --area Satellite --size Medium
```

To generate predictions for a range of combinations:

```bash
python delivery_time_predictor_demo.py --predict
```

To save predictions to a JSON file:

```bash
python delivery_time_predictor_demo.py --predict --output predictions.json
```

To use a specific saved model for predictions:

```bash
python delivery_time_predictor_demo.py --predict --model delivery_time_models/xgboost_model_20240101_120000.pkl
```

## Model Details

The XGBoost model uses the following features to predict delivery success:

- Time of day (hour)
- Day of the week
- Delivery area
- Package size

The model outputs a probability of delivery success for each possible delivery time, allowing you to choose the optimal time for your specific delivery parameters.

## Implementation

The core implementation is in `best_delivery_time_predictor.py`, which provides:

- `DeliveryTimePredictor` class for training and using the model
- `analyze_delivery_patterns` function for data analysis

For more details, refer to the docstrings in the code.

## Example Output

When running predictions, you'll get output similar to this:

```
Predicting best delivery time for Medium package to Satellite on Monday...

Top recommended delivery times:
1. 10 AM (Success probability: 0.95)
2. 2 PM (Success probability: 0.92)
3. 4 PM (Success probability: 0.89)
4. 11 AM (Success probability: 0.87)
5. 3 PM (Success probability: 0.85)
```

This indicates that 10 AM has the highest predicted success rate (95%) for delivering a Medium package to Satellite on Monday.
