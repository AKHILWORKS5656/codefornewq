declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    VITE_STRIPE_PUBLISHABLE_KEY: string;
    VITE_API_BASE_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

interface ImportMetaEnv {
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
