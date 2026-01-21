> **Tip:** For best viewing in your IDE, use markdown preview (VS Code: `Cmd+Shift+V` on Mac, `Ctrl+Shift+V` on Windows/Linux)

# Redis Transaction Processing Workshop

Build a real-time transaction backend with Redis. Store data so it can be queiried in a single command and make it AI-searchable with vector embeddings.

## What You'll Learn

- **Redis Streams** — Ingest transactions in real-time
- **Redis Lists** — Retrieve recent transactions in order
- **Redis JSON** — Store and query transaction details
- **Sorted Sets** — Rank spending by category and merchant
- **TimeSeries** — Track spending trends over time
- **Vector Search** — Search transactions by meaning, not keywords

## Get Started

1. Spin up the workshop:
   ```bash
   docker compose up -d
   ```

2. Open the UI http://localhost:3001 and click **Redis Insight** to verify everything is running

3. Head to [`processor/README.md`](processor/README.md) to start completing the modules



Pre-requisites

Please ensure the following are completed before attending the workshop to ensure a smooth experience.

1. Internet Connection

Ensure you have a stable internet connection so you can:
•	Clone the workshop repository
•	Install required libraries during the session

2. Docker Setup
Download and install Docker from:
https://www.docker.com

3. Python Environment
Python 3 is required. It is recommended to create and use a virtual environment

Documentation:
https://docs.python.org/3/library/venv.html
<img width="468" height="325" alt="image" src="https://github.com/user-attachments/assets/2797a261-d558-4957-90c8-4b1a9874cbf4" />
