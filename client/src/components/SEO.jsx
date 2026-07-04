import { Helmet } from 'react-helmet-async';

export default function SEO({ title = 'CandidateToHR', description = '', canonical, type = 'WebPage', schema, noindex = false, image }) {
  const siteName = 'CandidateToHR';
  const DOMAIN = 'https://candidatetohr.online';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const url = canonical ? `${DOMAIN}${canonical}` : DOMAIN;
  const ogImage = image || `${DOMAIN}/og-image.png`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={url} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type === 'Article' ? 'article' : 'website'} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@CandidateToHR" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Dynamic JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
