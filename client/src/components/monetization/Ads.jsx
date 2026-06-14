import './Ads.css';

// These components are ready for Google AdSense or customized direct ads.
// You will replace the internal div with the <ins class="adsbygoogle"> script provided by AdSense.

export function AdBanner() {
  return (
    <div className="ad-container ad-banner">
      {/* Insert AdSense <ins> script here once approved */}
    </div>
  );
}

export function SidebarAd() {
  return (
    <div className="ad-container ad-sidebar">
      {/* Insert AdSense <ins> script here once approved */}
    </div>
  );
}

export function InlineAd() {
  return (
    <div className="ad-container ad-inline my-8">
      {/* Insert AdSense <ins> script here once approved */}
    </div>
  );
}
