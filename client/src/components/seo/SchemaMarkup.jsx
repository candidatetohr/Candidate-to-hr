import { Helmet } from 'react-helmet-async';

/**
 * Renders JSON-LD Schema.org markup in the <head> for Google SEO.
 * @param {string} type - 'FAQPage', 'Article', 'JobPosting', 'BreadcrumbList'
 * @param {object|array} data - The structured data mapped for the specific schema
 */
export default function SchemaMarkup({ type, data }) {
  let schema = {};

  if (type === 'FAQPage') {
    schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    };
  } else if (type === 'Article') {
    schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": data.title,
      "description": data.description,
      "author": {
        "@type": "Organization",
        "name": "Candidatetohr"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Candidatetohr",
        "logo": {
          "@type": "ImageObject",
          "url": "https://candidatetohr.com/logo.png"
        }
      }
    };
  } else {
    // Pass raw custom schema
    schema = {
      "@context": "https://schema.org",
      "@type": type,
      ...data
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
