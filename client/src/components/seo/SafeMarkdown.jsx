import ReactMarkdown from 'react-markdown';

/**
 * Preprocesses markdown text to remove accidental 4-space paragraph indentations
 * which Markdown parses as blockquote code elements, while preserving list indentation
 * and backtick code blocks.
 */
export function cleanMarkdown(text) {
  if (!text) return '';
  return text.replace(/^[ \t]{4,}(?![*\-+])(?!\d+\.)/gm, '');
}

export default function SafeMarkdown({ children, className = '' }) {
  if (!children) return null;
  const processed = cleanMarkdown(children);

  return (
    <div className={`prose-wrapper ${className}`}>
      <ReactMarkdown>{processed}</ReactMarkdown>
    </div>
  );
}
