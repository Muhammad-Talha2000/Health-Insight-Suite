import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { mockFetch } from "./lib/api-mock";

// Override global fetch to use mock data in production
const originalFetch = window.fetch;
window.fetch = ((url: RequestInfo | URL, options?: RequestInit) => {
  // Use mock fetch for API calls, original fetch for everything else
  const urlString = typeof url === "string" ? url : url.toString();
  if (urlString.includes("/api/")) {
    return mockFetch(urlString, options);
  }
  return originalFetch(url, options);
}) as typeof fetch;

createRoot(document.getElementById("root")!).render(<App />);
