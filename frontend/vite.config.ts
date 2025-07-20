import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Access the environment variable here
  const paddleCheckoutCspDomain = process.env.VITE_PADDLE_CHECKOUT_CSP_DOMAIN;

  // Construct the Content-Security-Policy header value
  // Ensure 'self' is always included for your own domain
  const cspHeader = `frame-ancestors 'self' ${paddleCheckoutCspDomain};`;

  return {
    server: {
      host: "::",
      port: 8080,
      headers: {
        // Use the constructed CSP header
        'Content-Security-Policy': cspHeader,
      },
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});