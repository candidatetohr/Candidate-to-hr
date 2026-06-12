import './Ads.css';

// These components are placeholders for Google AdSense or customized direct ads.
// You will replace the internal div with the <ins class="adsbygoogle"> script provided by AdSense.

export function AdBanner() {
  return (
    <div className="ad-container ad-banner">
      <div className="ad-label">Advertisement</div>
      <div className="ad-placeholder">
        <span>728 x 90 Responsive Banner Ad Space</span>
      </div>
    </div>
  );
}

export function SidebarAd() {
  return (
    <div className="ad-container ad-sidebar">
      <div className="ad-label">Advertisement</div>
      <div className="ad-placeholder">
        <span>300 x 600 Sidebar Ad Space</span>
      </div>
    </div>
  );
}

export function InlineAd() {
  return (
    <div className="ad-container ad-inline my-8">
      <div className="ad-label">Advertisement</div>
      <div className="ad-placeholder">
        <span>In-Article Native Ad Space</span>
      </div>
    </div>
  );
}
