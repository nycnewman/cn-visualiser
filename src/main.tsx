import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { RecordDateProvider } from './utils/search-context-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RecordDateProvider>
      <App />
      </RecordDateProvider>
  </StrictMode>,
)

