import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './app/App.tsx';
import { queryClient } from "./libs/queryClient";
import { worker } from "./libs/msw/browser";

async function enableMocking() {
  if (import.meta.env.DEV) {
    await worker.start();
  }
}

// worker.start() precisa terminar antes de renderizarmos o App
enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
});
