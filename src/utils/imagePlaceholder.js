/**
 * Generate SVG placeholder untuk book cover
 * @param {number} width - Lebar SVG
 * @param {number} height - Tinggi SVG
 * @param {string} text - Text yang ditampilkan (default: 'Book')
 * @returns {string} Data URI untuk SVG
 */
export const getBookPlaceholder = (width = 150, height = 200, text = 'Book') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect fill="#f0f0f0" width="${width}" height="${height}"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 8}" fill="#999">${text}</text>
  </svg>`;
  
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

/**
 * Handle image error dengan fallback ke SVG placeholder
 * Mencegah infinite loop dengan set onerror ke null
 */
export const handleImageError = (e, width = 150, height = 200, text = 'Book') => {
  e.target.onerror = null; // Prevent infinite loop
  e.target.src = getBookPlaceholder(width, height, text);
};
