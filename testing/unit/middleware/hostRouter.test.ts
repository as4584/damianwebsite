/**
 * Host Router Tests
 * Tests subdomain detection and routing logic
 */

import {
  extractSubdomain,
  isDashboardSubdomain,
  isDashboardPath,
} from '../../../middleware/hostRouter';

describe('Host Router - Subdomain Detection', () => {
  describe('extractSubdomain', () => {
    it('should extract subdomain from full domain', () => {
      expect(extractSubdomain('dashboard.innovationdevelopmentsolutions.com')).toBe('dashboard');
      expect(extractSubdomain('app.innovationdevelopmentsolutions.com')).toBe('app');
      expect(extractSubdomain('admin.example.com')).toBe('admin');
    });
    
    it('should return null for main domain', () => {
      expect(extractSubdomain('innovationdevelopmentsolutions.com')).toBeNull();
      expect(extractSubdomain('example.com')).toBeNull();
    });
    
    it('should handle localhost subdomains', () => {
      expect(extractSubdomain('dashboard.localhost')).toBe('dashboard');
      expect(extractSubdomain('localhost')).toBeNull();
    });
    
    it('should handle domains with ports', () => {
      expect(extractSubdomain('dashboard.localhost:3000')).toBe('dashboard');
      expect(extractSubdomain('localhost:3000')).toBeNull();
    });
    
    it('should handle nested subdomains', () => {
      expect(extractSubdomain('api.dashboard.example.com')).toBe('api');
    });
    
    it('should return null for IP addresses', () => {
      expect(extractSubdomain('192.168.1.1')).toBeNull();
      expect(extractSubdomain('127.0.0.1')).toBeNull();
    });
    
    it('should return null for malformed hosts', () => {
      expect(extractSubdomain('')).toBeNull();
      expect(extractSubdomain('.')).toBeNull();
    });
    
    it('should return null for single-part host', () => {
      expect(extractSubdomain('dashboard')).toBeNull();
    });
  });

  describe('isDashboardSubdomain', () => {
    it('should detect dashboard subdomain', () => {
      expect(isDashboardSubdomain('dashboard.innovationdevelopmentsolutions.com')).toBe(true);
      expect(isDashboardSubdomain('dashboard.localhost')).toBe(true);
      expect(isDashboardSubdomain('dashboard.example.com')).toBe(true);
    });
    
    it('should reject non-dashboard subdomains', () => {
      expect(isDashboardSubdomain('app.example.com')).toBe(false);
      expect(isDashboardSubdomain('admin.example.com')).toBe(false);
      expect(isDashboardSubdomain('innovationdevelopmentsolutions.com')).toBe(false);
    });
    
    it('should handle ports correctly', () => {
      expect(isDashboardSubdomain('dashboard.localhost:3000')).toBe(true);
      expect(isDashboardSubdomain('app.localhost:3000')).toBe(false);
    });
  });

  describe('isDashboardPath', () => {
    it('should detect dashboard paths', () => {
      expect(isDashboardPath('/dashboard')).toBe(true);
      expect(isDashboardPath('/dashboard/')).toBe(true);
      expect(isDashboardPath('/dashboard/leads')).toBe(true);
      expect(isDashboardPath('/dashboard/leads/123')).toBe(true);
    });
    
    it('should reject non-dashboard paths', () => {
      expect(isDashboardPath('/')).toBe(false);
      expect(isDashboardPath('/about')).toBe(false);
      expect(isDashboardPath('/services')).toBe(false);
    });
  });
});

describe('Host Router - Routing Logic', () => {
  it('should handle all test cases without errors', () => {
    // Test that the functions are importable and don't throw on basic usage
    expect(extractSubdomain('dashboard.localhost')).toBe('dashboard');
    expect(isDashboardSubdomain('dashboard.localhost')).toBe(true);
    expect(isDashboardPath('/dashboard')).toBe(true);
  });
});
