export const NODE_ENV = import.meta.env.MODE as "production" | "development"
export const APP_NAME: string = import.meta.env.VITE_APP_NAME
export const APP_PORT = import.meta.env.VITE_APP_PORT

console.log("NODE_ENV", NODE_ENV)
