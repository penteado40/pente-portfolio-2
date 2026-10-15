import type { NextConfig } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";

// The Hub's Dev card shows the Dev hero glow until this photo exists; adding
// the file is enough. Checked at build (and on `next dev` start), where
// public/ is on disk, rather than at request time, where it may not be.
const HUB_DEV_PHOTO = "/photos/pente-hub-dev-bg.jpg";

const nextConfig: NextConfig = {
  env: {
    HUB_DEV_PHOTO: existsSync(join(process.cwd(), "public", HUB_DEV_PHOTO))
      ? HUB_DEV_PHOTO
      : "",
  },
};

export default nextConfig;
