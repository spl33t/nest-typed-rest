import react from "@vitejs/plugin-react";
import * as path from "path";
import { defineConfig, loadEnv, UserConfig } from "vite";
import mkcert from "vite-plugin-mkcert"
import commonjs from 'vite-plugin-commonjs'

const appFolderName = path.resolve(process.cwd()).split("\\").slice(-1);

// https://vitejs.dev/config/
export default ({ mode }: UserConfig) => {
  if (mode) process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  console.log(path.resolve(process.cwd(), "../shared"))
  return defineConfig(
    {
      plugins: [commonjs(), react(), mkcert()],
      resolve: {
        alias: {
          "@": path.resolve(process.cwd(), "./src"),
        },
      },
      server: {
        port: Number(process.env.VITE_APP_DEV_PORT),
        host: "127.0.0.1",
        https: true,
      },
    }
  )
}
