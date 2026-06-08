import { v4 as uuidv4 } from 'uuid';

/**
 * View Tracker Service
 *
 * Implements intelligent view counting with:
 * - Session-based deduplication (30 minutes)
 * - IP-based deduplication (24 hours)
 * - User-based deduplication (if authenticated)
 * - Fingerprint-based tracking
 * - Persistent storage across server restarts
 */

interface ViewSession {
  sessionId: string;
  postId: string;
  timestamp: number;
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
  fingerprint?: string;
}

interface PostViewStats {
  postId: string;
  totalViews: number;
  uniqueViews: number;
  lastViewed: number;
  sessions: string[];
}

class ViewTracker {
  private sessions: Map<string, ViewSession[]> = new Map();
  private postStats: Map<string, PostViewStats> = new Map();
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000;  // 30 minutes per session
  private readonly IP_TIMEOUT      =  6 * 60 * 60 * 1000; // 6 hours per IP (prod only)
  private readonly MAX_SESSIONS_PER_POST = 10000;
  private readonly CLEANUP_INTERVAL     = 60 * 60 * 1000; // 1 hour

  constructor() {
    // Start cleanup job
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
    console.log('✅ ViewTracker initialized');
  }

  /**
   * Check if a view should be counted
   * Returns true if the view is legitimate and should increment the counter
   */
  shouldCountView(
    postId: string,
    sessionId: string,
    ipAddress?: string,
    userId?: string,
    fingerprint?: string
  ): boolean {
    const now = Date.now();
    const postSessions = this.sessions.get(postId) || [];

    // Check 1: Session-based dedup — same localStorage session within 30 minutes
    const recentSession = postSessions.find(
      s => s.sessionId === sessionId && now - s.timestamp < this.SESSION_TIMEOUT
    );
    if (recentSession) {
      console.log(`⏭️  View skipped: Same session within 30 min (post: ${postId})`);
      return false;
    }

    // Check 2: IP-based dedup — only for real (non-localhost) IPs, 6-hour window
    if (ipAddress && !ipAddress.startsWith('local:')) {
      const recentIpView = postSessions.find(
        s => s.ipAddress === ipAddress && now - s.timestamp < this.IP_TIMEOUT
      );
      if (recentIpView) {
        console.log(`⏭️  View skipped: Same IP within 6 hours (post: ${postId})`);
        return false;
      }
    }

    // Check 3: Authenticated user — count once per post per user
    if (userId) {
      const existingUserView = postSessions.find(s => s.userId === userId);
      if (existingUserView) {
        console.log(`⏭️  View skipped: User already viewed (post: ${postId})`);
        return false;
      }
    }

    return true;
  }

  /**
   * Record a legitimate view
   */
  recordView(
    postId: string,
    sessionId: string,
    ipAddress?: string,
    userAgent?: string,
    userId?: string,
    fingerprint?: string
  ): void {
    const now = Date.now();

    // Add session record
    if (!this.sessions.has(postId)) {
      this.sessions.set(postId, []);
    }

    const postSessions = this.sessions.get(postId)!;
    postSessions.push({
      sessionId,
      postId,
      timestamp: now,
      ipAddress,
      userAgent,
      userId,
      fingerprint
    });

    // Limit memory usage per post
    if (postSessions.length > this.MAX_SESSIONS_PER_POST) {
      postSessions.splice(0, postSessions.length - this.MAX_SESSIONS_PER_POST);
    }

    // Update post statistics
    if (!this.postStats.has(postId)) {
      this.postStats.set(postId, {
        postId,
        totalViews: 0,
        uniqueViews: 0,
        lastViewed: now,
        sessions: []
      });
    }

    const stats = this.postStats.get(postId)!;
    stats.totalViews++;
    stats.lastViewed = now;

    // Count unique views (deduplicated by session)
    if (!stats.sessions.includes(sessionId)) {
      stats.sessions.push(sessionId);
      stats.uniqueViews++;
    }

    console.log(`✅ View recorded: Post ${postId} | Total: ${stats.totalViews} | Unique: ${stats.uniqueViews}`);
  }

  /**
   * Get view statistics for a post
   */
  getPostStats(postId: string): PostViewStats {
    return this.postStats.get(postId) || {
      postId,
      totalViews: 0,
      uniqueViews: 0,
      lastViewed: Date.now(),
      sessions: []
    };
  }

  /**
   * Get all post statistics
   */
  getAllStats(): PostViewStats[] {
    return Array.from(this.postStats.values());
  }

  /**
   * Get top posts by views
   */
  getTopPosts(limit: number = 10): PostViewStats[] {
    return Array.from(this.postStats.values())
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, limit);
  }

  /**
   * Reset views for a post (when post is edited/republished)
   */
  resetPostViews(postId: string): void {
    this.sessions.delete(postId);
    this.postStats.delete(postId);
    console.log(`🔄 Views reset for post: ${postId}`);
  }

  /**
   * Cleanup old sessions
   */
  private cleanup(): void {
    const now = Date.now();
    let cleanedSessions = 0;
    let cleanedPosts = 0;

    // Clean old sessions (keep last 30 days)
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    this.sessions.forEach((sessions, postId) => {
      const initialLength = sessions.length;
      const filtered = sessions.filter(s => s.timestamp > thirtyDaysAgo);

      if (filtered.length !== initialLength) {
        if (filtered.length === 0) {
          this.sessions.delete(postId);
          cleanedPosts++;
        } else {
          this.sessions.set(postId, filtered);
        }
        cleanedSessions += initialLength - filtered.length;
      }
    });

    if (cleanedSessions > 0) {
      console.log(`🧹 Cleanup: Removed ${cleanedSessions} old sessions from ${cleanedPosts} posts`);
    }
  }

  /**
   * Get analytics data
   */
  getAnalytics() {
    const allStats = this.getAllStats();
    const totalViews = allStats.reduce((sum, stat) => sum + stat.totalViews, 0);
    const totalUniqueViews = allStats.reduce((sum, stat) => sum + stat.uniqueViews, 0);

    // Calculate views by date (last 30 days)
    const viewsByDate = new Map<string, { total: number; unique: Set<string> }>();
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    this.sessions.forEach(sessions => {
      sessions
        .filter(s => s.timestamp > thirtyDaysAgo)
        .forEach(s => {
          const dateKey = new Date(s.timestamp).toISOString().split('T')[0];
          if (!viewsByDate.has(dateKey)) {
            viewsByDate.set(dateKey, { total: 0, unique: new Set() });
          }
          const dayStats = viewsByDate.get(dateKey)!;
          dayStats.total++;
          dayStats.unique.add(s.sessionId);
        });
    });

    const viewsByDateArray = Array.from(viewsByDate.entries())
      .map(([date, stats]) => ({
        date,
        views: stats.total,
        uniqueViews: stats.unique.size
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalViews,
      totalUniqueViews,
      totalPostsWithViews: allStats.length,
      viewsByDate: viewsByDateArray,
      topPosts: this.getTopPosts(10)
    };
  }

  /**
   * Export data for persistence
   */
  exportData(): string {
    return JSON.stringify({
      sessions: Array.from(this.sessions.entries()),
      postStats: Array.from(this.postStats.entries()),
      timestamp: Date.now()
    });
  }

  /**
   * Import data from persistence
   */
  importData(data: string): void {
    try {
      const parsed = JSON.parse(data);
      this.sessions = new Map(parsed.sessions);
      this.postStats = new Map(parsed.postStats);
      console.log(`📥 Imported view data: ${this.postStats.size} posts with view history`);
    } catch (error) {
      console.error('❌ Failed to import view data:', error);
    }
  }
}

// Singleton instance
export const viewTracker = new ViewTracker();

// Auto-save to file every 5 minutes (optional persistence)
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'view-tracker.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load existing data on startup
if (fs.existsSync(DATA_FILE)) {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    viewTracker.importData(data);
    console.log('📂 Loaded existing view data from disk');
  } catch (error) {
    console.error('❌ Failed to load view data:', error);
  }
}

// Auto-save every 5 minutes
setInterval(() => {
  try {
    const data = viewTracker.exportData();
    fs.writeFileSync(DATA_FILE, data, 'utf-8');
    console.log('💾 View data saved to disk');
  } catch (error) {
    console.error('❌ Failed to save view data:', error);
  }
}, 5 * 60 * 1000);

// Save on process exit
process.on('SIGINT', () => {
  try {
    const data = viewTracker.exportData();
    fs.writeFileSync(DATA_FILE, data, 'utf-8');
    console.log('💾 View data saved before exit');
  } catch (error) {
    console.error('❌ Failed to save view data on exit:', error);
  }
  process.exit(0);
});

export default viewTracker;
