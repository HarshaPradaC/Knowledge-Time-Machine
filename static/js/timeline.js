/**
 * Knowledge Time Machine — D3.js Timeline Visualization
 * 
 * Creates an interactive horizontal timeline using D3.js.
 * Events are positioned by year, color-coded by category,
 * and animate into view sequentially.
 */

// ============================================
// COLOR MAPPING FOR CATEGORIES
// ============================================
const CATEGORY_COLORS = {
    'Research':    '#a78bfa',  // Purple
    'Industry':   '#22d3ee',  // Cyan
    'Open Source': '#4ade80',  // Green
    'Milestone':  '#facc15',  // Yellow
};

// ============================================
// MAIN TIMELINE RENDERER
// ============================================

/**
 * Render the interactive D3.js timeline visualization.
 * 
 * @param {Array} events - Array of event objects with title, year, description, category
 */
function renderTimeline(events) {
    if (!events || events.length === 0) return;

    // Show the SVG wrapper, hide loading state
    const wrapper = document.getElementById('timeline-svg-wrapper');
    wrapper.classList.remove('hidden');
    wrapper.innerHTML = ''; // Clear any previous render

    // --- DIMENSIONS & MARGINS ---
    const containerRect = wrapper.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;

    const margin = { top: 80, right: 60, bottom: 60, left: 60 };

    // Use wider canvas for horizontal scrolling if there are many events
    const minWidth = Math.max(containerRect.width, events.length * 120);
    const width = minWidth - margin.left - margin.right;
    const height = (isMobile ? 600 : containerRect.height || 500) - margin.top - margin.bottom;

    // --- CREATE SVG ---
    const svg = d3.select('#timeline-svg-wrapper')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // --- SCALES ---
    const years = events.map(e => e.year);
    const minYear = d3.min(years) - 2;
    const maxYear = d3.max(years) + 2;

    const xScale = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([0, width]);

    // Alternating y positions to avoid label overlap
    const yMid = height / 2;

    // --- DRAW TIMELINE AXIS (horizontal line) ---
    svg.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yMid)
        .attr('y2', yMid)
        .attr('stroke', '#334155')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '6, 4');

    // --- DRAW YEAR TICK MARKS ALONG AXIS ---
    const tickYears = d3.range(
        Math.ceil(minYear / 5) * 5,
        maxYear,
        Math.max(5, Math.floor((maxYear - minYear) / 10))
    );

    svg.selectAll('.year-tick')
        .data(tickYears)
        .join('g')
        .attr('class', 'year-tick')
        .each(function(year) {
            const g = d3.select(this);
            const x = xScale(year);

            g.append('line')
                .attr('x1', x)
                .attr('x2', x)
                .attr('y1', yMid - 6)
                .attr('y2', yMid + 6)
                .attr('stroke', '#475569')
                .attr('stroke-width', 1);

            g.append('text')
                .attr('x', x)
                .attr('y', yMid + 24)
                .attr('text-anchor', 'middle')
                .attr('class', 'year-label')
                .text(year);
        });

    // --- DRAW EVENT NODES ---
    const nodeGroups = svg.selectAll('.event-group')
        .data(events)
        .join('g')
        .attr('class', 'event-group')
        .style('cursor', 'pointer');

    // Position each event along the timeline
    nodeGroups.each(function(d, i) {
        const g = d3.select(this);
        const x = xScale(d.year);

        // Alternate events above and below the axis line
        const isAbove = i % 2 === 0;
        const yOffset = isAbove ? -40 - (i % 3) * 25 : 40 + (i % 3) * 25;
        const nodeY = yMid + yOffset;

        // Store position for click handling
        d._x = x;
        d._y = nodeY;

        // Connector line from axis to node
        g.append('line')
            .attr('class', 'connector-line')
            .attr('x1', x)
            .attr('x2', x)
            .attr('y1', yMid)
            .attr('y2', nodeY)
            .style('opacity', 0);

        // Glow ring behind the node
        g.append('circle')
            .attr('cx', x)
            .attr('cy', nodeY)
            .attr('r', 16)
            .attr('fill', CATEGORY_COLORS[d.category] || '#6366f1')
            .attr('opacity', 0.15)
            .style('opacity', 0);

        // Main event circle node
        g.append('circle')
            .attr('class', 'event-node')
            .attr('cx', x)
            .attr('cy', nodeY)
            .attr('r', 8)
            .attr('fill', CATEGORY_COLORS[d.category] || '#6366f1')
            .attr('stroke', '#0f172a')
            .attr('stroke-width', 2)
            .style('opacity', 0);

        // Year label near node
        g.append('text')
            .attr('x', x)
            .attr('y', nodeY + (isAbove ? -20 : 28))
            .attr('text-anchor', 'middle')
            .attr('class', 'year-label')
            .style('font-size', '10px')
            .style('font-weight', '700')
            .style('fill', CATEGORY_COLORS[d.category] || '#6366f1')
            .text(d.year)
            .style('opacity', 0);

        // Title label
        g.append('text')
            .attr('x', x)
            .attr('y', nodeY + (isAbove ? -34 : 44))
            .attr('text-anchor', 'middle')
            .attr('class', 'event-label')
            .style('font-size', '11px')
            .text(truncateText(d.title, 22))
            .style('opacity', 0);

        // --- CLICK HANDLER: Open detail panel ---
        g.on('click', () => showDetailPanel(d));

        // --- HOVER EFFECTS ---
        g.on('mouseenter', function() {
            d3.select(this).selectAll('.event-node')
                .transition().duration(200)
                .attr('r', 12);
            d3.select(this).selectAll('circle:nth-child(2)')
                .transition().duration(200)
                .attr('r', 22)
                .attr('opacity', 0.25);
        });

        g.on('mouseleave', function() {
            d3.select(this).selectAll('.event-node')
                .transition().duration(200)
                .attr('r', 8);
            d3.select(this).selectAll('circle:nth-child(2)')
                .transition().duration(200)
                .attr('r', 16)
                .attr('opacity', 0.15);
        });
    });

    // --- SEQUENTIAL ENTRANCE ANIMATION ---
    nodeGroups.each(function(d, i) {
        const g = d3.select(this);
        const delay = i * 120; // Stagger each node's appearance

        // Animate connector line
        g.select('.connector-line')
            .transition()
            .delay(delay)
            .duration(400)
            .style('opacity', 1);

        // Animate all circles (glow + main node)
        g.selectAll('circle')
            .transition()
            .delay(delay + 100)
            .duration(500)
            .ease(d3.easeBackOut)
            .style('opacity', 1);

        // Animate text labels
        g.selectAll('text')
            .transition()
            .delay(delay + 200)
            .duration(400)
            .style('opacity', 1);
    });

    // --- ZOOM & PAN BEHAVIOR ---
    const zoom = d3.zoom()
        .scaleExtent([0.5, 3])
        .on('zoom', (event) => {
            svg.attr('transform', event.transform);
        });

    d3.select('#timeline-svg-wrapper svg')
        .call(zoom)
        .on('dblclick.zoom', null); // Disable double-click zoom
}


// ============================================
// DETAIL PANEL
// ============================================

/**
 * Show the side detail panel with event information.
 * 
 * @param {Object} event - The event object to display
 */
function showDetailPanel(event) {
    const panel = document.getElementById('detail-panel');
    const categoryBadge = document.getElementById('detail-category');
    const yearEl = document.getElementById('detail-year');
    const titleEl = document.getElementById('detail-title');
    const descEl = document.getElementById('detail-description');

    // Populate data
    categoryBadge.textContent = event.category;
    categoryBadge.setAttribute('data-category', event.category);
    yearEl.textContent = event.year;
    titleEl.textContent = event.title;
    descEl.textContent = event.description;

    // Show the panel
    panel.classList.remove('hidden');

    // Mark active node
    d3.selectAll('.event-node').classed('active', false);
    d3.selectAll('.event-group').each(function(d) {
        if (d.year === event.year && d.title === event.title) {
            d3.select(this).select('.event-node').classed('active', true);
        }
    });
}

/**
 * Close the detail panel.
 */
function closeDetailPanel() {
    document.getElementById('detail-panel').classList.add('hidden');
    d3.selectAll('.event-node').classed('active', false);
}


// ============================================
// UTILITY
// ============================================

/**
 * Truncate text to a maximum length, adding ellipsis if needed.
 */
function truncateText(text, maxLen) {
    if (text.length <= maxLen) return text;
    return text.substring(0, maxLen - 1) + '…';
}


// ============================================
// EVENT LISTENERS
// ============================================

// Close panel button
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('close-panel');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeDetailPanel);
    }

    // Close panel with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDetailPanel();
        }
    });
});
