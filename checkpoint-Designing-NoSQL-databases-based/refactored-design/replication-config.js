// MongoDB Script: Replication Configuration
// Purpose: Configure replica sets for high availability and fault tolerance

print("🔄 Configuring Replica Sets for High Availability...\n");

// ============================================
// 1. REPLICA SET CONFIGURATION
// ============================================

// This script assumes you're running a sharded cluster
// Each shard should have its own replica set

// Connect to the first shard's primary
// In production, this would be done for each shard

print("📋 Replica Set Configuration Template:\n");

// Example replica set configuration
const replicaSetConfig = {
  _id: "rs0",  // Replica set name
  version: 1,
  members: [
    {
      _id: 0,
      host: "mongo-primary-us-east-1:27017",
      priority: 2,              // Higher priority = preferred primary
      tags: {
        region: "us-east",
        datacenter: "dc1",
        role: "primary"
      }
    },
    {
      _id: 1,
      host: "mongo-secondary-us-west-1:27017",
      priority: 1,
      tags: {
        region: "us-west",
        datacenter: "dc2",
        role: "secondary"
      }
    },
    {
      _id: 2,
      host: "mongo-secondary-eu-west-1:27017",
      priority: 1,
      tags: {
        region: "eu-west",
        datacenter: "dc3",
        role: "secondary"
      }
    }
  ],
  settings: {
    // Heartbeat configuration
    heartbeatIntervalMillis: 2000,
    heartbeatTimeoutSecs: 10,
    
    // Election configuration
    electionTimeoutMillis: 10000,
    
    // Write concern
    getLastErrorModes: {
      multiRegion: {
        "region": 2  // Write must replicate to 2 different regions
      }
    }
  }
};

print("Configuration structure:");
print(JSON.stringify(replicaSetConfig, null, 2));

// ============================================
// 2. INITIALIZE REPLICA SET
// ============================================

print("\n🚀 To initialize replica set, run:");
print("   rs.initiate(replicaSetConfig)\n");

// ============================================
// 3. READ PREFERENCES CONFIGURATION
// ============================================

print("📖 Read Preference Configurations:\n");

// Example read preference for transactional reads
const transactionalReadPref = {
  mode: "primary",
  tags: []
};
print("Transactional Reads (Orders, Payments):");
print(JSON.stringify(transactionalReadPref, null, 2));

// Example read preference for analytics
const analyticsReadPref = {
  mode: "secondary",
  tags: [{ role: "secondary" }],
  maxStalenessSeconds: 90  // Allow up to 90 seconds of lag
};
print("\nAnalytics Reads (Reports, Dashboards):");
print(JSON.stringify(analyticsReadPref, null, 2));

// Example read preference for user dashboards
const userDashboardReadPref = {
  mode: "secondaryPreferred",
  tags: []
};
print("\nUser Dashboards (Balanced):");
print(JSON.stringify(userDashboardReadPref, null, 2));

// Example read preference for nearest (geographic)
const nearestReadPref = {
  mode: "nearest",
  tags: []
};
print("\nNearest Read (Geographic Optimization):");
print(JSON.stringify(nearestReadPref, null, 2));

// ============================================
// 4. WRITE CONCERNS
// ============================================

print("\n✍️ Write Concern Configurations:\n");

// High consistency write concern
const criticalWriteConcern = {
  w: "majority",
  j: true,              // Journal
  wtimeout: 5000        // 5 second timeout
};
print("Critical Writes (Orders, Payments):");
print(JSON.stringify(criticalWriteConcern, null, 2));

// Multi-region write concern
const multiRegionWriteConcern = {
  w: "multiRegion",     // Custom write concern mode
  j: true,
  wtimeout: 10000
};
print("\nMulti-Region Writes (Geographic Redundancy):");
print(JSON.stringify(multiRegionWriteConcern, null, 2));

// Fast write concern (for logs, analytics)
const fastWriteConcern = {
  w: 1,                 // Acknowledge from primary only
  j: false,
  wtimeout: 1000
};
print("\nFast Writes (Logs, Non-critical):");
print(JSON.stringify(fastWriteConcern, null, 2));

// ============================================
// 5. FAILOVER TESTING
// ============================================

print("\n🧪 Failover Testing Commands:\n");
print("   - rs.status() - Check replica set status");
print("   - rs.stepDown() - Force primary to step down (test failover)");
print("   - rs.conf() - View current configuration");
print("   - rs.printReplicationInfo() - View replication lag");
print("   - rs.printSecondaryReplicationInfo() - Detailed secondary info\n");

// ============================================
// 6. CONNECTION STRING EXAMPLES
// ============================================

print("🔗 Connection String Examples:\n");

const connectionStrings = {
  "Application Servers": 
    "mongodb://mongo-primary-us-east-1:27017,mongo-secondary-us-west-1:27017,mongo-secondary-eu-west-1:27017/ecommerce_db?replicaSet=rs0&readPreference=secondaryPreferred&w=majority",
  
  "Analytics Services":
    "mongodb://mongo-primary-us-east-1:27017,mongo-secondary-us-west-1:27017,mongo-secondary-eu-west-1:27017/ecommerce_db?replicaSet=rs0&readPreference=secondary&maxStalenessSeconds=90",
  
  "Admin Tools":
    "mongodb://mongo-primary-us-east-1:27017,mongo-secondary-us-west-1:27017,mongo-secondary-eu-west-1:27017/ecommerce_db?replicaSet=rs0&readPreference=primary&w=majority"
};

for (const [service, connStr] of Object.entries(connectionStrings)) {
  print(`\n${service}:`);
  print(`   ${connStr}`);
}

// ============================================
// 7. MONITORING AND ALERTS
// ============================================

print("\n\n📊 Monitoring Configuration:\n");

// Example monitoring queries
use ecommerce_db;

print("Key Metrics to Monitor:");
print("   1. Replication Lag:");
print("      rs.printSecondaryReplicationInfo()");
print("\n   2. Oplog Size:");
print("      db.getReplicationInfo()");
print("\n   3. Connection Pool:");
print("      db.serverStatus().connections");
print("\n   4. Operation Latency:");
print("      db.serverStatus().opLatencies");
print("\n   5. Network Traffic:");
print("      db.serverStatus().network");

// ============================================
// 8. ALERT THRESHOLDS
// ============================================

const alertThresholds = {
  replication_lag_seconds: 10,
  oplog_window_hours: 24,
  connection_pool_saturation: 0.8,
  primary_down: "immediate",
  secondary_down: "5 minutes"
};

print("\n\n🚨 Recommended Alert Thresholds:");
print(JSON.stringify(alertThresholds, null, 2));

// ============================================
// 9. REPLICA SET MAINTENANCE
// ============================================

print("\n\n🔧 Maintenance Procedures:\n");

print("Rolling Maintenance (No Downtime):");
print("   1. Maintenance on Secondary 1:");
print("      - Stop secondary node");
print("      - Perform maintenance");
print("      - Start node and wait for sync");
print("   2. Maintenance on Secondary 2:");
print("      - Repeat above steps");
print("   3. Maintenance on Primary:");
print("      - rs.stepDown() to elect new primary");
print("      - Perform maintenance on old primary");
print("      - Rejoin as secondary");

print("\nReconfiguration:");
print("   cfg = rs.conf()");
print("   cfg.members[0].priority = 2");
print("   rs.reconfig(cfg)");

// ============================================
// 10. BACKUP CONFIGURATION
// ============================================

print("\n\n💾 Backup Strategy:\n");

const backupStrategy = {
  type: "Continuous Backup",
  methods: [
    {
      name: "Snapshot Backup",
      frequency: "Daily",
      retention: "30 days",
      target: "Secondary node"
    },
    {
      name: "Oplog Backup",
      frequency: "Continuous",
      retention: "7 days",
      target: "All nodes"
    },
    {
      name: "Cold Backup",
      frequency: "Weekly",
      retention: "90 days",
      target: "Offline storage"
    }
  ],
  pitr: true,  // Point-in-time recovery
  geo_redundant: true
};

print(JSON.stringify(backupStrategy, null, 2));

// ============================================
// 11. DISASTER RECOVERY
// ============================================

print("\n\n🚑 Disaster Recovery Plan:\n");

print("Scenarios and Actions:");
print("\n1. Single Secondary Failure:");
print("   - Automatic: Replica set continues operating");
print("   - Action: Investigate and repair failed node");
print("   - RTO: 0 minutes (no downtime)");
print("   - RPO: 0 data loss");

print("\n2. Primary Failure:");
print("   - Automatic: Secondary elected as new primary (<10s)");
print("   - Action: Investigate failed primary");
print("   - RTO: <1 minute");
print("   - RPO: 0 data loss (with w:majority)");

print("\n3. Regional Failure:");
print("   - Manual: Promote secondary in different region");
print("   - Action: Redirect traffic to healthy region");
print("   - RTO: 5-15 minutes");
print("   - RPO: <90 seconds (maxStaleness)");

print("\n4. Complete Cluster Failure:");
print("   - Manual: Restore from backup");
print("   - Action: Deploy new cluster and restore");
print("   - RTO: 1-4 hours");
print("   - RPO: Up to 24 hours (snapshot frequency)");

// ============================================
// 12. PERFORMANCE TUNING
// ============================================

print("\n\n⚡ Performance Tuning:\n");

print("Oplog Size Calculation:");
print("   - High write workload: 5-10% of total data");
print("   - Must cover maintenance window");
print("   - Recommended: 24-48 hour window");

print("\nRead Preference Strategy:");
print("   - Transactional: primary");
print("   - Analytics: secondary");
print("   - User queries: secondaryPreferred");
print("   - Regional: nearest");

print("\nWrite Concern Strategy:");
print("   - Critical (orders): w:majority, j:true");
print("   - Standard (users): w:majority");
print("   - Logs: w:1");

print("\n✅ Replication configuration guide completed!");
print("\n💡 Next Steps:");
print("   1. Initialize replica sets for each shard");
print("   2. Configure read preferences in application");
print("   3. Set up monitoring and alerts");
print("   4. Test failover scenarios");
print("   5. Configure backup automation");
