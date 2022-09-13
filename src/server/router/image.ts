import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { z } from "zod";
import { env } from "../../env/server.mjs";
import { s3Client } from "../../utils/storage";
import { createRouter } from "./context";

export const imageRouter = createRouter().mutation("createPresignedUrl", {
  input: z.object({
    contentType: z.string().regex(/image\/.+/),
  }),
  async resolve({ input: { contentType } }) {
    const imageRelativePath = randomUUID();

    const params = {
      Bucket: env.STORAGE_BUCKET,
      Key: randomUUID(),
      ContentType: contentType,
      ACL: "public-read",
    };

    const command = new PutObjectCommand(params);

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: 30,
    });

    return {
      url,
      imageRelativePath,
    };
  },
});
