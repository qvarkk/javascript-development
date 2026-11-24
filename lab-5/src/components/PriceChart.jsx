import { useMemo } from "react"
import { Line } from "react-chartjs-2"
import { colors } from "../lib/chartSetup.js"
import {
  formatChartAxis,
  formatChartPrice,
  formatChartTick,
  formatDate,
} from "../lib/format.js"

export default function PriceChart({ points, days }) {
  const data = useMemo(() => {
    const tone = points.at(-1)[1] >= points[0][1] ? colors.up : colors.down
    return {
      labels: points.map(([timestamp]) => formatChartTick(timestamp, days)),
      datasets: [
        {
          data: points.map(([, price]) => price),
          borderColor: tone,
          backgroundColor: `${tone}1f`,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: tone,
          fill: true,
          tension: 0.2,
        },
      ],
    }
  }, [points, days])

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,
          backgroundColor: colors.ink,
          cornerRadius: 0,
          callbacks: {
            title: ([item]) => formatDate(points[item.dataIndex][0]),
            label: (item) => formatChartPrice(item.parsed.y),
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxTicksLimit: 6, maxRotation: 0 },
        },
        y: {
          grid: { color: colors.line },
          ticks: { callback: (value) => formatChartAxis(value) },
        },
      },
    }),
    [points],
  )

  return <Line data={data} options={options} role="img" />
}
