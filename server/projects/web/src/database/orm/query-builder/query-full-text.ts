/**
 * Preprocesses a given full-text query in order to render better results.
 * @param query The full-text query.
 * @return The preprocessed full-text query.
 */
export function preprocessFullTextQuery(query: string): string {
  // TODO: Research the efficiency of the GIN index here; not sure if turning each word into a prefix match is ok for performance.
  // TODO: Improve fullTextQuery preprocessing to account for more query operators (e.g. <->).
  return query.replace(/[()&@.:<>!]/g, ' ').trim()  // Replace all troublesome special characters with a space.
              .replace(/\s*\|+\s*/g, '|')       // Remove all spaces around query OR '|' operators.
              .replace(/\|{2,}/g, '|')          // Replace all sequential query OR '|' operators with single one.
              .replace(/\|$/, '')               // Remove trailing query OR '|' operator.
              .replace(/\s+/g, ':*&') + ':*';   // Replace all whitespace with STARTS_WITH AND ':*&' operators.
}
