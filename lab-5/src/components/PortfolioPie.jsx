import { useMemo } from "react"
import { Pie } from "react-chartjs-2"
import { colors, pieColors } from "../lib/chartSetup.js"
import { formatMoney, formatShare } from "../lib/format.js"

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: { boxWidth: 12, boxHeight: 12, padding: 14 },
    },
    tooltip: {
      backgroundColor: colors.ink,
      cornerRadius: 0,
      callbacks: { label: (item) => ` ${formatMoney(item.parsed)}` },
    },
  },
}

export default function PortfolioPie({ positions }) {
  const data = useMemo(
    () => ({
      labels: positions.map(
        (position) => `${position.name} · ${formatShare(position.share)}`,
      ),
      datasets: [
        {
          data: positions.map((position) => position.value),
          backgroundColor: positions.map(
            (_, index) => pieColors[index % pieColors.length],
          ),
          borderColor: colors.card,
          borderWidth: 2,
        },
      ],
    }),
    [positions],
  )

  return <Pie data={data} options={options} role="img" />
}
