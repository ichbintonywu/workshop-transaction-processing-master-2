"""
Transactions Router

Endpoints for transaction data (List + JSON modules).
"""

import time
from fastapi import APIRouter, Depends, HTTPException
from api.dependencies import get_redis_client
from processor.modules import ordered_transactions, store_transaction

router = APIRouter(prefix="/api/transactions", tags=["transactions"])


@router.get("/recent")
def get_recent_transactions(limit: int = 20, redis=Depends(get_redis_client)):
    """
    Get recent transactions with full details, ordered newest first.

    2 Redis calls:
    1. LRANGE to get IDs from List
    2. JSON.MGET to fetch all documents at once
    """
    try:
        # Call 1: Get IDs from list
        t0 = time.perf_counter()
        tx_ids = ordered_transactions.get_recent_transactions(redis, limit)
        t1 = time.perf_counter()

        if not tx_ids:
            return {"transactions": [], "count": 0, "redis_ms": 0}

        # Call 2: Get full documents
        transactions = store_transaction.get_transactions_by_ids(redis, tx_ids)
        t2 = time.perf_counter()

        lrange_ms = round((t1 - t0) * 1000, 2)
        mget_ms = round((t2 - t1) * 1000, 2)
        redis_ms = round((t2 - t0) * 1000, 2)

        return {
            "transactions": transactions,
            "count": len(transactions),
            "redis_ms": redis_ms,
            "lrange_ms": lrange_ms,
            "mget_ms": mget_ms
        }
    except Exception as e:
        return {"transactions": [], "count": 0, "error": str(e)}


@router.get("/{transaction_id}")
def get_transaction(transaction_id: str, redis=Depends(get_redis_client)):
    """
    Get single transaction by ID.
    """
    try:
        t0 = time.perf_counter()
        transaction = store_transaction.get_transaction(redis, transaction_id)
        redis_ms = round((time.perf_counter() - t0) * 1000, 2)

        if not transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        transaction["redis_ms"] = redis_ms
        return transaction
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
