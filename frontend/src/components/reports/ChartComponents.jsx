import React from 'react'
import Plot from 'react-plotly.js'

const ChartComponents = ({ data, title, height = 400 }) => {
  if (!data) return null
  
  // Default Plotly config
  const config = {
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    responsive: true
  }
  
  // Default layout
  const layout = {
    ...data.layout,
    title: title || data.layout?.title,
    height: height,
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 50,
      ...data.layout?.margin
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: {
      family: 'Inter, sans-serif',
      size: 12,
      color: '#374151'
    }
  }
  
  return (
    <div className="chart-container">
      <Plot
        data={data.data}
        layout={layout}
        config={config}
        style={{ width: '100%', height: `${height}px` }}
        useResizeHandler={true}
      />
    </div>
  )
}

export default ChartComponents