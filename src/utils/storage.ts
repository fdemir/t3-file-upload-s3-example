import { S3Client } from "@aws-sdk/client-s3";

import { env } from "../env/server.mjs";

export const s3Client = new S3Client({
  endpoint: "https://fra1.digitaloceanspaces.com",
  region: "fra1",
  credentials: {
    accessKeyId: env.STORAGE_ID,
    secretAccessKey: env.STORAGE_SECRET,
  },
  logger: console,
});
