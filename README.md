# FinSight AI — Personal Finance & Credit Risk Analyzer

This is a static HTML/CSS/JavaScript dashboard project that demonstrates a modern finance analytics UI. The project is frontend-only and provides an interactive experience for viewing financial metrics, charts, and simulated insights.

## What this project does

- Displays a **finance dashboard** with key performance indicators:
  - Total balance
  - Monthly income
  - Monthly expenses
  - Savings rate
  - Financial health score
- Renders **interactive charts** using Chart.js:
  - Income vs Expense trend
  - Expense breakdown donut chart
  - Category budget vs actual bar chart
  - Net worth trend
  - Monthly cash flow bar chart
  - AI prediction line charts
- Includes **AI-style insights** and recommendations with simulated text cards.
- Shows a **recent transactions table** with search, category filter, status filter, pagination, and CSV export.
- Provides **multiple app sections/pages**:
  - Dashboard
  - Transactions
  - Analytics
  - AI Insights
  - Credit Risk
  - Fraud Detection
  - Settings
- Supports a **dark/light theme toggle** and responsive sidebar navigation.

## Files

- `index.html` — main application UI and page structure
- `app.js` — frontend logic, chart rendering, page interactions, and data simulation
- `styles.css` — project styles, layout, and theme appearance
- `logo.jpg`, `profile.jpg` — visual assets used in the UI

## Run locally

Because this is a static project, you can open `index.html` directly in your browser.

For a local web server, use one of these commands from the project folder:

### Windows / PowerShell
```powershell
py -3 -m http.server 8000
```

### macOS / Linux
```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
