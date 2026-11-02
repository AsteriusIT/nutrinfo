import type { Config } from "@react-router/dev/config";

// Site 100 % statique : chaque route est pré-rendue en HTML au build.
export default {
  ssr: false,
  prerender: true,
} satisfies Config;
