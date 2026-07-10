import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export default function SEO({ title = 'CandidateToHR', description = '', canonical, type = 'WebPage', schema, noindex = false, image }) {
  const siteName = 'CandidateToHR';
  const DOMAIN = 'https://candidatetohr.online';
  const location = useLocation();
  
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const pathname = canonical ? canonical : location.pathname;
  const cleanPathname = pathname === '/' ? '' : (pathname.endsWith('/') ? pathname.slice(0, -1) : pathname);
  const url = `${DOMAIN}${cleanPathname}`;
  const ogImage = image || `${DOMAIN}/og-image.png`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type === 'Article' ? 'article' : 'website'} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@CandidateToHR" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Dynamic JSON-LD Schema (only indexable pages should parse structured schemas) */}
      {!noindex && schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
