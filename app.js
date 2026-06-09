/* ============================================================
   FinSight AI — App Logic, Charts & Data
   ============================================================ */

// ── Theme ──────────────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
let currentTheme = localStorage.getItem('finsight-theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('finsight-theme', currentTheme);
  updateChartsTheme();
});

function getThemeColors() {
  const isDark = currentTheme === 'dark';
  return {
    grid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    text: isDark ? '#64748b' : '#94a3b8',
    tooltip: isDark ? '#1e2130' : '#ffffff',
    border: isDark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.07)',
  };
}

// ── Sidebar ─────────────────────────────────────────────────
const sidebar = document.getElementById('sidebar');
const mainWrapper = document.getElementById('mainWrapper');
const sidebarToggle = document.getElementById('sidebarToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
let sidebarCollapsed = false;

sidebarToggle.addEventListener('click', () => {
  sidebarCollapsed = !sidebarCollapsed;
  sidebar.classList.toggle('collapsed', sidebarCollapsed);
  mainWrapper.classList.toggle('collapsed', sidebarCollapsed);
});
mobileMenuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('mobile-open');
});

// ── Navigation ──────────────────────────────────────────────
const pageTitles = {
  dashboard: ['Dashboard', 'Welcome back, Manojh 👋'],
  transactions: ['Transactions', 'All financial activity'],
  analytics: ['Analytics', 'Deep dive into your data'],
  'ai-insights': ['AI Insights', 'Machine learning powered recommendations'],
  'credit-risk': ['Credit Risk', 'Credit score & risk assessment'],
  'fraud-detection': ['Fraud Detection', 'Security monitoring & alerts'],
  settings: ['Settings', 'Account preferences'],
};

document.querySelectorAll('.nav-item, .view-all-link').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const page = item.dataset.page;
    if (!page) return;
    navigateTo(page);
    if (window.innerWidth <= 768) sidebar.classList.remove('mobile-open');
  });
});

function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');
  const nav = document.getElementById('nav-' + page);
  if (nav) nav.classList.add('active');
  const [title, sub] = pageTitles[page] || [page, ''];
  document.getElementById('pageTitle').textContent = title;
  document.getElementById('pageSubtitle').textContent = sub;
  if (page === 'analytics') initAnalyticsPage();
  if (page === 'ai-insights') initAIInsightsPage();
  if (page === 'credit-risk') initCreditRiskPage();
  if (page === 'fraud-detection') initFraudPage();
  if (page === 'settings') initSettingsPage();
  // Micro-interactions for new page
  setTimeout(() => {
    if (typeof applyRipples === 'function') applyRipples();
    if (typeof applyRevealObserver === 'function') applyRevealObserver();
  }, 120);
}

// ── User Dropdown ───────────────────────────────────────────
const userAvatarBtn = document.getElementById('userAvatarBtn');
const userDropdown = document.getElementById('userDropdown');
userAvatarBtn.addEventListener('click', e => {
  e.stopPropagation();
  userDropdown.classList.toggle('open');
});
document.addEventListener('click', () => userDropdown.classList.remove('open'));

// ── Notifications ───────────────────────────────────────────
const notifBtn = document.getElementById('notificationBtn');
const notifPanel = document.getElementById('notifPanel');
const notifOverlay = document.getElementById('notifOverlay');
const notifications = [
  { icon: 'Notice', text: 'Suspicious transaction detected — ₹12,400 at Unknown Merchant', time: '2 mins ago', unread: true },
  { icon: 'Insight', text: 'AI Insight: Reduce dining spend by 20% to save ₹3,200/month', time: '15 mins ago', unread: true },
  { icon: 'Trend', text: 'Your credit score increased by 14 points this month!', time: '1 hr ago', unread: true },
  { icon: 'Success', text: 'Monthly report for March 2026 is ready to view', time: '3 hrs ago', unread: false },
  { icon: 'Goal', text: 'Savings goal "Emergency Fund" is 91% complete', time: 'Yesterday', unread: false },
];
const notifList = document.getElementById('notifList');
notifications.forEach(n => {
  notifList.innerHTML += `<div class="notif-item ${n.unread ? 'unread' : ''}">
    <div class="notif-icon">${n.icon}</div>
    <div style="flex:1"><div class="notif-text">${n.text}</div><div class="notif-time">${n.time}</div></div>
    ${n.unread ? '<div class="notif-unread-dot"></div>' : ''}
  </div>`;
});
notifBtn.addEventListener('click', e => {
  e.stopPropagation();
  notifPanel.classList.toggle('open');
  notifOverlay.classList.toggle('active');
});
notifOverlay.addEventListener('click', () => {
  notifPanel.classList.remove('open');
  notifOverlay.classList.remove('active');
});
document.getElementById('markAllRead').addEventListener('click', () => {
  document.querySelectorAll('.notif-item.unread').forEach(el => el.classList.remove('unread'));
  document.querySelectorAll('.notif-unread-dot').forEach(el => el.remove());
  document.querySelector('.notif-dot').textContent = '0';
});

// ── Data ────────────────────────────────────────────────────
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const income  = [8200,8800,9100,8600,9400,10200,9800,10500,11200,10800,11600,12000];
const expense = [5800,6200,5600,6800,7100,6400,7600,6900,7200,7800,6600,8100];
const savings = income.map((v,i) => v - expense[i]);

const categories = ['Food & Dining','Transport','Shopping','Utilities','Entertainment','Health','Education','Travel'];
const catExpenses = [2400,1200,1800,800,600,450,300,550];
const catBudget   = [2000,1000,2000,900,700,500,400,600];
const catColors   = ['#c5a028','#a8a8a8','#00b894','#e58e26','#d63031','#0984e3','#8b6e1b','#e2c66d'];

const transactions = [
  {date:'2026-04-16',merchant:'Swiggy',category:'food',amount:-640,status:'completed',type:'debit'},
  {date:'2026-04-15',merchant:'Salary Credit',category:'income',amount:12000,status:'completed',type:'credit'},
  {date:'2026-04-15',merchant:'Uber',category:'transport',amount:-280,status:'completed',type:'debit'},
  {date:'2026-04-14',merchant:'Amazon',category:'shopping',amount:-1890,status:'completed',type:'debit'},
  {date:'2026-04-14',merchant:'Netflix',category:'entertainment',amount:-499,status:'completed',type:'debit'},
  {date:'2026-04-13',merchant:'Apollo Pharmacy',category:'health',amount:-340,status:'completed',type:'debit'},
  {date:'2026-04-12',merchant:'BESCOM Bill',category:'utilities',amount:-820,status:'pending',type:'debit'},
  {date:'2026-04-11',merchant:'Zomato',category:'food',amount:-520,status:'completed',type:'debit'},
  {date:'2026-04-11',merchant:'Freelance Income',category:'income',amount:5000,status:'completed',type:'credit'},
  {date:'2026-04-10',merchant:'BigBasket',category:'food',amount:-1240,status:'completed',type:'debit'},
  {date:'2026-04-09',merchant:'Rapido',category:'transport',amount:-90,status:'completed',type:'debit'},
  {date:'2026-04-08',merchant:'Myntra',category:'shopping',amount:-2400,status:'failed',type:'debit'},
  {date:'2026-04-08',merchant:'Gym Membership',category:'health',amount:-999,status:'completed',type:'debit'},
  {date:'2026-04-07',merchant:'Airtel Recharge',category:'utilities',amount:-399,status:'completed',type:'debit'},
  {date:'2026-04-06',merchant:'BookMyShow',category:'entertainment',amount:-760,status:'completed',type:'debit'},
  {date:'2026-04-05',merchant:'Udemy Course',category:'education',amount:-1299,status:'completed',type:'debit'},
  {date:'2026-04-04',merchant:'MakeMyTrip',category:'travel',amount:-4500,status:'pending',type:'debit'},
  {date:'2026-04-03',merchant:'Dividend Income',category:'income',amount:1200,status:'completed',type:'credit'},
  {date:'2026-04-02',merchant:'Pizza Hut',category:'food',amount:-860,status:'completed',type:'debit'},
  {date:'2026-04-01',merchant:'Ola Cabs',category:'transport',amount:-320,status:'completed',type:'debit'},
  {date:'2026-03-31',merchant:'HDFC EMI',category:'utilities',amount:-3500,status:'completed',type:'debit'},
  {date:'2026-03-30',merchant:'Swiggy Instamart',category:'food',amount:-480,status:'completed',type:'debit'},
  {date:'2026-03-29',merchant:'Flipkart',category:'shopping',amount:-3200,status:'completed',type:'debit'},
  {date:'2026-03-28',merchant:'Investment Return',category:'income',amount:2800,status:'completed',type:'credit'},
];

// ── Chart.js Defaults ───────────────────────────────────────
Chart.defaults.font.family = "'Inter', -apple-system, sans-serif";
Chart.defaults.animation.duration = 900;
Chart.defaults.animation.easing = 'easeOutQuart';

function chartDefaults() {
  const t = getThemeColors();
  return {
    grid:  { color: t.grid, drawBorder: false },
    ticks: { color: t.text, font: { size: 11, family: "'Inter', sans-serif" } },
    tooltipBg: t.tooltip,
  };
}

/* ── Custom Tooltip Builder (Fallback/Simple) ──────────────── */
function makeTooltip(prefix = '', suffix = '') {
  const t = getThemeColors();
  const isDark = currentTheme === 'dark';
  return {
    enabled: true,
    backgroundColor: t.tooltip,
    titleColor:  isDark ? '#eef0f6' : '#0d0f1a',
    bodyColor:   isDark ? '#8b95a8' : '#4a5568',
    borderColor: isDark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.08)',
    borderWidth: 1,
    padding: { x: 12, y: 10 },
    cornerRadius: 10,
    displayColors: true,
    boxWidth: 9,
    boxHeight: 9,
    boxPadding: 4,
    titleFont: { size: 11, weight: '600', family: "'Inter', sans-serif" },
    bodyFont:  { size: 12, family: "'Inter', sans-serif" },
    callbacks: {
      title: ctx => ctx[0]?.label || '',
      label: ctx => {
        const v = ctx.parsed.y !== undefined ? ctx.parsed.y : ctx.parsed;
        const formatted = typeof v === 'number'
          ? `${prefix}${Math.abs(v).toLocaleString()}${suffix}`
          : v;
        return `  ${ctx.dataset.label}: ${formatted}`;
      },
    },
  };
}

/* ── Crosshair draw plugin ─────────────────────────────────── */
const crosshairPlugin = {
  id: 'crosshair',
  afterDraw(chart) {
    if (chart._crosshairX == null) return;
    const { ctx, chartArea: { top, bottom } } = chart;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(chart._crosshairX, top);
    ctx.lineTo(chart._crosshairX, bottom);
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = currentTheme === 'dark' ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.14)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  },
  afterEvent(chart, args) {
    if (args.event.type === 'mousemove') {
      chart._crosshairX = args.event.x;
    } else if (args.event.type === 'mouseout') {
      chart._crosshairX = null;
    }
    chart.draw();
  },
};
Chart.register(crosshairPlugin);

/* ── 3D Tilt Interaction (Premium Feel) ────────────────────── */
function applyTiltEffect() {
  document.querySelectorAll('.kpi-card, .chart-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      const dx = x - xc;
      const dy = y - yc;
      card.style.setProperty('--rx', `${dy / -10}deg`);
      card.style.setProperty('--ry', `${dx / 10}deg`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0');
      card.style.setProperty('--ry', '0');
    });
  });
}

/* ── Custom HTML Tooltip (Fintech Grade) ───────────────────── */
const getOrCreateTooltip = (chart) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('div.custom-tooltip');
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.classList.add('custom-tooltip');
    tooltipEl.style.opacity = 0;
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.transition = 'all .1s ease';
    chart.canvas.parentNode.appendChild(tooltipEl);
  }
  return tooltipEl;
};

const externalTooltipHandler = (context) => {
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);

  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map(b => b.lines);

    let innerHtml = '<div class="tooltip-box">';
    titleLines.forEach(title => {
      innerHtml += `<div class="tooltip-header">${title}</div>`;
    });
    
    bodyLines.forEach((body, i) => {
      const colors = tooltip.labelColors[i];
      const span = `<span class="tooltip-dot" style="background:${colors.backgroundColor}"></span>`;
      innerHtml += `<div class="tooltip-row">${span}${body}</div>`;
    });
    innerHtml += '</div>';

    tooltipEl.innerHTML = innerHtml;
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX + tooltip.caretX + 'px';
  tooltipEl.style.top = positionY + tooltip.caretY + 'px';
  tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
};

/* ── Gradient factory ──────────────────────────────────────── */
function makeGradient(ctx, color, h = 280, alpha0 = 0.28, alpha1 = 0) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, color + hex(alpha0));
  g.addColorStop(1, color + hex(alpha1));
  return g;
}
function hex(a) {
  return Math.round(a * 255).toString(16).padStart(2, '0');
}

// ── Sparklines ──────────────────────────────────────────────
function createSparkline(id, data, color) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((_,i) => i),
      datasets: [{ data, borderColor: color, borderWidth: 2, pointRadius: 0, fill: true,
        backgroundColor: ctx2 => {
          const g = ctx2.chart.ctx.createLinearGradient(0,0,0,40);
          g.addColorStop(0, color + '40'); g.addColorStop(1, color + '00'); return g;
        }
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false } }, animation: { duration: 1200 }
    }
  });
}

// ── KPI Animations ──────────────────────────────────────────
function animateValue(id, start, end, prefix, suffix, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  const range = end - start, step = duration / 60;
  let current = start, timer = setInterval(() => {
    current += range / (duration / step);
    if ((range > 0 && current >= end) || (range < 0 && current <= end)) { current = end; clearInterval(timer); }
    el.textContent = prefix + Math.round(current).toLocaleString() + suffix;
  }, step);
}

// ── Health Ring ──────────────────────────────────────────────
function animateHealthRing(score) {
  const ring = document.getElementById('healthRingFill');
  if (!ring) return;
  const circumference = 251;
  const offset = circumference - (score / 100) * circumference;
  setTimeout(() => { ring.style.strokeDashoffset = offset; }, 300);
}

// ── Income vs Expense Chart (Premium) ──────────────────────
let incomeExpenseChart;
function initIncomeExpenseChart() {
  const canvas = document.getElementById('incomeExpenseChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const d = getThemeColors();
  
  const gradInc = makeGradient(ctx, '#00b894', 300, 0.28, 0);
  const gradExp = makeGradient(ctx, '#d63031', 300, 0.18, 0);

  if (incomeExpenseChart) incomeExpenseChart.destroy();
  incomeExpenseChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: income,
          borderColor: '#00b894',
          borderWidth: 3,
          backgroundColor: gradInc,
          fill: true,
          tension: 0.45,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#00b894',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
        },
        /* Glow Layer */
        {
          label: 'Income Ref',
          data: income,
          borderColor: 'rgba(0, 184, 148, 0.2)',
          borderWidth: 10,
          pointRadius: 0,
          fill: false,
          tension: 0.45,
        },
        {
          label: 'Expenses',
          data: expense,
          borderColor: '#d63031',
          borderWidth: 3,
          backgroundColor: gradExp,
          fill: true,
          tension: 0.45,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#d63031',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: false,
          position: 'nearest',
          external: externalTooltipHandler
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: d.text, font: { size: 10, weight: '600' } }
        },
        y: {
          grid: { color: d.grid, drawBorder: false },
          ticks: { 
            color: d.text, 
            font: { size: 10 },
            callback: v => '$' + (v >= 1000 ? (v/1000).toFixed(1) + 'k' : v)
          }
        }
      }
    }
  });
}

// ── Expense Pie Chart (Premium Donut) ───────────────────────
const catColorsPremium = [
  '#c5a028','#a8a8a8','#8b6e1b','#e2c66d','#d4af37',
  '#b8860b','#708090','#c0c0c0',
];
function initExpensePieChart() {
  const canvas = document.getElementById('expensePieChart');
  if (!canvas) return;
  const total = catExpenses.reduce((a, b) => a + b, 0);

  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: categories,
      datasets: [{
        data: catExpenses,
        backgroundColor: catColorsPremium,
        borderWidth: 0,
        hoverOffset: 12,
        borderRadius: 8,
        spacing: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '78%',
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: false,
          external: externalTooltipHandler
        }
      },
      animation: { animateRotate: true, duration: 1500 }
    }
  });

  // Custom legend with percentages
  const legend = document.getElementById('pieLegend');
  if (legend) {
    legend.innerHTML = categories.map((cat, i) => {
      const pct = ((catExpenses[i] / total) * 100).toFixed(0);
      return `<div class="pie-legend-item">
        <span class="pie-legend-dot" style="background:${catColorsPremium[i]}"></span>
        <span class="pie-legend-label">${cat}</span>
        <span class="pie-legend-pct">${pct}%</span>
      </div>`;
    }).join('');
  }
}

// ── Category Bar Chart (Premium Grouped) ───────────────────
function initCategoryBarChart() {
  const canvas = document.getElementById('categoryBarChart');
  if (!canvas) return;
  const d = getThemeColors();
  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: categories.map(c => c.split(' ')[0]),
      datasets: [
        {
          label: 'Budget',
          data: catBudget,
          backgroundColor: 'rgba(99,91,255,.18)',
          borderColor: '#635bff',
          borderWidth: 1.5,
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Actual',
          data: catExpenses,
          backgroundColor: catColorsPremium.map(c => c + 'cc'),
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: false,
          external: externalTooltipHandler
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: d.text, font: { size: 10, weight: '600' } }
        },
        y: {
          grid: { color: d.grid, drawBorder: false },
          ticks: { color: d.text, callback: v => '$' + v }
        }
      }
    }
  });
}

// ── Net Worth Trend Chart ───────────────────────────────────
function initNetWorthChart() {
  const canvas = document.getElementById('netWorthChart');
  if (!canvas) return;
  const d = getThemeColors();
  const netWorth = [68000,70200,71800,69400,73500,77200,75800,80100,84500,82300,87200,91400];

  new Chart(canvas, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Net Worth',
        data: netWorth,
        borderColor: '#635bff',
        borderWidth: 3,
        pointRadius: 0,
        tension: 0.45,
        fill: true,
        backgroundColor: ctx => makeGradient(ctx.chart.ctx, '#635bff', 250, 0.25, 0),
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: false,
          external: externalTooltipHandler
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: d.text } },
        y: {
          grid: { color: d.grid },
          ticks: { color: d.text, callback: v => '$' + (v/1000).toFixed(0) + 'k' }
        }
      }
    }
  });

  const stats = document.getElementById('netWorthStats');
  if (stats) {
    const start = netWorth[0], end = netWorth[11];
    const change = end - start, pct = ((change / start) * 100).toFixed(1);
    stats.innerHTML = `
      <div class="cfr-stat"><div class="cfr-label">Current</div><div class="cfr-val">$${end.toLocaleString()}</div></div>
      <div class="cfr-divider"></div>
      <div class="cfr-stat"><div class="cfr-label">YTD Change</div><div class="cfr-val up">+$${change.toLocaleString()}</div></div>
      <div class="cfr-divider"></div>
      <div class="cfr-stat"><div class="cfr-label">YTD Return</div><div class="cfr-val up">+${pct}%</div></div>
      <div class="cfr-divider"></div>
      <div class="cfr-stat"><div class="cfr-label">Peak</div><div class="cfr-val">$${Math.max(...netWorth).toLocaleString()}</div></div>
    `;
  }
}

// ── Monthly Cash Flow Waterfall ─────────────────────────────
function initCashFlowChart() {
  const canvas = document.getElementById('cashFlowChart');
  if (!canvas) return;
  const d = getThemeColors();
  const netFlow = income.map((v, i) => v - expense[i]);

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{
        label: 'Net Cash Flow',
        data: netFlow,
        backgroundColor: netFlow.map(v => v >= 0 ? 'rgba(0,196,140,.8)' : 'rgba(245,64,64,.8)'),
        borderColor: netFlow.map(v => v >= 0 ? '#00c48c' : '#f54040'),
        borderWidth: 1.5,
        borderRadius: 5,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: false,
          external: externalTooltipHandler
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: d.text } },
        y: { grid: { color: d.grid }, ticks: { color: d.text, callback: v => '$' + (v/1000).toFixed(0) + 'k' } }
      }
    }
  });
}

// ── Prediction Chart ────────────────────────────────────────
function initPredictionChart() {
  const canvas = document.getElementById('predictionChart');
  if (!canvas) return;
  const d = getThemeColors();
  const allLabels = [...months, 'Jan\'27','Feb\'27','Mar\'27'];
  const actualData = [...expense, null, null, null];
  const predData   = [...Array(12).fill(null), 7900, 8300, 8700];
  const confHigh   = [...Array(12).fill(null), 8300, 8900, 9400];
  const confLow    = [...Array(12).fill(null), 7400, 7700, 8000];
  new Chart(canvas, {
    type: 'line',
    data: {
      labels: allLabels,
      datasets: [
        { label: 'Actual', data: actualData, borderColor: '#6366f1', borderWidth: 2, pointRadius: 3, tension: 0.4 },
        { label: 'Predicted', data: predData, borderColor: '#a855f7', borderWidth: 2, borderDash: [6,3], pointRadius: 4, tension: 0.4 },
        { label: 'Upper Bound', data: confHigh, borderColor: 'rgba(168,85,247,.2)', borderWidth: 1, pointRadius: 0, fill: '+1', backgroundColor: 'rgba(168,85,247,.08)' },
        { label: 'Lower Bound', data: confLow, borderColor: 'rgba(168,85,247,.2)', borderWidth: 1, pointRadius: 0, fill: false },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false, external: externalTooltipHandler }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: d.text } },
        y: { grid: { color: d.grid }, ticks: { color: d.text, callback: v => '$' + v } }
      }
    }
  });
}

// ── AI Insights ─────────────────────────────────────────────
const insights = [
  { icon:'Alert', bg:'var(--warning-bg)', title:'Spending spike detected', desc:'Your dining expenses increased 34% vs last month — ₹2,400 above average.', tag:'tag-warning', tagLabel:'Action Needed' },
  { icon:'Tip', bg:'var(--info-bg)', title:'Subscription overlap found', desc:'Netflix & Prime Video active simultaneously. Potential savings of ₹499/month.', tag:'tag-info', tagLabel:'Insight' },
  { icon:'Check', bg:'var(--success-bg)', title:'Savings goal on track', desc:"You're saving 28% of income — 5% above your target. Great discipline!", tag:'tag-success', tagLabel:'On Track' },
  { icon:'Fraud', bg:'var(--danger-bg)', title:'Unusual late-night spend', desc:'₹4,200 transaction at 2:34 AM flagged as potentially fraudulent.', tag:'tag-danger', tagLabel:'Alert' },
  { icon:'Trend', bg:'var(--success-bg)', title:'Investment opportunity', desc:'Based on your cash flow, you can invest ₹15,000 more in mutual funds this month.', tag:'tag-success', tagLabel:'Opportunity' },
];

function renderInsights() {
  const list = document.getElementById('insightsList');
  if (!list) return;
  insights.slice(0,4).forEach((ins, i) => {
    setTimeout(() => {
      list.innerHTML += `<div class="insight-card">
        <div class="insight-icon" style="background:${ins.bg}">${ins.icon}</div>
        <div class="insight-body">
          <div class="insight-title">${ins.title}</div>
          <div class="insight-desc">${ins.desc}</div>
          <span class="insight-tag ${ins.tag}">${ins.tagLabel}</span>
        </div>
      </div>`;
    }, i * 120);
  });
}

// ── Mini Transactions ───────────────────────────────────────
function renderMiniTransactions() {
  const wrap = document.getElementById('miniTransactions');
  if (!wrap) return;
  transactions.slice(0,5).forEach(tx => {
    const isCredit = tx.type === 'credit';
    wrap.innerHTML += `<div class="mini-tx">
      <div class="mini-tx-icon" style="background:var(--surface-2); display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; color:var(--text-3); text-transform:uppercase">${tx.category.substring(0,2)}</div>
      <div class="mini-tx-info">
        <div class="mini-tx-name">${tx.merchant}</div>
        <div class="mini-tx-cat">${tx.date}</div>
      </div>
      <div class="mini-tx-amount ${isCredit?'credit':'debit'}">${isCredit?'+':''} $${Math.abs(tx.amount).toLocaleString()}</div>
    </div>`;
  });
}

// ── Transactions Table ──────────────────────────────────────
let txPage = 1, txPerPage = 10, filteredTx = [...transactions];

function renderTxTable() {
  const body = document.getElementById('txTableBody');
  if (!body) return;
  const start = (txPage-1)*txPerPage, end = start+txPerPage;
  const pageTx = filteredTx.slice(start, end);
  body.innerHTML = pageTx.map(tx => {
    const isCredit = tx.type === 'credit';
    return `<tr>
      <td>${tx.date}</td>
      <td><span style="display:flex;align-items:center;gap:8px">${tx.merchant}</span></td>
      <td><span class="category-tag">${tx.category}</span></td>
      <td class="${isCredit?'amount-credit':'amount-debit'}">${isCredit?'+':'-'}$${Math.abs(tx.amount).toLocaleString()}</td>
      <td><span class="status-badge status-${tx.status}">${tx.status}</span></td>
      <td><span class="category-tag">${isCredit?'Credit':'Debit'}</span></td>
    </tr>`;
  }).join('');
  const pInfo = document.getElementById('paginationInfo');
  if(pInfo) pInfo.textContent = `Showing ${start+1}–${Math.min(end,filteredTx.length)} of ${filteredTx.length}`;
  const pInd = document.getElementById('pageIndicator');
  if(pInd) pInd.textContent = `${txPage} / ${Math.ceil(filteredTx.length/txPerPage)}`;
}

function filterTransactions() {
  const q = document.getElementById('txSearch').value.toLowerCase();
  const cat = document.getElementById('txFilter').value;
  const status = document.getElementById('txStatusFilter').value;
  filteredTx = transactions.filter(tx =>
    (cat === 'all' || tx.category === cat) &&
    (status === 'all' || tx.status === status) &&
    (tx.merchant.toLowerCase().includes(q) || tx.category.includes(q))
  );
  txPage = 1;
  renderTxTable();
}

// ── Init Dashboard ──────────────────────────────────────────
function initDashboard() {
  const loader = document.getElementById('skeletonLoader');
  if (loader) loader.classList.add('active');
  
  setTimeout(() => {
    if (loader) loader.classList.remove('active');
    
    // Call 3D Interaction activation
    applyTiltEffect();

    animateValue('kpiBalance', 0, 84320, '$', '', 1200);
    animateValue('kpiIncome', 0, 12000, '$', '', 1000);
    animateValue('kpiExpenses', 0, 8640, '$', '', 1000);
    animateValue('kpiSavings', 0, 28, '', '%', 1000);
    animateValue('healthScore', 0, 87, '', '', 1400);
    animateHealthRing(87);

    createSparkline('sparkline1', [72,68,74,80,78,82,88,84,90,88,92,96], '#635bff');
    createSparkline('sparkline2', [82,88,91,86,94,102,98,105,112,108,116,120], '#00c48c');
    createSparkline('sparkline3', [58,62,56,68,71,64,76,69,72,78,66,81], '#f54040');
    createSparkline('sparkline4', [18,22,28,20,26,36,24,34,38,30,48,44], '#f59e0b');

    initIncomeExpenseChart();
    initExpensePieChart();
    initCategoryBarChart();
    initPredictionChart();
    initNetWorthChart();
    initCashFlowChart();
    renderInsights();
    renderMiniTransactions();
    renderTxTable();
  }, 1200);
}

// ── Live Ticker Strip ────────────────────────────────────────
function initTickerStrip() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  const tickers = [
    { name: 'SENSEX',  val: '74,281', chg: '+0.62%', up: true },
    { name: 'NIFTY 50',val: '22,513', chg: '+0.54%', up: true },
    { name: 'BTC/USD',  val: '$64,820', chg: '+2.14%', up: true },
    { name: 'GOLD',     val: '$2,338', chg: '-0.22%', up: false },
    { name: 'USD/INR',  val: '83.48',  chg: '+0.08%', up: true },
    { name: 'CRUDE OIL',val: '$82.14', chg: '-1.03%', up: false },
  ];
  const allTickers = [...tickers, ...tickers, ...tickers];
  track.innerHTML = allTickers.map(t => `
    <div class="ticker-item">
      <span class="ticker-name">${t.name}</span>
      <span class="ticker-val">${t.val}</span>
      <span class="ticker-chg ${t.up ? 'up' : 'down'}">${t.chg}</span>
    </div>
  `).join('');
  
  // Market Fluctuations
  setInterval(() => {
    document.querySelectorAll('.ticker-val').forEach(el => {
      if (Math.random() > 0.7) {
        const val = parseFloat(el.textContent.replace(/[$,₹,]/g, ''));
        const noise = (Math.random() - 0.5) * (val * 0.001);
        const newVal = val + noise;
        el.textContent = (el.textContent.includes('$') ? '$' : el.textContent.includes('₹') ? '₹' : '') + 
                         newVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    });
  }, 3000);
}

// ── Boot ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTickerStrip();
  initDashboard();

  // Transaction filter events
  const txSearch = document.getElementById('txSearch');
  const txFilter = document.getElementById('txFilter');
  const txStatusFilter = document.getElementById('txStatusFilter');
  if (txSearch) txSearch.addEventListener('input', filterTransactions);
  if (txFilter) txFilter.addEventListener('change', filterTransactions);
  if (txStatusFilter) txStatusFilter.addEventListener('change', filterTransactions);

  // Pagination
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  if (prevBtn) prevBtn.addEventListener('click', () => { if (txPage > 1) { txPage--; renderTxTable(); } });
  if (nextBtn) nextBtn.addEventListener('click', () => { if (txPage < Math.ceil(filteredTx.length / txPerPage)) { txPage++; renderTxTable(); } });

  // Export CSV
  const exportBtn = document.getElementById('exportTxBtn');
  if (exportBtn) exportBtn.addEventListener('click', () => {
    const rows = [['Date','Merchant','Category','Amount','Status','Type']];
    filteredTx.forEach(tx => rows.push([tx.date, tx.merchant, tx.category, tx.amount, tx.status, tx.type]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv,' + encodeURIComponent(csv);
    a.download = 'transactions.csv';
    a.click();
  });
});


// ── Ripple Effect ─────────────────────────────────────────────
function addRipple(btn) {
  if (btn.dataset.ripple) return;
  btn.dataset.ripple = '1';
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    const el = document.createElement('span');
    el.style.cssText = `position:absolute;border-radius:50%;pointer-events:none;width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px;
      background:rgba(255,255,255,0.15);transform:scale(0);animation:rippleAnim 0.5s ease-out forwards`;
    this.appendChild(el);
    setTimeout(() => el.remove(), 600);
  });
}
function applyRipples() { document.querySelectorAll('.btn-primary, .chart-btn').forEach(addRipple); }

// ── Stagger KPI Cards ─────────────────────────────────────────
function staggerCards() {
  document.querySelectorAll('.kpi-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(15px)';
    setTimeout(() => {
      card.style.transition = 'all 0.5s ease-out';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 + i * 80);
  });
}

function updateChartsTheme() {
  if (typeof Chart === 'undefined') return;
  Chart.instances && Object.values(Chart.instances).forEach(chart => {
    const d = getThemeColors();
    if (chart.options.scales?.x) { chart.options.scales.x.grid.color = d.grid; chart.options.scales.x.ticks.color = d.text; }
    if (chart.options.scales?.y) { chart.options.scales.y.grid.color = d.grid; chart.options.scales.y.ticks.color = d.text; }
    chart.update('none');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => { staggerCards(); applyRipples(); }, 1500);
});

// ══════════════════════════════════════════════════════
//  ANALYTICS PAGE
// ══════════════════════════════════════════════════════
let analyticsInited = false;
function initAnalyticsPage() {
  if (analyticsInited) return;
  analyticsInited = true;
  const d = getThemeColors();

  // 1. Annual Financial Overview (grouped bar)
  const annualCtx = document.getElementById('analyticsOverview');
  if (annualCtx) {
    new Chart(annualCtx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          { label: 'Income',   data: income,  backgroundColor: 'rgba(197,160,40,.75)', borderRadius: 4, borderSkipped: false },
          { label: 'Expenses', data: expense, backgroundColor: 'rgba(214,48,49,.65)', borderRadius: 4, borderSkipped: false },
          { label: 'Savings',  data: savings, backgroundColor: 'rgba(0,184,148,.65)', borderRadius: 4, borderSkipped: false },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false }, tooltip: { enabled: false, external: externalTooltipHandler } },
        scales: {
          x: { grid: { display: false }, ticks: { color: d.text } },
          y: { grid: { color: d.grid }, ticks: { color: d.text, callback: v => '$' + (v/1000).toFixed(0) + 'k' } }
        }
      }
    });
  }

  // 2. Savings Trend (area line)
  const savingsCtx = document.getElementById('savingsTrend');
  if (savingsCtx) {
    const ctx2d = savingsCtx.getContext('2d');
    const grad = makeGradient(ctx2d, '#00b894', 220, 0.3, 0);
    new Chart(savingsCtx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{ label: 'Savings', data: savings, borderColor: '#00b894', borderWidth: 2.5,
          backgroundColor: grad, fill: true, tension: 0.45, pointRadius: 3,
          pointHoverRadius: 6, pointBackgroundColor: '#00b894' }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false, external: externalTooltipHandler } },
        scales: {
          x: { grid: { display: false }, ticks: { color: d.text } },
          y: { grid: { color: d.grid }, ticks: { color: d.text, callback: v => '$' + (v/1000).toFixed(1) + 'k' } }
        }
      }
    });
  }

  // 3. Expense Heatmap
  const heatWrap = document.getElementById('heatmapWrap');
  if (heatWrap) {
    heatWrap.innerHTML = '';
    const maxVal = Math.max(...expense);
    months.forEach((m, i) => {
      const intensity = expense[i] / maxVal;
      const alpha = (0.15 + intensity * 0.75).toFixed(2);
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      cell.style.background = `rgba(197,160,40,${alpha})`;
      cell.setAttribute('data-tip', `${m}: $${expense[i].toLocaleString()}`);
      heatWrap.appendChild(cell);
    });
  }

  // 4. Category Deep Dive (horizontal bar)
  const catDeepCtx = document.getElementById('categoryDeepDive');
  if (catDeepCtx) {
    new Chart(catDeepCtx, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [
          { label: 'Spent',  data: catExpenses, backgroundColor: catColorsPremium.map(c => c + 'cc'), borderRadius: 4, borderSkipped: false },
          { label: 'Budget', data: catBudget,   backgroundColor: 'rgba(255,255,255,.06)', borderColor: 'rgba(255,255,255,.2)', borderWidth: 1, borderRadius: 4, borderSkipped: false },
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false }, tooltip: { enabled: false, external: externalTooltipHandler } },
        scales: {
          x: { grid: { color: d.grid }, ticks: { color: d.text, callback: v => '$' + v } },
          y: { grid: { display: false }, ticks: { color: d.text } }
        }
      }
    });
  }
}

// ══════════════════════════════════════════════════════
//  AI INSIGHTS PAGE
// ══════════════════════════════════════════════════════
let aiInsightsInited = false;
function initAIInsightsPage() {
  if (aiInsightsInited) return;
  aiInsightsInited = true;

  const insightsPageData = [
    { icon: 'Alert', title: 'Dining Spike', desc: 'Dining expenses increased 34% vs last month. ₹2,400 above your average.', val: '+34%', valColor: 'var(--danger)' },
    { icon: 'Tip', title: 'Subscription Overlap', desc: 'Netflix & Prime simultaneously active. Save ₹499/month by consolidating.', val: '-₹499', valColor: 'var(--success)' },
    { icon: 'Check', title: 'Savings on Track', desc: "Saving 28% of income — 5% above your target. Excellent financial discipline!", val: '28%', valColor: 'var(--success)' },
    { icon: 'Fraud', title: 'Late Night Transaction', desc: '₹4,200 transaction at 2:34 AM flagged as potentially fraudulent activity.', val: 'Alert', valColor: 'var(--danger)' },
    { icon: 'Trend', title: 'Investment Opportunity', desc: 'Cash flow surplus of ₹15,000 could be invested in mutual funds this month.', val: '+₹15k', valColor: 'var(--indigo)' },
    { icon: 'Goal', title: 'Emergency Fund', desc: 'Emergency fund target is 91% complete — just ₹8,100 away from the goal!', val: '91%', valColor: 'var(--success)' },
  ];

  const grid = document.getElementById('insightsPageGrid');
  if (grid) {
    grid.innerHTML = insightsPageData.map((ins, i) => `
      <div class="insight-page-card" style="animation-delay:${i*80}ms">
        <span class="insight-page-icon">${ins.icon}</span>
        <div class="insight-page-title">${ins.title}</div>
        <div class="insight-page-desc">${ins.desc}</div>
        <div class="insight-page-val" style="color:${ins.valColor}">${ins.val}</div>
      </div>`).join('');
  }

  const recs = [
    { icon: 'SIP', title: 'Increase SIP by ₹5,000', desc: 'Based on your cash flow, bumping your SIP can accelerate wealth by 22% over 5 years.' },
    { icon: 'Cut', title: 'Cut subscriptions', desc: 'You have 6 active subscriptions. Cancelling 2 unused ones saves ₹999/month.' },
    { icon: 'Bank', title: 'High-yield savings', desc: 'Move ₹20,000 idle cash to a liquid fund earning 7.2% vs your 3.5% savings account.' },
  ];
  const recGrid = document.getElementById('recommendationsGrid');
  if (recGrid) {
    recGrid.innerHTML = recs.map(r => `
      <div class="rec-card">
        <div class="rec-icon">${r.icon}</div>
        <div><div class="rec-title">${r.title}</div><div class="rec-desc">${r.desc}</div></div>
      </div>`).join('');
  }

  // AI Predictive Chart
  const aiPredCtx = document.getElementById('aiPredictChart');
  if (aiPredCtx) {
    const d = getThemeColors();
    const allLabels = [...months, "Jan'27", "Feb'27", "Mar'27", "Apr'27", "May'27", "Jun'27"];
    const actualData   = [...income.map((v,i) => v - expense[i]), null, null, null, null, null, null];
    const predData     = [...Array(12).fill(null), 3900, 4200, 4600, 4900, 5100, 5400];
    const confHigh     = [...Array(12).fill(null), 4400, 4800, 5200, 5500, 5700, 6000];
    const confLow      = [...Array(12).fill(null), 3400, 3600, 4000, 4300, 4500, 4800];
    new Chart(aiPredCtx, {
      type: 'line',
      data: {
        labels: allLabels,
        datasets: [
          { label: 'Actual Savings',  data: actualData, borderColor: '#c5a028', borderWidth: 2.5, pointRadius: 3, tension: 0.4, pointBackgroundColor: '#c5a028' },
          { label: 'AI Prediction',   data: predData,   borderColor: '#a8a8a8', borderWidth: 2, borderDash: [6,3], pointRadius: 4, tension: 0.4, pointBackgroundColor: '#a8a8a8' },
          { label: 'Upper Bound',     data: confHigh,   borderColor: 'rgba(168,168,168,.2)', borderWidth: 1, pointRadius: 0, fill: '+1', backgroundColor: 'rgba(168,168,168,.08)' },
          { label: 'Lower Bound',     data: confLow,    borderColor: 'rgba(168,168,168,.2)', borderWidth: 1, pointRadius: 0, fill: false },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false }, tooltip: { enabled: false, external: externalTooltipHandler } },
        scales: {
          x: { grid: { display: false }, ticks: { color: d.text, maxTicksLimit: 10 } },
          y: { grid: { color: d.grid }, ticks: { color: d.text, callback: v => '$' + (v/1000).toFixed(1) + 'k' } }
        }
      }
    });
  }
}

// ══════════════════════════════════════════════════════
//  CREDIT RISK PAGE
// ══════════════════════════════════════════════════════
let creditRiskInited = false;
function initCreditRiskPage() {
  if (creditRiskInited) return;
  creditRiskInited = true;

  // Chart.js doughnut gauge for credit score 742
  const gaugeCtx = document.getElementById('creditGaugeChart');
  if (gaugeCtx) {
    const score = 742, minS = 300, maxS = 900;
    const filled = score - minS;
    const empty  = maxS - score;
    new Chart(gaugeCtx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [filled, empty],
          backgroundColor: ['#00b894', 'rgba(255,255,255,0.06)'],
          borderWidth: 0,
          circumference: 180,
          rotation: 270,
        }]
      },
      options: {
        responsive: false,
        cutout: '78%',
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        animation: { animateRotate: true, duration: 1600 }
      }
    });
    // Animate the score number
    const numEl = document.getElementById('creditScoreNum');
    if (numEl) {
      let cur = 300;
      const step = setInterval(() => {
        cur += 8;
        if (cur >= score) { cur = score; clearInterval(step); }
        numEl.textContent = cur;
      }, 20);
    }
  }

  // Risk factor bars
  const factors = [
    { label: 'Payment History',    pct: 87, color: '#00b894', val: 'Excellent' },
    { label: 'Credit Utilization', pct: 24, color: '#00b894', val: '24%' },
    { label: 'Credit Age',         pct: 62, color: '#e58e26', val: '5.2 yrs' },
    { label: 'Credit Mix',         pct: 70, color: '#0984e3', val: 'Good' },
    { label: 'New Inquiries',      pct: 15, color: '#d63031', val: '2 recent' },
  ];
  const factorsList = document.getElementById('riskFactors');
  if (factorsList) {
    factorsList.innerHTML = factors.map(f => `
      <div class="risk-factor">
        <div class="risk-factor-label">${f.label}</div>
        <div class="risk-bar"><div class="risk-bar-fill" style="width:${f.pct}%;background:${f.color}"></div></div>
        <div class="risk-factor-val">${f.val}</div>
      </div>`).join('');
  }

  // Credit Score History Chart
  const histCtx = document.getElementById('creditHistoryChart');
  if (histCtx) {
    const d = getThemeColors();
    const scoreHistory = [698, 705, 712, 708, 718, 722, 716, 728, 733, 738, 735, 742];
    const ctx2d = histCtx.getContext('2d');
    const grad = makeGradient(ctx2d, '#c5a028', 180, 0.25, 0);
    new Chart(histCtx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Credit Score',
          data: scoreHistory,
          borderColor: '#c5a028',
          borderWidth: 2.5,
          backgroundColor: grad,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: '#c5a028',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false }, tooltip: { enabled: false, external: externalTooltipHandler } },
        scales: {
          x: { grid: { display: false }, ticks: { color: d.text } },
          y: {
            grid: { color: d.grid },
            ticks: { color: d.text },
            min: 680, max: 760,
            title: { display: false }
          }
        }
      }
    });
  }

  // Improvement tips
  const tips = [
    { icon: 'Tip', text: '<strong>Keep utilization below 30%.</strong> Currently at 24% — excellent range.' },
    { icon: 'Card', text: '<strong>Keep old accounts open.</strong> Your oldest card (8 years) boosts your score.' },
    { icon: 'Schedule', text: '<strong>Pay all bills on time.</strong> One late payment can drop your score by 50+ pts.' },
    { icon: 'Limit', text: '<strong>Limit hard inquiries.</strong> Two recent pulls detected — wait 6 months before applying.' },
  ];
  const tipsList = document.getElementById('scoreTips');
  if (tipsList) {
    tipsList.innerHTML = tips.map(t => `
      <div class="tip-item">
        <span class="tip-icon">${t.icon}</span>
        <span class="tip-text">${t.text}</span>
      </div>`).join('');
  }
}

// ══════════════════════════════════════════════════════
//  FRAUD DETECTION PAGE
// ══════════════════════════════════════════════════════
let fraudInited = false;
function initFraudPage() {
  if (fraudInited) return;
  fraudInited = true;
  const d = getThemeColors();

  // Anomaly score time-series chart
  const fraudCtx = document.getElementById('fraudChart');
  if (fraudCtx) {
    const labels = Array.from({ length: 30 }, (_, i) => `Apr ${i + 1}`);
    const anomaly = labels.map(() => +(Math.random() * 30 + 5).toFixed(1));
    anomaly[4]  = 88.2;
    anomaly[18] = 76.5;
    const ctx2d = fraudCtx.getContext('2d');
    const grad = ctx2d.createLinearGradient(0, 0, 0, 200);
    grad.addColorStop(0, 'rgba(214,48,49,0.3)');
    grad.addColorStop(1, 'rgba(214,48,49,0)');
    new Chart(fraudCtx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Anomaly Score',
          data: anomaly,
          borderColor: '#d63031',
          borderWidth: 2,
          backgroundColor: grad,
          fill: true,
          tension: 0.4,
          pointRadius: anomaly.map(v => v > 70 ? 5 : 0),
          pointBackgroundColor: '#d63031',
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false, external: externalTooltipHandler } },
        scales: {
          x: { grid: { display: false }, ticks: { color: d.text, maxTicksLimit: 8 } },
          y: { grid: { color: d.grid }, ticks: { color: d.text }, min: 0, max: 100 }
        }
      }
    });
  }

  // Suspicious transactions table
  const suspTable = document.getElementById('fraudTableBody');
  if (suspTable) {
    const suspTx = [
      { time: '2:34 AM',  merchant: 'Unknown Merchant',   amount: 12400, score: 94, level: 'high',   location: 'Unknown VPN' },
      { time: '11:58 PM', merchant: 'International Wire', amount: 8200,  score: 81, level: 'high',   location: 'Lagos, NG' },
      { time: '3:10 AM',  merchant: 'Crypto Exchange',    amount: 5500,  score: 73, level: 'medium', location: 'Singapore' },
      { time: '9:45 PM',  merchant: 'Unfamiliar ATM',     amount: 3000,  score: 55, level: 'medium', location: 'Mumbai ATM' },
      { time: '6:22 AM',  merchant: 'Online Gaming',      amount: 1900,  score: 42, level: 'medium', location: 'Online' },
    ];
    suspTable.innerHTML = suspTx.map(tx => `
      <tr>
        <td>${tx.time}</td>
        <td>${tx.merchant}</td>
        <td class="amount-debit">-₹${tx.amount.toLocaleString()}</td>
        <td>
          <div class="risk-score-cell">
            <div class="risk-score-bar">
              <div class="risk-score-fill rs-${tx.level}" style="width:${tx.score}%"></div>
            </div>
            <span style="font-size:.78rem;font-weight:700;color:${tx.level==='high'?'var(--danger)':'var(--warning)'}">${tx.score}</span>
          </div>
        </td>
        <td>${tx.location}</td>
        <td><button style="padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--text-2);font-size:.74rem;cursor:pointer;font-family:var(--font)">Review</button></td>
      </tr>`).join('');
  }

  // Populate fraud stat cards into fraudStats container
  const statsWrap = document.getElementById('fraudStats');
  if (statsWrap) {
    const stats = [
      { label: 'Blocked Amount', val: '₹89,200' },
      { label: 'Transactions Reviewed', val: '247' },
      { label: 'Total Protected', val: '₹12.4L' },
      { label: 'Detection Accuracy', val: '98.7%' },
    ];
    statsWrap.innerHTML = stats.map(s => `
      <div class="fraud-stat-card">
        <div class="fraud-stat-label">${s.label}</div>
        <div class="fraud-stat-val">${s.val}</div>
      </div>`).join('');
  }

  // Populate active fraud alerts
  const alertsGrid = document.getElementById('fraudAlertsGrid');
  if (alertsGrid) {
    const alerts = [
      { level: 'high',   icon: 'Alert', title: 'Unusual Geographic Location', desc: 'Transaction attempted from Lagos, Nigeria — 8,400 km from your usual location. Flagged for review.' },
      { level: 'high',   icon: 'Warning', title: 'Late-Night Large Transaction', desc: '₹12,400 charged at 2:34 AM to an unknown merchant via VPN. Auto-blocked pending verification.' },
      { level: 'medium', icon: 'Debit', title: 'Multiple Failed Attempts', desc: '5 consecutive failed PIN attempts on your card ending in 4821 detected at 11:58 PM.' },
      { level: 'medium', icon: 'Key', title: 'New Device Login', desc: 'Account accessed from an unrecognised device (Windows 11 / Chrome) in Singapore.' },
    ];
    alertsGrid.innerHTML = alerts.map(a => `
      <div class="fraud-alert-card ${a.level}">
        <div class="fraud-alert-icon">${a.icon}</div>
        <div>
          <div class="fraud-alert-title">${a.title}</div>
          <div class="fraud-alert-desc">${a.desc}</div>
          <div class="fraud-alert-time">Detected just now</div>
        </div>
      </div>`).join('');
  }
}

// ══════════════════════════════════════════════════════
//  SETTINGS PAGE
// ══════════════════════════════════════════════════════
let settingsInited = false;
function initSettingsPage() {
  if (settingsInited) return;
  settingsInited = true;

  // 1. Tab Switching
  const navItems = document.querySelectorAll('.settings-nav-item');
  const sections = document.querySelectorAll('.settings-section');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = item.dataset.setting;

      // Update nav active state
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Update section visibility
      sections.forEach(sec => {
        if (sec.id === `settings-${target}`) {
          sec.style.display = 'block';
        } else {
          sec.style.display = 'none';
        }
      });
    });
  });

  // 2. Profile Save Changes
  const saveBtn = document.getElementById('saveProfileBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const originalText = saveBtn.textContent;
      saveBtn.disabled = true;
      saveBtn.innerHTML = `Saving...`;

      // Mock API call delay
      setTimeout(() => {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Changes Saved!';
        saveBtn.style.background = 'var(--success)';

        // Update UI names if they changed
        const fname = document.getElementById('prof-fname').value;
        const lname = document.getElementById('prof-lname').value;
        const fullName = `${fname} ${lname}`;

        // Update topbar subtitle
        const sub = document.getElementById('pageSubtitle');
        if (sub && sub.textContent.includes('Welcome back')) {
          sub.textContent = `Welcome back, ${fname}`;
        }

        // Update dropdown and sidebar names
        document.querySelectorAll('.user-name-sm, .dropdown-name').forEach(el => {
          el.textContent = fullName;
        });

        // Show a temporary toast (optional extra polish)
        showNotification('Profile saved successfully');

        // Reset button after 3 seconds
        setTimeout(() => {
          saveBtn.textContent = originalText;
          saveBtn.style.background = '';
        }, 3000);
      }, 1200);
    });
  }
}

function showNotification(text) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px;
    background: var(--surface-2); border: 1px solid var(--border-2);
    padding: 12px 20px; border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    color: var(--text); font-size: 0.85rem; font-weight: 600;
    z-index: 9999; animation: slideUpFadeIn 0.4s ease both;
    backdrop-filter: blur(12px);
  `;
  toast.innerHTML = text;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideDownFadeOut 0.4s ease both';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// Add animations for toast if not in CSS
if (!document.getElementById('toast-anim')) {
  const style = document.createElement('style');
  style.id = 'toast-anim';
  style.textContent = `
    @keyframes slideUpFadeIn {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideDownFadeOut {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(20px); opacity: 0; }
    }
    @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  `;
  document.head.appendChild(style);
}
