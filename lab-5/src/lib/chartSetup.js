import {
  ArcElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'

export const colors = {
  ink: '#1b1a17',
  muted: '#6f6a5e',
  line: '#d8d1bf',
  card: '#fcfaf5',
  up: '#17753f',
  down: '#c2302a',
}

export const pieColors = [
  '#e4572e',
  '#1b1a17',
  '#17753f',
  '#f2b134',
  '#3d5a80',
  '#9b5de5',
  '#00a6a6',
  '#c2302a',
  '#8d99ae',
  '#6b4f3a',
]

Chart.register(
  ArcElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
)

Chart.defaults.color = colors.muted
Chart.defaults.font.family = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
Chart.defaults.font.size = 11
