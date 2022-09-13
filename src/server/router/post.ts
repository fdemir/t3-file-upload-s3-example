import { createRouter } from "./context";

import { prisma } from "../db/client";
import { z } from "zod";

export const postRouter = createRouter().mutation("createPost", {
  input: z.object({
    title: z.string().default("No title"),
    content: z.string().nullish(),
    image: z.string().nullish(),
  }),
  async resolve({ input: { title, content, image } }) {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        image,
      },
    });

    return post;
  },
});
