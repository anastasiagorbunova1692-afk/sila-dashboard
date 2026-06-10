export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Аналитика</h2>
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        <iframe
          src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSZDsLoL7jDuhMqXuwlyleAL_ueRRT7XdUV9BSpgG3ubxlBW1g4IMiWROBAn9rNMu9iwzrWftlh7Ypv/pubhtml?widget=true&headers=false"
          width="100%"
          height="800px"
          style={{ border: 'none', display: 'block' }}
        />
      </div>
    </div>
  )
}
