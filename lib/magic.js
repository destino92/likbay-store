import { Magic } from "magic-sdk";

// Create client-side Magic instance
const createMagic = (key) => {
  return typeof window != "undefined" && new Magic(key, { locale: 'fr' });
};

export const magic = createMagic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);