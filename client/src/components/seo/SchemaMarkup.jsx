import { Helmet } from 'react-helmet-async';

const DOMAIN = 'https://candidatetohr.online';

/**
 * Renders JSON-LD Schema.org markup in the <head> for Google SEO.
 * @param {string} type - 'FAQPage', 'Article', 'BreadcrumbList', 'SoftwareApplication', 'Product', or any custom type
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
      "url": data.url || DOMAIN,
      "datePublished": data.datePublished || "2024-01-01",
      "dateModified": data.dateModified || new Date().toISOString().split('T')[0],
      "author": {
        "@type": "Organization",
        "name": "CandidateToHR",
        "url": DOMAIN
      },
      "publisher": {
        "@type": "Organization",
        "name": "CandidateToHR",
        "url": DOMAIN,
        "logo": {
          "@type": "ImageObject",
          "url": `${DOMAIN}/logo.png`,
          "width": 512,
          "height": 512
        }
      },
      "isPartOf": {
        "@id": `${DOMAIN}/#website`
      }
    };
  } else if (type === 'BreadcrumbList') {
    // data: array of { name, url } objects
    schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": data.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url.startsWith('http') ? item.url : `${DOMAIN}${item.url}`
      }))
    };
  } else if (type === 'SoftwareApplication') {
    schema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": data.name || "CandidateToHR",
      "applicationCategory": data.category || "BusinessApplication",
      "operatingSystem": "Web",
      "description": data.description,
      "url": data.url || DOMAIN,
      "offers": {
        "@type": "Offer",
        "price": data.price || "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "publisher": {
        "@type": "Organization",
        "name": "CandidateToHR",
        "url": DOMAIN
      }
    };
  } else if (type === 'HowTo') {
    schema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": data.name,
      "description": data.description,
      "url": data.url || DOMAIN,
      "step": data.steps.map((step, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.name || step.month,
        "text": step.text || step.description
      }))
    };
  } else if (type === 'Dataset') {
    schema = {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "name": data.name,
      "description": data.description,
      "url": data.url || DOMAIN,
      "creator": {
        "@type": "Organization",
        "name": "CandidateToHR",
        "url": DOMAIN
      }
    };
  } else if (type === 'Product') {
    schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": data.name,
      "description": data.description,
      "url": data.url || DOMAIN,
      "brand": {
        "@type": "Brand",
        "name": "CandidateToHR"
      },
      "offers": {
        "@type": "Offer",
        "price": data.price || "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
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
