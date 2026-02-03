# Database Checkpoint: Concurrency Control & Distributed Design

This document consolidates understanding of concurrency control and distributed database design through a guided banking system scenario.

---

## Part 1 - Transaction Management (Conceptual)

### Scenario
You are managing a mini banking system where users can:
- Transfer money between accounts
- View balances

**Situation:** Two users simultaneously initiate transfers that involve the same account.

---

### 1. Concurrency Issue Identification

When two users simultaneously initiate transfers involving the same account, the primary risk is the **Lost Update Problem**.

#### Example Scenario:
- User A transfers $100 from Account X to Account Y
- User B transfers $50 from Account X to Account Z
- Both read Account X's balance ($500) at the same time
- User A calculates: $500 - $100 = $400
- User B calculates: $500 - $50 = $450
- Both write their results, overwriting each other

**Result:** One update is lost, and the account balance becomes incorrect.

#### Other Potential Issues:
| Issue | Description |
|-------|-------------|
| **Lost Update** | Two transactions overwrite each other's changes |
| **Dirty Read** | Reading uncommitted changes from another transaction |
| **Inconsistent Read** | Reading data that changes mid-transaction |
| **Non-Repeatable Read** | Getting different values when reading same data twice |

---

### 2. Locking Mechanism Proposal

**Recommended: Two-Phase Locking (2PL) with Exclusive Locks**

| Operation | Lock Type | Purpose |
|-----------|-----------|---------|
| Read balance | **Exclusive Lock (X-lock)** | Prevents other transactions from reading/writing until complete |
| Update balance | **Exclusive Lock (X-lock)** | Ensures atomic write operations |

#### Why Exclusive over Shared?
- Shared locks allow concurrent reads but would still permit the lost update when both transactions try to write
- Exclusive locks ensure only one transaction can access the account at a time

#### Locking Protocol:
```sql
BEGIN TRANSACTION
    LOCK (Account_X, EXCLUSIVE)
    READ balance FROM Account_X
    IF balance >= transfer_amount THEN
        UPDATE Account_X SET balance = balance - amount
        LOCK (Account_Y, EXCLUSIVE)
        UPDATE Account_Y SET balance = balance + amount
    END IF
    COMMIT
    UNLOCK Account_X
    UNLOCK Account_Y
END TRANSACTION
```

---

### 3. Pessimistic vs Optimistic Locking

**Recommendation: Pessimistic Locking**

| Factor | Pessimistic | Optimistic |
|--------|-------------|------------|
| **Best for** | High-conflict environments | Low-conflict environments |
| **Banking suitability** | ✅ **Excellent** - Financial data is critical | Risky for money transfers |
| **Overhead** | Higher (locks maintained) | Lower (validation at commit) |
| **Conflict handling** | Prevents conflicts | Detects and rolls back |
| **Retry necessity** | Minimal | May require multiple retries |

#### Justification for Pessimistic:
- Banking transactions have **high conflict potential** (many users accessing same accounts)
- **Financial correctness is non-negotiable** - we cannot afford to rollback and retry
- Account balances are **hotspot resources** frequently accessed
- Better to wait briefly than risk data inconsistency

---

### 4. Concurrent Transaction Schedule Table

**Scenario:** T1 transfers $100 from Account A, T2 transfers $50 from Account A (initial balance: $500)

#### UNSAFE Schedule (Lost Update):

| Step | T1 | T2 | Balance |
|------|----|----|---------|
| 1 | READ(A) → $500 | | $500 |
| 2 | | READ(A) → $500 | $500 |
| 3 | balance = $500 - $100 | | $500 |
| 4 | | balance = $500 - $50 | $500 |
| 5 | WRITE(A) → $400 | | **$400** |
| 6 | | WRITE(A) → $450 | **$450** ❌ |

**Result:** T1's update is lost! Final balance should be $350, but shows $450.

---

#### SAFE Schedule (With Exclusive Locking):

| Step | T1 | T2 | Lock Status | Balance |
|------|----|----|-------------|---------|
| 1 | **LOCK-X(A)** | | T1 holds X-lock on A | $500 |
| 2 | READ(A) → $500 | | | $500 |
| 3 | balance = $500 - $100 | | | $500 |
| 4 | WRITE(A) → $400 | | | $400 |
| 5 | **UNLOCK(A)** | | Lock released | $400 |
| 6 | | **LOCK-X(A)** | T2 holds X-lock on A | $400 |
| 7 | | READ(A) → $400 | | $400 |
| 8 | | balance = $400 - $50 | | $400 |
| 9 | | WRITE(A) → $350 | | $350 |
| 10 | | **UNLOCK(A)** | Lock released | $350 |

**Result:** ✅ **Serial and Safe!** Final balance correctly shows $350.

---

## Part 2 - Distributed Database Planning (High-Level)

### Scenario
Your bank has three branches: **Tunis**, **Sousse**, and **Sfax**.

---

### 1. Horizontal Fragmentation Strategy

**Fragment by Branch Location** (Primary Horizontal Fragmentation)

```
                    CUSTOMERS (Global)
┌─────────────────────────────────────────────────────────┐
│  customer_id | name | branch | address | email | phone  │
└─────────────────────────────────────────────────────────┘

                    ↓ FRAGMENT BY branch ↓

┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│   CUSTOMERS_TN      │  │   CUSTOMERS_SS      │  │   CUSTOMERS_SF      │
│   (Tunis Branch)    │  │  (Sousse Branch)    │  │   (Sfax Branch)     │
├─────────────────────┤  ├─────────────────────┤  ├─────────────────────┤
│ branch = 'Tunis'    │  │ branch = 'Sousse'   │  │ branch = 'Sfax'     │
│ - Local customers   │  │ - Local customers   │  │ - Local customers   │
│ - Faster access     │  │ - Faster access     │  │ - Faster access     │
│ - Reduced network   │  │ - Reduced network   │  │ - Reduced network   │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

#### Benefits:
| Benefit | Description |
|---------|-------------|
| **Locality of reference** | Customers primarily visit their home branch |
| **Performance** | Queries execute locally without network overhead |
| **Scalability** | Each branch manages its own data volume |
| **Availability** | Branch outages don't affect other locations |

---

### 2. Vertical Fragmentation Candidate

**Column to Separate: `login_credentials`** (email + password_hash + security_questions)

#### Original Table (Wide):
```
┌────────────────────────────────────────────────────────────────────┐
│ customer_id | name | branch | address | email | password | phone   │
└────────────────────────────────────────────────────────────────────┘
```

#### After Vertical Fragmentation:
```
┌──────────────────────────────────┐    ┌──────────────────────────────────┐
│      CUSTOMERS_MAIN              │    │   CUSTOMERS_SECURITY             │
├──────────────────────────────────┤    ├──────────────────────────────────┤
│ customer_id (PK)                 │◄──►│ customer_id (PK/FK)              │
│ name                             │    │ email                            │
│ branch                           │    │ password_hash                    │
│ address                          │    │ security_question                │
│ phone                            │    │ last_login                       │
│ account_created                  │    │ failed_attempts                  │
│ ...                              │    │ two_factor_enabled               │
└──────────────────────────────────┘    └──────────────────────────────────┘
```

#### Why Separate Security Data?
| Reason | Explanation |
|--------|-------------|
| **Security isolation** | Sensitive credentials in separate, more protected table |
| **Access control** | Different user roles need different tables (tellers don't need passwords) |
| **Query patterns** | Login operations are infrequent vs. customer info lookups |
| **Encryption** | Apply stronger encryption only to the smaller security table |
| **Audit compliance** | Easier to track and secure sensitive data access |

---

### 3. Data Replication Strategy

| Data Type | Replication Strategy | Justification |
|-----------|---------------------|---------------|
| **Customer Info** | **Full Replication** | All branches need to verify customer identity; read-heavy; relatively stable |
| **Account Balances** | **Full Replication** | Critical for any transaction anywhere; must be consistent across branches |
| **Transaction History** | **Partial/Selective Replication** | Replicate recent transactions (last 90 days) to all branches; archive older data locally |

#### Replication Architecture:
```
┌─────────────────────────────────────────────────────────────────────┐
│                    REPLICATION ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   TUNIS BRANCH        SOUSSE BRANCH        SFAX BRANCH              │
│   ┌───────────┐       ┌───────────┐       ┌───────────┐             │
│   │ Customer  │◄─────►│ Customer  │◄─────►│ Customer  │             │
│   │  (Full)   │       │  (Full)   │       │  (Full)   │             │
│   └───────────┘       └───────────┘       └───────────┘             │
│         ▲                   ▲                   ▲                    │
│         └───────────────────┴───────────────────┘                    │
│                    SYNCHRONOUS REPLICATION                           │
│                    (Strong Consistency)                              │
│                                                                      │
│   ┌───────────┐       ┌───────────┐       ┌───────────┐             │
│   │  Balance  │◄─────►│  Balance  │◄─────►│  Balance  │             │
│   │  (Full)   │       │  (Full)   │       │  (Full)   │             │
│   └───────────┘       └───────────┘       └───────────┘             │
│         ▲                   ▲                   ▲                    │
│         └───────────────────┴───────────────────┘                    │
│                    SYNCHRONOUS REPLICATION                           │
│                    (Critical - Must be consistent)                   │
│                                                                      │
│   ┌───────────┐       ┌───────────┐       ┌───────────┐             │
│   │  Recent   │◄─────►│  Recent   │◄─────►│  Recent   │             │
│   │  Trans    │       │  Trans    │       │  Trans    │             │
│   │(90 days)  │       │(90 days)  │       │(90 days)  │             │
│   └───────────┘       └───────────┘       └───────────┘             │
│         │                   │                   │                    │
│         └───────────────────┴───────────────────┘                    │
│                    ASYNCHRONOUS REPLICATION                          │
│                    (Eventual Consistency acceptable)                 │
│                                                                      │
│   ┌───────────┐       ┌───────────┐       ┌───────────┐             │
│   │  Archive  │       │  Archive  │       │  Archive  │             │
│   │(90+ days) │       │(90+ days) │       │(90+ days) │             │
│   │ LOCAL ONLY│       │ LOCAL ONLY│       │ LOCAL ONLY│             │
│   └───────────┘       └───────────┘       └───────────┘             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

#### Why This Distribution?
| Data | Reason |
|------|--------|
| **Customer Info** | Needed everywhere for verification and KYC compliance |
| **Account Balances** | Must be consistent; customers can withdraw from any branch |
| **Transaction History** | Recent history needed for fraud detection; old history rarely accessed remotely |

---

### 4. Static vs Dynamic Allocation for Transaction History

**Recommendation: Dynamic Allocation**

| Aspect | Static Allocation | Dynamic Allocation |
|--------|-------------------|-------------------|
| **Definition** | Fixed partition by branch | Moves data based on access patterns |
| **Best for** | Stable, predictable workloads | Variable, evolving access patterns |
| **Flexibility** | Low - fixed assignment | High - adapts to usage |
| **Maintenance** | Simple | Requires monitoring |

#### Justification for Dynamic Allocation:

1. **Customer Mobility**
   - Customers may relocate or frequently visit different branches
   - A Tunis customer working in Sousse needs local access to their history

2. **Temporal Locality**
   - Recent transactions are accessed more frequently
   - Keep last 30 days at customer's primary branch
   - Archive older data centrally or distribute based on query patterns

3. **Query Pattern Adaptation:**
   ```
   Dynamic Allocation Strategy:
   
   Month 1-3:   Store at originating branch (high local access)
   Month 4-12:  Replicate to customer's most-visited branches
   Year 1+:     Move to central archive (rare access)
   Year 7+:     Offsite backup (regulatory compliance only)
   ```

4. **Load Balancing**
   - Prevents hot spots when one branch has high transaction volume

5. **Cost Efficiency**
   - Reduces storage at edge locations
   - Centralizes cold data for cheaper storage

#### Implementation Approach:
| Data Temperature | Strategy |
|------------------|----------|
| **Hot data** (0-30 days) | Replicated to active branches |
| **Warm data** (1-12 months) | Primary branch only |
| **Cold data** (1+ years) | Centralized archive with on-demand retrieval |

---

## Summary Table

| Component | Key Decision | Rationale |
|-----------|--------------|-----------|
| Concurrency Control | Pessimistic 2PL with X-locks | Financial data requires strict consistency |
| Distributed Fragmentation | Horizontal by branch | Locality and performance optimization |
| Vertical Separation | Security credentials isolated | Protection and access control |
| Replication Strategy | Full for balances, partial for history | Balance consistency vs. efficiency |
| History Allocation | Dynamic | Adapt to customer behavior patterns |

---

## Key Takeaways

✅ **ACID compliance** is essential for banking transactions  
✅ **Pessimistic locking** prevents conflicts in high-contention environments  
✅ **Horizontal fragmentation** by location optimizes local access  
✅ **Vertical fragmentation** isolates sensitive data  
✅ **Dynamic allocation** adapts to changing access patterns  
✅ **Strategic replication** balances consistency, availability, and cost

---

*Document created for Database Systems Checkpoint*
