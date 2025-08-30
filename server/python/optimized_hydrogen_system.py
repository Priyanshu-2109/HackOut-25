"""
Optimized Hydrogen Infrastructure System
High-performance version with minimal overhead and fast algorithms
"""

import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
import json
from concurrent.futures import ThreadPoolExecutor
import math

@dataclass
class Location:
    """Lightweight location class"""
    lng: float
    lat: float
    alt: float = 0.0
    
    def distance_to(self, other: 'Location') -> float:
        """Fast haversine distance calculation"""
        R = 6371000  # Earth radius in meters
        lat1, lng1 = math.radians(self.lat), math.radians(self.lng)
        lat2, lng2 = math.radians(other.lat), math.radians(other.lng)
        
        dlat = lat2 - lat1
        dlng = lng2 - lng1
        
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng/2)**2
        return R * 2 * math.asin(math.sqrt(a))

@dataclass
class Asset:
    """Lightweight asset class"""
    id: str
    location: Location
    capacity: float
    asset_type: str

@dataclass
class Recommendation:
    """Optimization result"""
    location: Location
    score: float
    reasons: List[str]

class OptimizedHydrogenSystem:
    """High-performance hydrogen infrastructure optimizer"""
    
    def __init__(self):
        self.plants: List[Asset] = []
        self.storages: List[Asset] = []
        self.pipelines: List[Asset] = []
        self.regulatory_zones: List[Dict] = []
        self.cost_model: Dict[str, float] = {}
        self._initialized = False

    def ingest_assets_from_file(self, filepath: str, filetype: str = 'geojson') -> bool:
        """Ingest asset data from GeoJSON or CSV file using GeoPandas or Pandas."""
        try:
            import geopandas as gpd
            import pandas as pd
            if filetype == 'geojson':
                gdf = gpd.read_file(filepath)
                # Assume columns: id, type, capacity, geometry
                for _, row in gdf.iterrows():
                    coords = list(row.geometry.coords)[0] if row.geometry.geom_type == 'Point' else row.geometry.centroid.coords[0]
                    asset = Asset(str(row.get('id', '')), Location(coords[0], coords[1]), row.get('capacity', 100), row.get('type', 'unknown'))
                    if asset.asset_type == 'plant':
                        self.plants.append(asset)
                    elif asset.asset_type == 'storage':
                        self.storages.append(asset)
                    elif asset.asset_type == 'pipeline':
                        self.pipelines.append(asset)
            elif filetype == 'csv':
                df = pd.read_csv(filepath)
                for _, row in df.iterrows():
                    asset = Asset(str(row.get('id', '')), Location(row['lng'], row['lat']), row.get('capacity', 100), row.get('type', 'unknown'))
                    if asset.asset_type == 'plant':
                        self.plants.append(asset)
                    elif asset.asset_type == 'storage':
                        self.storages.append(asset)
                    elif asset.asset_type == 'pipeline':
                        self.pipelines.append(asset)
            return True
        except Exception as e:
            print(f"Ingestion error: {e}")
            return False

    def ingest_assets_from_db(self, db_conn, table: str = 'assets') -> bool:
        """Ingest asset data from a database connection (expects SQLAlchemy or psycopg2 conn)."""
        try:
            import pandas as pd
            df = pd.read_sql(f'SELECT * FROM {table}', db_conn)
            for _, row in df.iterrows():
                asset = Asset(str(row.get('id', '')), Location(row['lng'], row['lat']), row.get('capacity', 100), row.get('type', 'unknown'))
                if asset.asset_type == 'plant':
                    self.plants.append(asset)
                elif asset.asset_type == 'storage':
                    self.storages.append(asset)
                elif asset.asset_type == 'pipeline':
                    self.pipelines.append(asset)
            return True
        except Exception as e:
            print(f"DB ingestion error: {e}")
            return False
    
    def __init__(self):
        self.plants: List[Asset] = []
        self.storages: List[Asset] = []
        self.pipelines: List[Asset] = []
        self.regulatory_zones: List[Dict] = []
        self.cost_model: Dict[str, float] = {}
        self._initialized = False
    
    def initialize(self, data: Dict[str, Any]) -> bool:
        """Initialization from user data, including regulatory zones and cost model"""
        try:
            self.plants.clear()
            self.storages.clear()
            self.pipelines.clear()
            self.regulatory_zones = data.get('regulatory_zones', [])
            self.cost_model = data.get('cost_model', {})
            # Fast plant creation
            for p in data.get('plants', []):
                loc = Location(p['location'][0], p['location'][1], p['location'][2] if len(p['location']) > 2 else 0)
                self.plants.append(Asset(p.get('id', f"p_{len(self.plants)}"), loc, p.get('capacity', 100), 'plant'))
            for s in data.get('storage_facilities', []):
                loc = Location(s['location'][0], s['location'][1], s['location'][2] if len(s['location']) > 2 else 0)
                self.storages.append(Asset(s.get('id', f"s_{len(self.storages)}"), loc, s.get('capacity', 1000), 'storage'))
            for pipe in data.get('pipelines', []):
                if pipe['path']:
                    start = pipe['path'][0]
                    loc = Location(start[0], start[1], start[2] if len(start) > 2 else 0)
                    self.pipelines.append(Asset(pipe.get('id', f"pipe_{len(self.pipelines)}"), loc, pipe.get('capacity', 50), 'pipeline'))
            self._initialized = True
            return True
        except Exception:
            return False
    
    def _fast_candidate_generation(self, center: Location, radius_km: float = 50, count: int = 20) -> List[Location]:
        """Ultra-fast candidate generation using vectorized operations"""
        # Generate candidates in a circle around center
        angles = np.linspace(0, 2*np.pi, count)
        distances = np.random.uniform(1, radius_km, count) * 1000  # Convert to meters
        
        # Approximate coordinate offsets (fast but less accurate for large distances)
        lat_offset = distances * np.cos(angles) / 111320  # meters to degrees lat
        lng_offset = distances * np.sin(angles) / (111320 * np.cos(np.radians(center.lat)))
        
        candidates = []
        for i in range(count):
            candidates.append(Location(
                center.lng + lng_offset[i],
                center.lat + lat_offset[i],
                center.alt
            ))
        
        return candidates
    
    def _fast_scoring(self, candidate: Location, weights: Dict[str, float], constraints: Dict[str, Any] = None) -> Tuple[float, List[str], Dict[str, Any]]:
        """Scoring with regulatory, cost, and custom constraint support. Returns richer metadata."""
        score = 100.0
        reasons = []
        meta = {}
        constraints = constraints or {}
        # Distance to nearest plant (if storages exist)
        if self.plants and weights.get('distance_weight', 0.3) > 0:
            min_dist = min(candidate.distance_to(p.location) for p in self.plants)
            meta['min_dist_to_plant'] = min_dist
            if min_dist > 100000:
                score -= 30
                reasons.append("Far from plants")
            elif min_dist < 5000:
                score += 20
                reasons.append("Close to plants")
        # Regulatory zone penalty/bonus
        in_reg_zone = False
        for zone in self.regulatory_zones:
            # Assume zone is a dict with 'polygon' (list of [lng,lat]) and 'penalty' or 'bonus'
            from shapely.geometry import Point, Polygon
            poly = Polygon(zone.get('polygon', []))
            pt = Point(candidate.lng, candidate.lat)
            if poly.contains(pt):
                in_reg_zone = True
                if 'penalty' in zone:
                    score -= zone['penalty']
                    reasons.append(f"Regulatory penalty: {zone['penalty']}")
                if 'bonus' in zone:
                    score += zone['bonus']
                    reasons.append(f"Regulatory bonus: {zone['bonus']}")
        meta['in_regulatory_zone'] = in_reg_zone
        # Cost model
        cost = self.cost_model.get('base_cost', 100)
        cost += self.cost_model.get('distance_cost', 0.01) * meta.get('min_dist_to_plant', 0)
        meta['cost_estimate'] = cost
        if 'max_cost' in constraints and cost > constraints['max_cost']:
            score -= 50
            reasons.append("Cost exceeds max_cost constraint")
        # Custom constraints
        if 'min_capacity' in constraints and constraints['min_capacity'] > 0:
            if getattr(candidate, 'capacity', 100) < constraints['min_capacity']:
                score -= 20
                reasons.append("Below min_capacity constraint")
        # Basic safety check (simulated)
        safety_score = 85 + np.random.uniform(-10, 15)
        score = score * (safety_score / 100)
        meta['safety_score'] = safety_score
        if safety_score < 70:
            reasons.append("Safety concerns")
        elif safety_score > 90:
            reasons.append("Excellent safety")
        # Capacity bonus
        if len(self.plants) < 3:
            score += 10
            reasons.append("Network expansion benefit")
        meta['final_score'] = max(0, score)
        return max(0, score), reasons, meta
    
    def optimize_plant_location(self, constraints: Dict[str, Any] = None, 
                              weights: Dict[str, float] = None, 
                              num_recommendations: int = 5) -> List[Dict]:
        """Plant location optimization with regulatory/cost/constraint support and rich metadata"""
        if not self._initialized or not self.storages:
            return []
        constraints = constraints or {}
        weights = weights or {'distance_weight': 0.4, 'safety_weight': 0.6}
        all_candidates = []
        for storage in self.storages[:3]:
            candidates = self._fast_candidate_generation(storage.location, 30, 10)
            all_candidates.extend(candidates)
        recommendations = []
        for candidate in all_candidates[:30]:
            score, reasons, meta = self._fast_scoring(candidate, weights, constraints)
            recommendations.append({
                'location': [candidate.lng, candidate.lat, candidate.alt],
                'score': score,
                'reasons': reasons,
                'metadata': meta
            })
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return recommendations[:num_recommendations]
    
    def optimize_storage_location(self, constraints: Dict[str, Any] = None,
                                weights: Dict[str, float] = None,
                                num_recommendations: int = 5) -> List[Dict]:
        """Storage location optimization with regulatory/cost/constraint support and rich metadata"""
        if not self._initialized or not self.plants:
            return []
        constraints = constraints or {}
        weights = weights or {'distance_weight': 0.5, 'safety_weight': 0.5}
        all_candidates = []
        for plant in self.plants[:3]:
            candidates = self._fast_candidate_generation(plant.location, 25, 8)
            all_candidates.extend(candidates)
        recommendations = []
        for candidate in all_candidates[:24]:
            score, reasons, meta = self._fast_scoring(candidate, weights, constraints)
            recommendations.append({
                'location': [candidate.lng, candidate.lat, candidate.alt],
                'score': score,
                'reasons': reasons,
                'metadata': meta
            })
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return recommendations[:num_recommendations]
    
    def optimize_pipeline_route(self, start_location: List[float], end_location: List[float],
                              constraints: Dict[str, Any] = None,
                              weights: Dict[str, float] = None,
                              num_recommendations: int = 3) -> List[Dict]:
        """Pipeline route optimization with regulatory/cost/constraint support and rich metadata"""
        from shapely.geometry import LineString, Point, Polygon
        start = Location(start_location[0], start_location[1], start_location[2] if len(start_location) > 2 else 0)
        end = Location(end_location[0], end_location[1], end_location[2] if len(end_location) > 2 else 0)
        routes = []
        direct_distance = start.distance_to(end)
        direct_score = max(10, 100 - (direct_distance / 1000))
        meta = {'distance_km': direct_distance / 1000}
        # Regulatory zone intersection
        line = LineString([(start.lng, start.lat), (end.lng, end.lat)])
        reg_penalty = 0
        reg_zones_crossed = 0
        for zone in self.regulatory_zones:
            poly = Polygon(zone.get('polygon', []))
            if line.intersects(poly):
                reg_zones_crossed += 1
                if 'penalty' in zone:
                    reg_penalty += zone['penalty']
        meta['reg_zones_crossed'] = reg_zones_crossed
        meta['reg_penalty'] = reg_penalty
        total_score = direct_score - reg_penalty
        # Cost model
        cost = self.cost_model.get('base_cost', 100) + self.cost_model.get('distance_cost', 0.01) * direct_distance
        meta['cost_estimate'] = cost
        if constraints and 'max_cost' in constraints and cost > constraints['max_cost']:
            total_score -= 50
        routes.append({
            'route_id': 'direct',
            'path': [[start.lng, start.lat, start.alt], [end.lng, end.lat, end.alt]],
            'total_score': total_score,
            'metadata': meta,
            'reasoning': ['Direct route', 'Minimal infrastructure']
        })
        # Add one alternative route with waypoint
        if num_recommendations > 1:
            mid_lat = (start.lat + end.lat) / 2 + 0.01
            mid_lng = (start.lng + end.lng) / 2 + 0.01
            waypoint_line = LineString([(start.lng, start.lat), (mid_lng, mid_lat), (end.lng, end.lat)])
            reg_penalty_wp = 0
            reg_zones_crossed_wp = 0
            for zone in self.regulatory_zones:
                poly = Polygon(zone.get('polygon', []))
                if waypoint_line.intersects(poly):
                    reg_zones_crossed_wp += 1
                    if 'penalty' in zone:
                        reg_penalty_wp += zone['penalty']
            meta_wp = {
                'distance_km': meta['distance_km'] * 1.1,
                'reg_zones_crossed': reg_zones_crossed_wp,
                'reg_penalty': reg_penalty_wp,
                'cost_estimate': cost * 1.1
            }
            total_score_wp = direct_score - 10 - reg_penalty_wp
            if constraints and 'max_cost' in constraints and meta_wp['cost_estimate'] > constraints['max_cost']:
                total_score_wp -= 50
            routes.append({
                'route_id': 'waypoint',
                'path': [[start.lng, start.lat, start.alt], [mid_lng, mid_lat, 0], [end.lng, end.lat, end.alt]],
                'total_score': total_score_wp,
                'metadata': meta_wp,
                'reasoning': ['Alternative path', 'Avoids potential obstacles']
            })
        return routes[:num_recommendations]

class FastAPIInterface:
    """Lightweight API interface for the optimized system"""
    
    def __init__(self):
        self.system = OptimizedHydrogenSystem()
    
    def initialize_system(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Fast system initialization"""
        success = self.system.initialize(data)
        
        if success:
            return {
                'success': True,
                'message': 'System initialized successfully',
                'stats': {
                    'plants': len(self.system.plants),
                    'storages': len(self.system.storages), 
                    'pipelines': len(self.system.pipelines)
                }
            }
        else:
            return {'success': False, 'error': 'Initialization failed'}
    
    def get_plant_recommendations(self, constraints: Dict = None, weights: Dict = None, count: int = 5) -> Dict:
        """Fast plant recommendations"""
        try:
            recommendations = self.system.optimize_plant_location(constraints, weights, count)
            
            return {
                'success': True,
                'count': len(recommendations),
                'recommendations': [
                    {
                        'location': [r.location.lng, r.location.lat, r.location.alt],
                        'total_score': r.score,
                        'reasoning': r.reasons
                    } for r in recommendations
                ]
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def get_storage_recommendations(self, constraints: Dict = None, weights: Dict = None, count: int = 5) -> Dict:
        """Fast storage recommendations"""
        try:
            recommendations = self.system.optimize_storage_location(constraints, weights, count)
            
            return {
                'success': True,
                'count': len(recommendations),
                'recommendations': [
                    {
                        'location': [r.location.lng, r.location.lat, r.location.alt],
                        'total_score': r.score,
                        'reasoning': r.reasons
                    } for r in recommendations
                ]
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def get_pipeline_recommendations(self, start_location: List, end_location: List,
                                   constraints: Dict = None, weights: Dict = None, count: int = 3) -> Dict:
        """Fast pipeline recommendations"""
        try:
            routes = self.system.optimize_pipeline_route(start_location, end_location, constraints, weights, count)
            
            return {
                'success': True,
                'count': len(routes),
                'recommendations': routes
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}

# Quick test function
def quick_performance_test():
    """Test the optimized system performance"""
    import time
    
    print("🚀 Testing Optimized Hydrogen Infrastructure System")
    print("=" * 55)
    
    # Create test data
    test_data = {
        "plants": [
            {"id": "p1", "location": [-74.006, 40.7128, 10], "capacity": 150},
            {"id": "p2", "location": [-87.6298, 41.8781, 15], "capacity": 200}
        ],
        "storage_facilities": [
            {"id": "s1", "location": [-74.006, 40.7628, 5], "capacity": 1500},
            {"id": "s2", "location": [-87.6298, 41.9281, 8], "capacity": 2000}
        ],
        "pipelines": [
            {"id": "pipe1", "path": [[-74.006, 40.7128, 10], [-74.006, 40.7628, 5]], "capacity": 75}
        ]
    }
    
    api = FastAPIInterface()
    
    # Test initialization
    start_time = time.time()
    init_result = api.initialize_system(test_data)
    init_time = time.time() - start_time
    
    print(f"✅ Initialization: {init_result['success']} ({init_time*1000:.1f}ms)")
    if init_result['success']:
        print(f"   Stats: {init_result['stats']}")
    
    # Test plant recommendations
    start_time = time.time()
    plant_result = api.get_plant_recommendations({'min_capacity': 100}, {'distance_weight': 0.6}, 5)
    plant_time = time.time() - start_time
    
    print(f"✅ Plant Recommendations: {plant_result['success']} ({plant_time*1000:.1f}ms)")
    print(f"   Generated: {plant_result.get('count', 0)} recommendations")
    
    # Test storage recommendations  
    start_time = time.time()
    storage_result = api.get_storage_recommendations({'min_capacity': 500}, {'distance_weight': 0.5}, 5)
    storage_time = time.time() - start_time
    
    print(f"✅ Storage Recommendations: {storage_result['success']} ({storage_time*1000:.1f}ms)")
    print(f"   Generated: {storage_result.get('count', 0)} recommendations")
    
    # Test pipeline recommendations
    start_time = time.time()
    pipeline_result = api.get_pipeline_recommendations([-75.0, 40.0, 10], [-74.5, 40.5, 8], {}, {}, 3)
    pipeline_time = time.time() - start_time
    
    print(f"✅ Pipeline Recommendations: {pipeline_result['success']} ({pipeline_time*1000:.1f}ms)")
    print(f"   Generated: {pipeline_result.get('count', 0)} routes")
    
    total_time = init_time + plant_time + storage_time + pipeline_time
    print(f"\n⚡ Total Time: {total_time*1000:.1f}ms")
    print(f"🎯 Performance: {'EXCELLENT' if total_time < 0.1 else 'GOOD' if total_time < 0.5 else 'NEEDS OPTIMIZATION'}")
    
    return api

if __name__ == "__main__":
    api = quick_performance_test()
