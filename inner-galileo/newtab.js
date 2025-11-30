// Constants
const FINNHUB_BASE = 'https://finnhub.io/api/v1';
const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

// DOM Elements
const currentDateEl = document.getElementById('current-date');
const marketStatusEl = document.getElementById('market-status');
const watchlistContainer = document.getElementById('watchlist-container');
const manageBtn = document.getElementById('manage-btn');
const chartSpy = document.getElementById('chart-spy');
const chartQqq = document.getElementById('chart-qqq');

// State
let assets = [];
let finnhubKey = '';

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    updateDate();
    try {
        await loadSettings();
    } catch (e) {
        console.error('Settings load failed:', e);
    }

    // Parallel execution for speed
    Promise.all([
        fetchMarketStatus(),
        fetchWatchlist(),
        fetchChartData('SPY', chartSpy),
        fetchChartData('QQQ', chartQqq)
    ]);

    manageBtn.addEventListener('click', () => {
        alert('Please click the extension icon in the toolbar to manage your assets.');
    });
});

function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateEl.textContent = now.toLocaleDateString('en-US', options);
}

// Non-async function returning a Promise to avoid any await syntax issues
function loadSettings() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['assets', 'finnhubKey'], (result) => {
            if (chrome.runtime.lastError) {
                console.error('Storage error:', chrome.runtime.lastError);
                assets = [];
                finnhubKey = '';
            } else {
                assets = result.assets || [];
                finnhubKey = result.finnhubKey || '';
            }
            resolve();
        });
    });
}

async function fetchMarketStatus() {
    if (!finnhubKey) {
        marketStatusEl.innerHTML = '<span style="color: #f44336">API Key Missing</span>';
        return;
    }

    marketStatusEl.innerHTML = '<div class="loading-status">Loading Global Markets...</div>';

    const exchanges = [
        { code: 'US', name: '🇺🇸 US' },
        { code: 'L', name: '🇬🇧 UK' }, // London
        { code: 'T', name: '🇯🇵 JP' }, // Tokyo
        { code: 'HK', name: '🇭🇰 HK' }, // Hong Kong
        { code: 'F', name: '🇩🇪 DE' }  // Frankfurt
    ];

    try {
        const promises = exchanges.map(ex =>
            fetch(`${FINNHUB_BASE}/stock/market-status?exchange=${ex.code}&token=${finnhubKey}`)
                .then(res => res.json())
                .then(data => ({ ...ex, isOpen: data.isOpen }))
                .catch(err => ({ ...ex, error: true }))
        );

        const results = await Promise.all(promises);

        marketStatusEl.innerHTML = ''; // Clear loading

        results.forEach(market => {
            let statusClass = 'closed';
            let statusText = 'Closed';

            if (market.error) {
                statusClass = 'error';
                statusText = '?';
            } else if (market.isOpen) {
                statusClass = 'open';
                statusText = 'Open';
            }

            const el = document.createElement('div');
            el.className = 'status-item';
            el.innerHTML = `
                <div class="status-dot ${statusClass}"></div>
                <span>${market.name}</span>
            `;
            marketStatusEl.appendChild(el);
        });

    } catch (error) {
        console.error('Error fetching market status:', error);
        marketStatusEl.textContent = 'Status Unavailable';
    }
}

async function fetchWatchlist() {
    if (assets.length === 0) {
        watchlistContainer.innerHTML = '<div style="text-align:center; color:#666; margin-top: 20px;">No assets in watchlist.<br>Add some via the extension popup!</div>';
        return;
    }

    watchlistContainer.innerHTML = '<div class="loading">Updating prices...</div>';

    const cryptoIds = assets.filter(a => a.type === 'crypto').map(a => a.symbol.toLowerCase()).join(',');
    const stocks = assets.filter(a => a.type === 'stock');

    let cryptoData = {};
    let stockData = {};

    // Fetch Crypto
    if (cryptoIds) {
        try {
            const response = await fetch(`${COINGECKO_BASE}/simple/price?ids=${cryptoIds}&vs_currencies=usd&include_24hr_change=true`);
            cryptoData = await response.json();
        } catch (e) { console.error(e); }
    }

    // Fetch Stocks
    if (stocks.length > 0 && finnhubKey) {
        for (const stock of stocks) {
            try {
                const response = await fetch(`${FINNHUB_BASE}/quote?symbol=${stock.symbol}&token=${finnhubKey}`);
                const data = await response.json();
                if (data.c) {
                    stockData[stock.symbol] = { usd: data.c, usd_24h_change: data.dp };
                }
            } catch (e) { console.error(e); }
        }
    }

    renderWatchlist(cryptoData, stockData);
}

function renderWatchlist(cryptoData, stockData) {
    watchlistContainer.innerHTML = '';

    assets.forEach(asset => {
        let price = '---';
        let change = 0;
        let hasData = false;

        if (asset.type === 'crypto') {
            const data = cryptoData[asset.symbol.toLowerCase()];
            if (data) {
                price = `$${data.usd.toLocaleString()}`;
                change = data.usd_24h_change;
                hasData = true;
            }
        } else if (asset.type === 'stock') {
            const data = stockData[asset.symbol];
            if (data) {
                price = `$${data.usd.toFixed(2)}`;
                change = data.usd_24h_change;
                hasData = true;
            }
        }

        const changeClass = change >= 0 ? 'positive' : 'negative';
        const changeSign = change >= 0 ? '+' : '';
        const changeText = hasData ? `${changeSign}${change.toFixed(2)}%` : '';

        const el = document.createElement('div');
        el.className = 'asset-item';
        el.innerHTML = `
            <div class="asset-info">
                <span class="asset-symbol">${asset.symbol.toUpperCase()}</span>
                <span class="asset-name">${asset.type}</span>
            </div>
            <div class="asset-price-info">
                <div class="asset-price">${price}</div>
                <div class="asset-change ${changeClass}">${changeText}</div>
            </div>
        `;
        watchlistContainer.appendChild(el);
    });
}

// Simple SVG Chart Implementation
async function fetchChartData(symbol, container) {
    if (!finnhubKey) {
        container.innerHTML = '<div class="loading-chart">API Key Missing</div>';
        return;
    }

    try {
        // Get candles for the last 30 days (daily resolution 'D')
        const end = Math.floor(Date.now() / 1000);
        const start = end - (30 * 24 * 60 * 60);

        const response = await fetch(`${FINNHUB_BASE}/stock/candle?symbol=${symbol}&resolution=D&from=${start}&to=${end}&token=${finnhubKey}`);
        const data = await response.json();

        if (data.s === 'ok') {
            renderChart(data.c, container, data.dp ? data.dp : null); // data.c is close prices
        } else {
            container.innerHTML = '<div class="loading-chart">No Data</div>';
        }
    } catch (error) {
        console.error('Chart error:', error);
        container.innerHTML = '<div class="loading-chart">Error Loading Chart</div>';
    }
}

function renderChart(prices, container, percentChange) {
    if (!prices || prices.length < 2) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const padding = 10;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice;

    // Determine color based on trend (first vs last)
    const isPositive = prices[prices.length - 1] >= prices[0];
    const color = isPositive ? '#4caf50' : '#f44336';

    // Generate Path
    let pathD = `M 0 ${height - ((prices[0] - minPrice) / range * (height - 2 * padding) + padding)}`;

    const stepX = width / (prices.length - 1);

    prices.forEach((price, index) => {
        const x = index * stepX;
        const y = height - ((price - minPrice) / range * (height - 2 * padding) + padding);
        pathD += ` L ${x} ${y}`;
    });

    // Area Path (close the loop)
    const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

    const svg = `
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="grad-${container.id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:0.2" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0" />
        </linearGradient>
      </defs>
      <path d="${areaD}" fill="url(#grad-${container.id})" />
      <path d="${pathD}" stroke="${color}" fill="none" stroke-width="2" vector-effect="non-scaling-stroke" />
    </svg>
  `;

    container.innerHTML = svg;
}
