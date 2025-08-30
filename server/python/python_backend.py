#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Hydrogen Infrastructure Optimization - Python Backend Service
High-performance optimization engine for Node.js Express integration
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import traceback
from datetime import datetime

# Import your optimization system
from optimized_hydrogen_system import FastAPIInterface

app = Flask(__name__)
CORS(app)

# Initialize the optimization system
optimize_api = FastAPIInterface()

def validate_coordinates(lat, lng):
    """Validate latitude and longitude values"""
    if not isinstance(lat, (int, float)) or not isinstance(lng, (int, float)):
        return False, "Coordinates must be numbers"
    
    if lat < -90 or lat > 90:
        return False, f"Latitude must be between -90 and 90, got {lat}"
    
    if lng < -180 or lng > 180:
        return False, f"Longitude must be between -180 and 180, got {lng}"
    
    return True, None

def validate_plant(plant):
    """Validate a single plant object"""
    # Check required fields
    if 'id' not in plant:
        return False, "Plant must have an 'id' field"
    
    if 'capacity' not in plant:
        return False, "Plant must have a 'capacity' field"
    
    if 'location' not in plant:
        return False, "Plant must have a 'location' field"
    
    # Validate capacity
    if not isinstance(plant['capacity'], (int, float)):
        return False, "Plant capacity must be a number"
    
    if plant['capacity'] <= 0:
        return False, f"Plant capacity must be positive, got {plant['capacity']}"
    
    # Validate location
    location = plant['location']
    if isinstance(location, dict):
        if 'lat' not in location or 'lng' not in location:
            return False, "Location must have 'lat' and 'lng' fields"
        
        valid, error = validate_coordinates(location['lat'], location['lng'])
        if not valid:
            return False, f"Invalid location: {error}"
    
    elif isinstance(location, list):
        if len(location) < 2:
            return False, "Location array must have at least 2 elements [lng, lat]"
        
        valid, error = validate_coordinates(location[1], location[0])  # [lng, lat] format
        if not valid:
            return False, f"Invalid location: {error}"
    
    else:
        return False, "Location must be either a dict with lat/lng or array [lng, lat]"
    
    return True, None

def validate_storage(storage):
    """Validate a single storage facility object"""
    # Check required fields
    if 'id' not in storage:
        return False, "Storage must have an 'id' field"
    
    if 'capacity' not in storage:
        return False, "Storage must have a 'capacity' field"
    
    if 'location' not in storage:
        return False, "Storage must have a 'location' field"
    
    # Validate capacity
    if not isinstance(storage['capacity'], (int, float)):
        return False, "Storage capacity must be a number"
    
    if storage['capacity'] <= 0:
        return False, f"Storage capacity must be positive, got {storage['capacity']}"
    
    # Validate location (same as plant)
    location = storage['location']
    if isinstance(location, dict):
        if 'lat' not in location or 'lng' not in location:
            return False, "Location must have 'lat' and 'lng' fields"
        
        valid, error = validate_coordinates(location['lat'], location['lng'])
        if not valid:
            return False, f"Invalid location: {error}"
    
    elif isinstance(location, list):
        if len(location) < 2:
            return False, "Location array must have at least 2 elements [lng, lat]"
        
        valid, error = validate_coordinates(location[1], location[0])  # [lng, lat] format
        if not valid:
            return False, f"Invalid location: {error}"
    
    else:
        return False, "Location must be either a dict with lat/lng or array [lng, lat]"
    
    return True, None

def validate_optimization_data(data):
    """Validate the complete optimization request data"""
    errors = []
    
    # Check if data has required structure
    if not isinstance(data, dict):
        return False, ["Data must be a JSON object"]
    
    # Validate plants
    if 'plants' in data:
        if not isinstance(data['plants'], list):
            errors.append("'plants' must be an array")
        elif len(data['plants']) == 0:
            errors.append("'plants' array cannot be empty")
        else:
            for i, plant in enumerate(data['plants']):
                valid, error = validate_plant(plant)
                if not valid:
                    errors.append(f"Plant {i}: {error}")
    
    # Validate storages
    if 'storages' in data:
        if not isinstance(data['storages'], list):
            errors.append("'storages' must be an array")
        else:
            for i, storage in enumerate(data['storages']):
                valid, error = validate_storage(storage)
                if not valid:
                    errors.append(f"Storage {i}: {error}")
    
    # Validate demands
    if 'demands' in data:
        if not isinstance(data['demands'], list):
            errors.append("'demands' must be an array")
        else:
            for i, demand in enumerate(data['demands']):
                if 'location' not in demand:
                    errors.append(f"Demand {i}: must have a 'location' field")
                elif isinstance(demand['location'], dict):
                    if 'lat' not in demand['location'] or 'lng' not in demand['location']:
                        errors.append(f"Demand {i}: location must have 'lat' and 'lng' fields")
                    else:
                        valid, error = validate_coordinates(demand['location']['lat'], demand['location']['lng'])
                        if not valid:
                            errors.append(f"Demand {i}: {error}")
    
    # Check if we have at least some data to work with
    has_plants = 'plants' in data and isinstance(data['plants'], list) and len(data['plants']) > 0
    has_storages = 'storages' in data and isinstance(data['storages'], list) and len(data['storages']) > 0
    has_demands = 'demands' in data and isinstance(data['demands'], list) and len(data['demands']) > 0
    
    if not (has_plants or has_storages or has_demands):
        errors.append("Request must contain at least one non-empty array of plants, storages, or demands")
    
    return len(errors) == 0, errors

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'hydrogen-optimization-engine',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/optimize', methods=['POST'])
def optimize_infrastructure():
    """Main optimization endpoint for Node.js backend"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                'error': 'No data provided',
                'success': False
            }), 400

        # Validate the input data
        is_valid, validation_errors = validate_optimization_data(data)
        if not is_valid:
            return jsonify({
                'error': 'Validation failed',
                'details': validation_errors,
                'success': False
            }), 400

        # Convert the data format for the optimization system
        optimization_data = convert_to_optimization_format(data)

        # Initialize optimization
        init_result = optimize_api.initialize_system(optimization_data)
        
        if not init_result.get('success', False):
            return jsonify({
                'error': 'Failed to initialize optimization system',
                'details': init_result.get('error', 'Unknown error'),
                'success': False
            }), 500

        # Get recommendations
        recommendations = {
            'plants': optimize_api.get_plant_recommendations(),
            'storages': optimize_api.get_storage_recommendations(),
        }
        
        # Add pipeline recommendations if we have both plants and storages
        if optimization_data.get('plants') and optimization_data.get('storage_facilities'):
            plant_loc = optimization_data['plants'][0]['location']
            storage_loc = optimization_data['storage_facilities'][0]['location']
            recommendations['pipelines'] = optimize_api.get_pipeline_recommendations(
                plant_loc, storage_loc
            )

        return jsonify({
            'success': True,
            'data': recommendations,
            'metadata': {
                'timestamp': datetime.now().isoformat(),
                'validation': 'passed',
                'init_stats': init_result.get('stats', {})
            }
        })

    except Exception as e:
        print("Error in optimization: {}".format(str(e)))
        traceback.print_exc()

        return jsonify({
            'error': str(e),
            'success': False,
            'timestamp': datetime.now().isoformat()
        }), 500

def convert_to_optimization_format(data):
    """Convert request data to the format expected by the optimization system"""
    result = {
        'plants': [],
        'storage_facilities': [],
        'pipelines': []
    }
    
    # Convert plants
    if 'plants' in data:
        for plant in data['plants']:
            location = plant['location']
            if isinstance(location, dict):
                # Convert {lat, lng} to [lng, lat, alt]
                converted_location = [location['lng'], location['lat'], location.get('alt', 0)]
            else:
                # Assume it's already [lng, lat] or [lng, lat, alt]
                converted_location = location[:] if len(location) >= 2 else [0, 0, 0]
                if len(converted_location) == 2:
                    converted_location.append(0)  # Add altitude
            
            result['plants'].append({
                'id': plant['id'],
                'location': converted_location,
                'capacity': plant['capacity']
            })
    
    # Convert storages
    if 'storages' in data:
        for storage in data['storages']:
            location = storage['location']
            if isinstance(location, dict):
                converted_location = [location['lng'], location['lat'], location.get('alt', 0)]
            else:
                converted_location = location[:] if len(location) >= 2 else [0, 0, 0]
                if len(converted_location) == 2:
                    converted_location.append(0)
            
            result['storage_facilities'].append({
                'id': storage['id'],
                'location': converted_location,
                'capacity': storage['capacity']
            })
    
    return result

@app.route('/validate', methods=['POST'])
def validate_infrastructure():
    """Validate infrastructure configuration"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                'error': 'No data provided',
                'success': False
            }), 400

        validation_result = {
            'success': True,
            'message': 'Infrastructure validation not yet implemented',
            'data': data
        }

        return jsonify({
            'success': True,
            'data': validation_result,
            'timestamp': datetime.now().isoformat()
        })

    except Exception as e:
        print("Error in validation: {}".format(str(e)))
        traceback.print_exc()

        return jsonify({
            'error': str(e),
            'success': False,
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/status', methods=['GET'])
def get_status():
    """Status endpoint for Node.js backend - provides system status and logs"""
    import requests
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'error': 'No data provided',
                'success': False
            }), 400

        # Accept full project/asset data from Node.js
        project_id = data.get('project_id')
        user_id = data.get('user_id')
        # The full asset data should be in 'assets' or similar structure
        asset_data = data.get('assets', {})
        # Optionally, allow legacy params for backward compatibility
        legacy_params = {k: data.get(k) for k in ['longitude', 'latitude', 'demand_mw', 'budget_millions'] if k in data}

        # Initialize optimize with full asset/project data if present
        if asset_data:
            init_result = optimize_api.initialize_system(asset_data)
        else:
            init_result = optimize_api.initialize_system(legacy_params)

        # Run optimization (example: get plant/storage/pipeline recommendations)
        recommendations = {
            'plants': optimize_api.get_plant_recommendations(),
            'storages': optimize_api.get_storage_recommendations(),
            'pipelines': optimize_api.get_pipeline_recommendations([-75.0, 40.0, 10], [-74.5, 40.5, 8])
        }

        # Log results to Node.js backend (MongoDB) via /api/optimization-logs
        log_payload = {
            'user': user_id,
            'project': project_id,
            'input': asset_data if asset_data else legacy_params,
            'output': recommendations,
            'status': 'success',
            'error': None
        }
        try:
            # You may need to set the correct URL and authentication if required
            log_url = data.get('log_url', 'http://localhost:3000/api/optimization-logs')
            requests.post(log_url, json=log_payload, timeout=3)
        except Exception as log_err:
            print(f"Warning: Could not log optimization result to Node.js backend: {log_err}")

        return jsonify({
            'success': True,
            'data': recommendations,
            'metadata': {
                'processing_time_ms': 0,
                'timestamp': datetime.now().isoformat(),
                'parameters': asset_data if asset_data else legacy_params
            }
        })
    except Exception as e:
        print("Error in optimization: {}".format(str(e)))
        traceback.print_exc()
        return jsonify({
            'error': str(e),
            'success': False,
            'timestamp': datetime.now().isoformat()
        }), 500

if __name__ == '__main__':
    try:
        print("Starting Hydrogen Optimization Python Backend")
        print("Optimized for Node.js Express integration")
        print("Python Engine: Ready for high-performance computations")
        print("API Server: http://localhost:5000")
        print("CORS enabled for cross-origin requests")
        print("-" * 50)
        
        app.run(
            host='0.0.0.0',
            port=5000,
            debug=False,
            threaded=True
        )
    except UnicodeEncodeError:
        print("Encountered encoding issue, retrying with basic output...")
        app.run(
            host='0.0.0.0',
            port=5000,
            debug=False,
            threaded=True
        )
