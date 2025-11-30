const defaultAssets = [
    { symbol: 'bitcoin', type: 'crypto', name: 'Bitcoin' },
    { symbol: 'ethereum', type: 'crypto', name: 'Ethereum' },
    { symbol: 'AAPL', type: 'stock', name: 'Apple Inc.' }
];

let assets = [];
let finnhubKey = '';

// DOM Elements
const assetsList = document.getElementById('assets-list');
const newSymbolInput = document.getElementById('new-symbol');
const assetTypeSelect = document.getElementById('asset-type');
const addBtn = document.getElementById('add-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const finnhubKeyInput = document.getElementById('finnhub-key');
const saveSettingsBtn = document.getElementById('save-settings');
const closeSettingsBtn = document.getElementById('close-settings');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    renderAssets(); // Render immediately with loading state or cached data if we had it (not implemented yet)
    fetchPrices();
});

// Event Listeners
addBtn.addEventListener('click', addAsset);
settingsBtn.addEventListener('click', () => settingsPanel.classList.remove('hidden'));
closeSettingsBtn.addEventListener('click', () => settingsPanel.classList.add('hidden'));
saveSettingsBtn.addEventListener('click', saveSettings);

async function loadSettings() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['assets', 'finnhubKey'], (result) => {
            assets = result.assets || defaultAssets;
            finnhubKey = result.finnhubKey || '';
            finnhubKeyInput.value = finnhubKey;
            resolve();
        });
    });
}

function saveAssets() {
    chrome.storage.sync.set({ assets });
}

function saveSettings() {
    finnhubKey = finnhubKeyInput.value.trim();
    chrome.storage.sync.set({ finnhubKey }, () => {
        settingsPanel.classList.add('hidden');
        fetchPrices(); // Refetch with new key
    });
}

async function addAsset() {
    const symbol = newSymbolInput.value.trim();
    const type = assetTypeSelect.value;

    if (!symbol) return;

    // Basic duplicate check
    if (assets.some(a => a.symbol.toLowerCase() === symbol.toLowerCase())) {
        alert('Asset already exists');
        return;
    }

    assets.push({ symbol, type, name: symbol.toUpperCase() }); // Name will be updated on fetch if possible
    saveAssets();
    newSymbolInput.value = '';
    renderAssets();
    fetchPrices();
}

function removeAsset(index) {
    assets.splice(index, 1);
    saveAssets();
    renderAssets();
    fetchPrices();
}

async function fetchPrices() {
    assetsList.innerHTML = '<div class="loading">Updating prices...</div>';

    const cryptoIds = assets.filter(a => a.type === 'crypto').map(a => a.symbol.toLowerCase()).join(',');
    const stocks = assets.filter(a => a.type === 'stock');

    let cryptoData = {};
    let stockData = {};

    // Fetch Crypto
    if (cryptoIds) {
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd&include_24hr_change=true`);
            cryptoData = await response.json();
        } catch (error) {
            console.error('Error fetching crypto:', error);
        }
    }

    // Fetch Stocks (Finnhub)
    if (stocks.length > 0 && finnhubKey) {
        for (const stock of stocks) {
            try {
                const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=${finnhubKey}`);
                const data = await response.json();
                // Finnhub returns c (current), d (change), dp (percent change)
                if (data.c) {
                    stockData[stock.symbol] = {
                        usd: data.c,
                        usd_24h_change: data.dp
                    };
                }
            } catch (error) {
                console.error('Error fetching stock:', stock.symbol, error);
            }
        }
    } else if (stocks.length > 0 && !finnhubKey) {
        // Warn about missing key
        // We'll handle this in render
    }

    renderAssets(cryptoData, stockData);
}

function renderAssets(cryptoData = {}, stockData = {}) {
    assetsList.innerHTML = '';

    if (assets.length === 0) {
        assetsList.innerHTML = '<div class="loading">No assets added.</div>';
        return;
    }

    assets.forEach((asset, index) => {
        const el = document.createElement('div');
        el.className = 'asset-item';

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
            if (!finnhubKey) {
                price = 'Key Missing';
            } else {
                const data = stockData[asset.symbol];
                if (data) {
                    price = `$${data.usd.toFixed(2)}`;
                    change = data.usd_24h_change;
                    hasData = true;
                }
            }
        }

        const changeClass = change >= 0 ? 'positive' : 'negative';
        const changeSign = change >= 0 ? '+' : '';
        const changeText = hasData ? `${changeSign}${change.toFixed(2)}%` : '';

        el.innerHTML = `
      <div class="asset-info">
        <span class="asset-symbol">${asset.symbol.toUpperCase()}</span>
        <span class="asset-name">${asset.type}</span>
      </div>
      <div class="asset-price-info">
        <div class="asset-price">${price}</div>
        <div class="asset-change ${changeClass}">${changeText}</div>
      </div>
      <button class="delete-btn" data-index="${index}">×</button>
    `;

        assetsList.appendChild(el);
    });

    // Add delete listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            removeAsset(index);
        });
    });
}
