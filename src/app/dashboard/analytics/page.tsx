export default function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Аналитика</h2>
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        <iframe
          src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQPFuyVRWX5hUBi_KvKlzCY_nAHY7i1z1GMG-75mNcWil0cZWfFXTZsEbETeLEl4rPj2_YjWC9uSAEM/pubhtml?widget=true&headers=false"
          width="100%"
          height="800px"
          style={{ border: 'none', display: 'block' }}
        />
      </div>
    </div>
  )
}
