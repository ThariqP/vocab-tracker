/**
 * Minimal RFC-4180 style CSV parsing: quoted fields, commas and newlines
 * inside quotes, and doubled quotes as an escaped quote.
 */
function splitRows(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }

  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

/**
 * Turns the fetched CSV text into [{ word, definition }].
 * Reads the header when present, tolerates missing columns and duplicates.
 */
export function parseVocabulary(text) {
  const clean = String(text || '').replace(/^\uFEFF/, '');
  const rows = splitRows(clean).filter((row) => row.some((cell) => cell.trim() !== ''));
  if (!rows.length) return [];

  const header = rows[0].map((cell) => cell.trim().toLowerCase());
  const hasHeader = header.includes('word') && header.includes('definition');
  const wordIndex = hasHeader ? header.indexOf('word') : 0;
  const definitionIndex = hasHeader ? header.indexOf('definition') : 1;
  const body = hasHeader ? rows.slice(1) : rows;

  const seen = new Set();
  const words = [];

  body.forEach((row) => {
    const word = (row[wordIndex] || '').trim();
    if (!word || seen.has(word)) return;
    seen.add(word);
    words.push({ word, definition: (row[definitionIndex] || '').trim() });
  });

  return words;
}