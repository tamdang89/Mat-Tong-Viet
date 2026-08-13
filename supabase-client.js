/**
 * Supabase Local Wrapper
 * This file provides Supabase functionality without loading from CDN
 * 
 * Note: We'll use a lightweight alternative for local development
 */

// Create a mock Supabase client interface that works with REST API
class SupabaseClientLocal {
  constructor(url, key) {
    this.url = url;
    this.key = key;
  }

  from(table) {
    return {
      insert: async (data) => {
        try {
          const response = await fetch(`${this.url}/rest/v1/${table}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': this.key,
              'Authorization': `Bearer ${this.key}`,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify(Array.isArray(data) ? data : [data])
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            return {
              data: null,
              error: {
                message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
                code: response.status
              }
            };
          }

          const result = await response.json().catch(() => ({}));
          return {
            data: result,
            error: null
          };
        } catch (err) {
          return {
            data: null,
            error: {
              message: err.message,
              code: 'NETWORK_ERROR'
            }
          };
        }
      }
    };
  }
}

// Export Supabase object for window.supabase.createClient
const supabase = {
  createClient: (url, key) => {
    return new SupabaseClientLocal(url, key);
  }
};

// Make it available globally
if (typeof window !== 'undefined') {
  window.supabase = supabase;
}

// For module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = supabase;
}
