/**
 * Semantic Search Tab Component
 */

let searchResults = [];
let searchQuery = '';

/**
 * Show toast with search timing
 */
function showSearchToast(message, searchMs, roundtripMs) {
    const existing = document.getElementById('api-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'api-toast';
    toast.className = 'fixed bottom-4 right-4 bg-white text-gray-600 px-4 py-3 rounded-lg shadow-md border border-gray-200 text-sm font-medium z-50 transition-opacity duration-300';

    const g = (ms) => `<span style="color: #059669; font-weight: 600">${ms}ms</span>`;
    toast.innerHTML = `${message} | FT.SEARCH: ${g(searchMs)} | Roundtrip: ${g(roundtripMs)}`;
    document.body.appendChild(toast);

    setTimeout(() => toast.style.opacity = '0', 4000);
    setTimeout(() => toast.remove(), 4500);
}

function renderSearchTab() {
    return `
        <div>
            <!-- Search Input -->
            <div class="mb-6">
                <p class="text-gray-600 mb-4">Just ask what kind of transactions you're looking for</p>
                <div class="flex gap-3">
                    <input
                        type="text"
                        id="search-input"
                        placeholder="e.g. coffee shops, travel expenses, restaurants in Miami..."
                        class="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                        value="${searchQuery}"
                    />
                    <button
                        id="search-btn"
                        class="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Search
                    </button>
                </div>
            </div>

            <!-- Results -->
            <div id="search-results">
                ${renderSearchResults()}
            </div>
        </div>
    `;
}

function renderSearchResults() {
    if (searchResults.length === 0 && !searchQuery) {
        return `
            <div class="text-center py-12 text-gray-400">
                <p>Your results will appear here</p>
            </div>
        `;
    }

    if (searchResults.length === 0 && searchQuery) {
        return `
            <div class="text-center py-12 text-gray-500">
                <p>No transactions found for "${searchQuery}"</p>
                <p class="text-sm mt-2">Try a different search term</p>
            </div>
        `;
    }

    return `
        <div class="mb-3">
            <h3 class="text-sm font-medium text-gray-500">Transactions <span class="font-normal">— ordered by relevance</span></h3>
        </div>
        <div class="border border-gray-200 rounded-lg overflow-hidden">
            <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th class="text-left px-4 py-3 text-sm font-medium text-gray-600">Merchant</th>
                        <th class="text-left px-4 py-3 text-sm font-medium text-gray-600">Category</th>
                        <th class="text-left px-4 py-3 text-sm font-medium text-gray-600">Location</th>
                        <th class="text-right px-4 py-3 text-sm font-medium text-gray-600">Amount</th>
                        <th class="text-right px-4 py-3 text-sm font-medium text-gray-600">Relevance</th>
                    </tr>
                </thead>
                <tbody>
                    ${searchResults.map(tx => {
                        const relevance = Math.round((1 - tx.score) * 100);
                        return `
                            <tr class="border-b border-gray-100">
                                <td class="px-4 py-3 text-sm font-medium">${tx.merchant}</td>
                                <td class="px-4 py-3">
                                    <span class="px-2 py-1 bg-gray-100 rounded text-sm">${tx.category}</span>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-600">${tx.location}</td>
                                <td class="px-4 py-3 text-sm text-right font-medium">
                                    $${parseFloat(tx.amount).toFixed(2)}
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <span class="text-sm text-gray-500">${relevance}%</span>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

async function performSearch(query) {
    if (!query || query.length < 2) return;

    searchQuery = query;

    try {
        const url = `${API_BASE}/api/search?q=${encodeURIComponent(query)}&limit=10`;
        const res = await fetch(url);
        const data = await res.json();
        const timing = performance.getEntriesByName(url).pop();
        const duration = Math.round(timing?.duration ?? 0);

        if (data.error) {
            searchResults = [];
            updateSearchResults();
            showToast('Search not ready', 'FT.SEARCH', 0, duration);
            return;
        }

        searchResults = data.results;
        updateSearchResults();
        showSearchToast(`Found ${data.count} results`, data.search_ms, duration);
    } catch (err) {
        console.error('Search failed:', err);
        searchResults = [];
        updateSearchResults();
    }
}

function updateSearchResults() {
    const container = document.getElementById('search-results');
    if (container) {
        container.innerHTML = renderSearchResults();
    }
}

function attachSearchListeners() {
    const input = document.getElementById('search-input');
    const btn = document.getElementById('search-btn');

    if (btn) {
        btn.onclick = () => {
            const query = input?.value?.trim();
            if (query) performSearch(query);
        };
    }

    if (input) {
        input.onkeypress = (e) => {
            if (e.key === 'Enter') {
                const query = input.value.trim();
                if (query) performSearch(query);
            }
        };
    }
}
