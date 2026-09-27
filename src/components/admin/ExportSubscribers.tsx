import React from 'react'

/** "Download as spreadsheet" button shown above the Newsletter subscribers list */
export default function ExportSubscribers() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', margin: '0 0 16px' }}>
      <a
        href="/next/export-subscribers"
        style={{
          display: 'inline-block',
          background: '#1d3f8f',
          color: '#fff',
          padding: '8px 14px',
          borderRadius: 6,
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        ⬇ Download as spreadsheet (CSV)
      </a>
      <span style={{ opacity: 0.7, fontSize: 13 }}>Opens in Excel or Google Sheets, and imports into Mailchimp or Brevo.</span>
    </div>
  )
}
