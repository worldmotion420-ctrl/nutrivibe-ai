import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { syncManager } from '../sync-manager';
import { offlineCache } from '../offline-cache';

// Mock offlineCache
vi.mock('../offline-cache', () => ({
  offlineCache: {
    getSyncQueue: vi.fn(() => Promise.resolve([])),
    removeFromSyncQueue: vi.fn(),
    incrementSyncRetries: vi.fn(),
    getLastSyncTime: vi.fn(() => Promise.resolve(0)),
    updateLastSyncTime: vi.fn(() => Promise.resolve()),
  },
}));

// Mock NetInfo
vi.mock('@react-native-community/netinfo', () => ({
  default: {
    fetch: vi.fn(() => Promise.resolve({ isConnected: true })),
    addEventListener: vi.fn(() => () => {}),
  },
}));

describe('SyncManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('State Management', () => {
    it('should get current sync state', async () => {
      const state = await syncManager.getState();

      expect(state).toHaveProperty('isOnline');
      expect(state).toHaveProperty('isSyncing');
      expect(state).toHaveProperty('lastSyncTime');
      expect(state).toHaveProperty('pendingItems');
    });

    it('should report correct online status', () => {
      const isOnline = syncManager.getIsOnline();
      expect(typeof isOnline).toBe('boolean');
    });

    it('should report correct syncing status', () => {
      const isSyncing = syncManager.getIsSyncing();
      expect(typeof isSyncing).toBe('boolean');
    });
  });

  describe('Sync Operations', () => {
    it('should process empty sync queue', async () => {
      const result = await syncManager.sync();

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('synced');
      expect(result).toHaveProperty('failed');
    });

    it('should subscribe to sync state changes', () => {
      const listener = vi.fn();
      const unsubscribe = syncManager.subscribe(listener);

      expect(typeof unsubscribe).toBe('function');
    });
  });

  describe('Connectivity', () => {
    it('should detect online status', () => {
      const isOnline = syncManager.getIsOnline();
      expect(typeof isOnline).toBe('boolean');
    });
  });

  describe('Manual Sync', () => {
    it('should force immediate sync', async () => {
      const result = await syncManager.forceSyncNow();

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('synced');
      expect(result).toHaveProperty('failed');
    });
  });

  describe('Initialization', () => {
    it('should initialize without errors', () => {
      expect(() => {
        syncManager.initialize();
      }).not.toThrow();
    });
  });

  describe('Cleanup', () => {
    it('should destroy sync manager', () => {
      expect(() => {
        syncManager.destroy();
      }).not.toThrow();
    });
  });
});
