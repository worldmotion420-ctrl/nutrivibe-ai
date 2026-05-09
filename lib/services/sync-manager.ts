/**
 * Sync Manager
 * Handles synchronization between local cache and Supabase
 * Manages online/offline state and automatic sync
 */

import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { offlineCache, CachedMeal, DailyNutrition } from './offline-cache';

// ============================================================================
// TYPES
// ============================================================================

export interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: number;
  pendingItems: number;
  error: string | null;
}

export interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  error?: string;
}

// ============================================================================
// SYNC MANAGER
// ============================================================================

class SyncManager {
  private isOnline: boolean = true;
  private isSyncing: boolean = false;
  private syncInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: Set<(state: SyncState) => void> = new Set();

  /**
   * Initialize sync manager
   */
  async initialize(): Promise<void> {
    try {
      // Check initial connectivity
      const state = await NetInfo.fetch();
      this.isOnline = state.isConnected ?? true;

      // Subscribe to connectivity changes
      const unsubscribe = NetInfo.addEventListener((state: any) => {
        const wasOnline = this.isOnline;
        this.isOnline = (state?.isConnected as boolean) ?? true;

        console.log(`📡 Network: ${this.isOnline ? 'Online' : 'Offline'}`);

        // Trigger sync when coming back online
        if (!wasOnline && this.isOnline) {
          console.log('🔄 Back online - starting sync...');
          this.sync();
        }

        this.notifyListeners();
      });

      // Start periodic sync (every 5 minutes)
      this.syncInterval = setInterval(() => {
        if (this.isOnline && !this.isSyncing) {
          this.sync();
        }
      }, 5 * 60 * 1000);

      console.log('✓ Sync manager initialized');
    } catch (error) {
      console.error('Error initializing sync manager:', error);
    }
  }

  /**
   * Cleanup sync manager
   */
  destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
  }

  /**
   * Get current sync state
   */
  async getState(): Promise<SyncState> {
    const lastSyncTime = await offlineCache.getLastSyncTime();
    const queue = await offlineCache.getSyncQueue();

    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      lastSyncTime,
      pendingItems: queue.length,
      error: null,
    };
  }

  /**
   * Subscribe to sync state changes
   */
  subscribe(listener: (state: SyncState) => void): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of state change
   */
  private async notifyListeners(): Promise<void> {
    const state = await this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  /**
   * Main sync function
   */
  async sync(): Promise<SyncResult> {
    if (!this.isOnline) {
      console.log('⚠️ Offline - skipping sync');
      return { success: false, synced: 0, failed: 0, error: 'No internet connection' };
    }

    if (this.isSyncing) {
      console.log('⏳ Sync already in progress');
      return { success: false, synced: 0, failed: 0, error: 'Sync already in progress' };
    }

    this.isSyncing = true;
    this.notifyListeners();

    try {
      console.log('🔄 Starting sync...');

      const queue = await offlineCache.getSyncQueue();
      let synced = 0;
      let failed = 0;

      for (const item of queue) {
        try {
          const result = await this.syncItem(item);

          if (result) {
            await offlineCache.removeFromSyncQueue(item.id);
            synced++;
          } else {
            await offlineCache.incrementSyncRetries(item.id);
            failed++;
          }
        } catch (error) {
          console.error(`Error syncing item ${item.id}:`, error);
          await offlineCache.incrementSyncRetries(item.id);
          failed++;
        }
      }

      await offlineCache.updateLastSyncTime();
      this.isSyncing = false;
      this.notifyListeners();

      console.log(`✓ Sync complete: ${synced} synced, ${failed} failed`);

      return { success: failed === 0, synced, failed };
    } catch (error) {
      console.error('Sync error:', error);
      this.isSyncing = false;
      this.notifyListeners();

      return {
        success: false,
        synced: 0,
        failed: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Sync individual item
   */
  private async syncItem(item: any): Promise<boolean> {
    try {
      switch (item.type) {
        case 'meal':
          return await this.syncMeal(item.data);
        case 'profile':
          return await this.syncProfile(item.data);
        case 'delete':
          return await this.syncDelete(item.data);
        default:
          console.warn(`Unknown sync type: ${item.type}`);
          return false;
      }
    } catch (error) {
      console.error(`Error syncing ${item.type}:`, error);
      return false;
    }
  }

  /**
   * Sync meal to Supabase
   */
  private async syncMeal(meal: CachedMeal): Promise<boolean> {
    try {
      // TODO: Implement Supabase meal sync
      // const { data, error } = await supabase
      //   .from('meals')
      //   .upsert(meal);
      //
      // if (error) throw error;
      // return true;

      console.log(`📤 Syncing meal: ${meal.name}`);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      return true;
    } catch (error) {
      console.error('Error syncing meal:', error);
      return false;
    }
  }

  /**
   * Sync profile to Supabase
   */
  private async syncProfile(profile: any): Promise<boolean> {
    try {
      // TODO: Implement Supabase profile sync
      // const { data, error } = await supabase
      //   .from('user_profiles')
      //   .update(profile)
      //   .eq('id', profile.id);
      //
      // if (error) throw error;
      // return true;

      console.log(`📤 Syncing profile: ${profile.name}`);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      return true;
    } catch (error) {
      console.error('Error syncing profile:', error);
      return false;
    }
  }

  /**
   * Sync delete to Supabase
   */
  private async syncDelete(data: any): Promise<boolean> {
    try {
      // TODO: Implement Supabase delete sync
      // const { error } = await supabase
      //   .from(data.table)
      //   .delete()
      //   .eq('id', data.id);
      //
      // if (error) throw error;
      // return true;

      console.log(`📤 Syncing delete: ${data.id}`);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      return true;
    } catch (error) {
      console.error('Error syncing delete:', error);
      return false;
    }
  }

  /**
   * Force immediate sync
   */
  async forceSyncNow(): Promise<SyncResult> {
    return this.sync();
  }

  /**
   * Check if online
   */
  getIsOnline(): boolean {
    return this.isOnline;
  }

  /**
   * Check if syncing
   */
  getIsSyncing(): boolean {
    return this.isSyncing;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const syncManager = new SyncManager();

// ============================================================================
// REACT HOOK
// ============================================================================

export function useSyncState() {
  const [state, setState] = useState<SyncState>({
    isOnline: true,
    isSyncing: false,
    lastSyncTime: 0,
    pendingItems: 0,
    error: null,
  });

  useEffect(() => {
    // Get initial state
    syncManager.getState().then(setState);

    // Subscribe to changes
    const unsubscribe = syncManager.subscribe(setState);

    return unsubscribe;
  }, []);

  return state;
}

/**
 * Hook to trigger manual sync
 */
export function useSync() {
  const [result, setResult] = useState<SyncResult | null>(null);
  const [loading, setLoading] = useState(false);

  const sync = async () => {
    setLoading(true);
    try {
      const result = await syncManager.forceSyncNow();
      setResult(result);
    } finally {
      setLoading(false);
    }
  };

  return { sync, result, loading };
}

export default syncManager;
