'use client'

import { ResponsiveSunburst } from '@nivo/sunburst'

interface SunburstData {
  name: string
  value: number
  children?: SunburstData[]
}

interface SunburstChartProps {
  data: SunburstData
}

export default function SunburstChart({ data }: SunburstChartProps) {
  return (
    <div style={{ height: '600px', width: '100%' }}>
      <ResponsiveSunburst
        data={data}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        id="name"
        value="value"
        cornerRadius={2}
        borderColor={{ theme: 'background' }}
        colors={{ scheme: 'nivo' }}
        childColor={{
          from: 'color',
          modifiers: [['brighter', 0.1]],
        }}
        enableArcLabels={true}
        arcLabelsSkipAngle={8}
        arcLabelsTextColor={{
          from: 'color',
          modifiers: [['darker', 1.4]],
        }}
        arcLabel={({ id, value, percentage }) => {
          // 루트 레벨은 표시하지 않음
          if (id === '전체') return ''
          // Region/Team 레벨은 이름과 퍼센트 표시
          if (id === 'Region' || id === 'Team') {
            return `${id} (${percentage.toFixed(1)}%)`
          }
          // 하위 레벨은 이름만 표시
          return String(id)
        }}
        tooltip={({ id, value, formattedValue, percentage }) => (
          <div
            style={{
              padding: '12px',
              background: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <strong>{id}</strong>
            <br />
            티켓 수: {value.toLocaleString()}
            <br />
            비율: {percentage.toFixed(1)}%
          </div>
        )}
      />
    </div>
  )
}
