import { Link, createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import EmptyState from './components/EmptyState.jsx'
import Layout from './components/Layout.jsx'
import { useMarketPolling } from './hooks/useMarketPolling.js'
import { usePortfolioSync } from './hooks/usePortfolioSync.js'
import HomePage from './pages/HomePage.jsx'

const lazyPage = (load) => () => load().then((module) => ({ Component: module.default }))

const notFound = (
  <EmptyState title="Страница не найдена" text="Такого адреса в приложении нет.">
    <Link to="/" className="button">
      К рынку
    </Link>
  </EmptyState>
)

const crashed = (
  <EmptyState title="Раздел не открылся" text="Не удалось загрузить или показать страницу. Проверьте соединение и обновите её.">
    <button type="button" className="button" onClick={() => window.location.reload()}>
      Обновить страницу
    </button>
  </EmptyState>
)

const router = createBrowserRouter([
  {
    element: <Layout />,
    hydrateFallbackElement: <></>,
    children: [
      {
        errorElement: crashed,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'coin/:id', lazy: lazyPage(() => import('./pages/CoinPage.jsx')) },
          { path: 'portfolio', lazy: lazyPage(() => import('./pages/PortfolioPage.jsx')) },
          { path: '*', element: notFound },
        ],
      },
    ],
  },
])

export default function App() {
  useMarketPolling()
  usePortfolioSync()

  return <RouterProvider router={router} />
}
