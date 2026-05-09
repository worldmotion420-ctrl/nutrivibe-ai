# NutriVibe AI - Offline Caching Guide

## Overview

NutriVibe AI includes a **comprehensive offline caching system** that allows users to access their meal history and nutrition data without an internet connection. The system automatically syncs data when the device comes back online.

## Architecture

### Components

1. **Offline Cache Service** (`lib/services/offline-cache.ts`)
   - Manages local data persistence using AsyncStorage
   - Handles meal storage, daily nutrition summaries, and user profiles
   - Provides sync queue for pending changes

2. **Sync Manager** (`lib/services/sync-manager.ts`)
   - Monitors network connectivity
   - Manages automatic sync when online
   - Handles retry logic for failed syncs
   - Provides React hooks for sync state

3. **UI Components** (`components/ui/offline-indicator.tsx`)
   - Offline indicator banner
   - Sync status display
   - Visual feedback for pending changes

4. **Offline Screens**
   - Dashboard (dashboard-offline.tsx)
   - History (history-offline.tsx)
   - Display cached data when offline

## Data Storage

### Cache Keys

```typescript
MEALS                 // All cached meals
DAILY_NUTRITION      // Daily nutrition summaries
USER_PROFILE         // User profile data
SYNC_QUEUE           // Pending changes to sync
LAST_SYNC            // Last sync timestamp
CACHE_VERSION        // Cache schema version
```

### Data Models

#### CachedMeal
```typescript
{
  id: string;
  name: string;
  items: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  timestamp: number;
  imageUri?: string;
  confidence?: number;
  synced: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### DailyNutrition
```typescript
{
  date: string;
  meals: CachedMeal[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    water: number;
  };
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    water: number;
  };
}
```

## Usage

### Initialize Offline Cache

```typescript
import { offlineCache } from '@/lib/services/offline-cache';
import { syncManager } from '@/lib/services/sync-manager';

// In your app root (_layout.tsx)
useEffect(() => {
  offlineCache.initialize();
  syncManager.initialize();

  return () => {
    syncManager.destroy();
  };
}, []);
```

### Save Meal to Cache

```typescript
import { offlineCache } from '@/lib/services/offline-cache';

const meal = {
  id: 'meal_123',
  name: 'Grilled Chicken',
  items: ['Chicken Breast', 'Brown Rice', 'Broccoli'],
  calories: 450,
  protein: 45,
  carbs: 50,
  fat: 10,
  fiber: 5,
  timestamp: Date.now(),
  synced: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

await offlineCache.saveMeal(meal);
```

### Get Meals for Today

```typescript
const today = new Date().toISOString().split('T')[0];
const meals = await offlineCache.getMealsByDate(today);
```

### Calculate Daily Nutrition

```typescript
const today = new Date().toISOString().split('T')[0];
const nutrition = await offlineCache.calculateDailyNutrition(today);

console.log(nutrition.totals.calories);  // Total calories
console.log(nutrition.totals.protein);   // Total protein
```

### Monitor Sync State

```typescript
import { useSyncState } from '@/lib/services/sync-manager';

function MyComponent() {
  const syncState = useSyncState();

  return (
    <View>
      <Text>Online: {syncState.isOnline ? 'Yes' : 'No'}</Text>
      <Text>Syncing: {syncState.isSyncing ? 'Yes' : 'No'}</Text>
      <Text>Pending: {syncState.pendingItems}</Text>
      <Text>Last Sync: {new Date(syncState.lastSyncTime).toLocaleString()}</Text>
    </View>
  );
}
```

### Trigger Manual Sync

```typescript
import { useSync } from '@/lib/services/sync-manager';

function SyncButton() {
  const { sync, loading, result } = useSync();

  return (
    <Button
      onPress={sync}
      disabled={loading}
    >
      {loading ? 'Syncing...' : 'Sync Now'}
    </Button>
  );
}
```

### Add to Sync Queue

```typescript
await offlineCache.addToSyncQueue({
  type: 'meal',
  data: mealData,
});
```

## Sync Flow

### Automatic Sync

1. **Initialization** - Sync manager starts on app launch
2. **Connectivity Check** - Monitors network status via NetInfo
3. **Periodic Sync** - Syncs every 5 minutes when online
4. **Reconnection Sync** - Automatically syncs when device comes back online
5. **Retry Logic** - Retries failed syncs up to 3 times

### Manual Sync

```typescript
const result = await syncManager.forceSyncNow();
console.log(`Synced: ${result.synced}, Failed: ${result.failed}`);
```

## Cache Management

### Check Cache Size

```typescript
const sizeInBytes = await offlineCache.getCacheSize();
console.log(`Cache size: ${(sizeInBytes / 1024).toFixed(2)} KB`);
```

### Clear Specific Cache Type

```typescript
// Clear only meals
await offlineCache.clearCacheType('MEALS');

// Clear only sync queue
await offlineCache.clearCacheType('SYNC_QUEUE');
```

### Clear All Cache

```typescript
await offlineCache.clearAll();
```

### Export Cache Data (for debugging)

```typescript
const cacheData = await offlineCache.exportCacheData();
console.log(JSON.stringify(cacheData, null, 2));
```

## UI Components

### Offline Indicator

Shows when device is offline with automatic animation:

```tsx
import { OfflineIndicator } from '@/components/ui/offline-indicator';

<OfflineIndicator />
```

### Sync Status

Shows number of pending items:

```tsx
import { SyncStatus } from '@/components/ui/offline-indicator';

<SyncStatus />
```

## Cache Expiry

- **Meals**: Kept for 30 days
- **Daily Nutrition**: Kept for 30 days
- **User Profile**: No expiry
- **Sync Queue**: Cleared after successful sync

## Best Practices

### DO ✅

- Always call `offlineCache.initialize()` on app startup
- Use `useSyncState()` hook to show sync status
- Add meals to sync queue before clearing local data
- Handle sync failures gracefully
- Show offline indicator to users
- Test offline functionality on real devices

### DON'T ❌

- Don't clear cache without syncing first
- Don't assume sync always succeeds
- Don't ignore sync errors
- Don't create multiple SyncManager instances
- Don't manually edit AsyncStorage keys
- Don't store sensitive data in cache without encryption

## Integration with Supabase

### Sync Meal to Supabase

```typescript
// In sync-manager.ts syncMeal() function
const { data, error } = await supabase
  .from('meals')
  .upsert({
    id: meal.id,
    user_id: userId,
    name: meal.name,
    items: meal.items,
    calories: meal.calories,
    protein: meal.protein,
    carbs: meal.carbs,
    fat: meal.fat,
    fiber: meal.fiber,
    timestamp: meal.timestamp,
    created_at: meal.createdAt,
    updated_at: meal.updatedAt,
  });

if (error) throw error;
return true;
```

### Sync Profile to Supabase

```typescript
const { data, error } = await supabase
  .from('user_profiles')
  .update(profile)
  .eq('id', profile.id);

if (error) throw error;
return true;
```

## Performance Considerations

### Cache Size Limits

- Keep cache under 10MB for optimal performance
- Automatically expires data older than 30 days
- Consider archiving old data to cloud storage

### Sync Optimization

- Batch sync operations for efficiency
- Use exponential backoff for retries
- Compress large data before storing
- Consider differential sync for large datasets

### Memory Management

- Clear sync queue after successful sync
- Remove duplicate entries
- Compress image data before caching
- Use pagination for large meal lists

## Troubleshooting

### Sync Not Working

1. Check network connectivity: `syncManager.getIsOnline()`
2. Verify sync queue: `await offlineCache.getSyncQueue()`
3. Check last sync time: `await offlineCache.getLastSyncTime()`
4. Force manual sync: `await syncManager.forceSyncNow()`

### Cache Not Persisting

1. Verify AsyncStorage is initialized
2. Check cache version: `await AsyncStorage.getItem('nutrivibe_cache_version')`
3. Clear and reinitialize cache: `await offlineCache.clearAll()`
4. Check available storage space

### High Memory Usage

1. Check cache size: `await offlineCache.getCacheSize()`
2. Clear old data: `await offlineCache.clearAll()`
3. Implement cache pruning for data older than 30 days
4. Compress image data before storing

## Testing

### Test Offline Mode

```typescript
// Simulate offline
import NetInfo from '@react-native-community/netinfo';
await NetInfo.fetch().then(state => {
  console.log('Is connected?', state.isConnected);
});

// Test cache operations
const meal = { /* ... */ };
await offlineCache.saveMeal(meal);
const cached = await offlineCache.getMeals();
console.log('Cached meals:', cached);
```

### Test Sync

```typescript
// Add to sync queue
await offlineCache.addToSyncQueue({
  type: 'meal',
  data: meal,
});

// Trigger sync
const result = await syncManager.forceSyncNow();
console.log('Sync result:', result);
```

## Future Enhancements

- [ ] Encryption for sensitive data
- [ ] Differential sync for large datasets
- [ ] Background sync with WorkManager
- [ ] Cloud backup and restore
- [ ] Conflict resolution for concurrent edits
- [ ] Bandwidth-aware sync strategies
- [ ] Analytics for sync performance

---

**Built for seamless offline experience**
