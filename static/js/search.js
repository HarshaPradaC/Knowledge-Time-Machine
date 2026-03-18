/**
 * Knowledge Time Machine — Search Logic
 * 
 * Reads the topic from the URL query string,
 * fetches timeline data from the API endpoint,
 * and passes results to the D3 timeline renderer.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Read topic from URL query params ---
    const urlParams = new URLSearchParams(window.location.search);
    const topic = urlParams.get('topic');

    // If no topic provided, show error
    if (!topic || !topic.trim()) {
        showError('No topic specified. Please go back and enter a search term.');
        return;
    }

    // --- Fetch timeline data from the Django API ---
    fetchTimeline(topic.trim());
});


/**
 * Fetch timeline events from the API and trigger rendering.
 * 
 * @param {string} topic - The topic to fetch a timeline for
 */
async function fetchTimeline(topic) {
    const loadingEl = document.getElementById('loading-state');
    const errorEl = document.getElementById('error-state');

    try {
        // Build API URL with encoded topic parameter
        const apiUrl = `/api/timeline/?topic=${encodeURIComponent(topic)}`;

        const response = await fetch(apiUrl);

        // Handle non-OK responses
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server returned status ${response.status}`);
        }

        const events = await response.json();

        // Validate we got an array of events
        if (!Array.isArray(events) || events.length === 0) {
            throw new Error('No timeline events were generated. Try a different topic.');
        }

        // Hide loading state
        loadingEl.classList.add('hidden');

        // Render the D3 timeline with the fetched events
        renderTimeline(events);

    } catch (error) {
        console.error('Failed to fetch timeline:', error);
        showError(error.message || 'Failed to load timeline. Please try again.');
    }
}


/**
 * Display an error message to the user.
 * 
 * @param {string} message - The error message to display
 */
function showError(message) {
    const loadingEl = document.getElementById('loading-state');
    const errorEl = document.getElementById('error-state');
    const errorMsg = document.getElementById('error-message');

    // Hide loading, show error
    loadingEl.classList.add('hidden');
    errorEl.classList.remove('hidden');
    errorMsg.textContent = message;
}
