import type { NextConfig } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";

// Photos still to come: until each file exists, its spot shows the Dev hero
// glow, and adding the file is enough. Checked at build (and on `next dev`
// start), where public/ is on disk, rather than at request time, where it
// may not be.
const HUB_DEV_PHOTO = "/photos/pente-hub-dev-bg.jpg";
const DEV_HERO_PHOTO = "/photos/pente-dev-hero.jpg";
const DEV_PORTRAIT_PHOTO = "/photos/pente-dev-portrait.jpg";

const ifInPublic = (path: string) =>
  existsSync(join(process.cwd(), "public", path)) ? path : "";

const nextConfig: NextConfig = {
  env: {
    HUB_DEV_PHOTO: ifInPublic(HUB_DEV_PHOTO),
    DEV_HERO_PHOTO: ifInPublic(DEV_HERO_PHOTO),
    DEV_PORTRAIT_PHOTO: ifInPublic(DEV_PORTRAIT_PHOTO),
  },
};

export default nextConfig;
