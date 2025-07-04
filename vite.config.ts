import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    // 환경 변수 처리
    "process.env": {},
  },
  server: {
    port: 3000,
    host: true,
    open: true,
  },
});
