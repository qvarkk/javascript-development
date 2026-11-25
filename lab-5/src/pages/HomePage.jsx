import CoinTable from "../components/CoinTable.jsx"
import Filters from "../components/Filters.jsx"
import GlobalStats from "../components/GlobalStats.jsx"

export default function HomePage() {
  return (
    <div className="space-y-6">
      <GlobalStats />
      <Filters />
      <CoinTable />
    </div>
  )
}
