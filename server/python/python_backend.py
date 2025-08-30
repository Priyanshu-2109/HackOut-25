#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Hydrogen Infrastructure Optimization - Python Backend Service
High-performance optimization engine for Node.js Express integration
"""

from pickletools import optimize
from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import traceback
from datetime import datetime

app = Flask(__name__)
CORS(app)

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

        # Extract parameters
        longitude = data.get('longitude', 0.0)
        latitude = data.get('latitude', 0.0)
        demand_mw = data.get('demand_mw', 100.0)
        budget_millions = data.get('budget_millions', 500.0)

        # Initialize optimization
        optimize.initialize_system(
            longitude=longitude,
            latitude=latitude,
            demand_mw=demand_mw,
            budget_millions=budget_millions
        )

        # Get recommendations
        recommendations = optimize.get_recommendations()

        return jsonify({
            'success': True,
            'data': recommendations,
            'metadata': {
                'processing_time_ms': recommendations.get('processing_time_ms', 0),
                'timestamp': datetime.now().isoformat(),
                'parameters': {
                    'longitude': longitude,
                    'latitude': latitude,
                    'demand_mw': demand_mw,
                    'budget_millions': budget_millions
                }
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

        validation_result = optimize.validate_infrastructure(data)

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
            init_result = optimize.initialize_system(asset_data)
        else:
            init_result = optimize.initialize_system(legacy_params)

        # Run optimization (example: get plant/storage/pipeline recommendations)
        recommendations = {
            'plants': optimize.get_plant_recommendations(),
            'storages': optimize.get_storage_recommendations(),
            'pipelines': optimize.get_pipeline_recommendations([-75.0, 40.0, 10], [-74.5, 40.5, 8])
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
