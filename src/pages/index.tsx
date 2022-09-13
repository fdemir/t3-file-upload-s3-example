import type { NextPage } from "next";
import { useState } from "react";
import { trpc } from "../utils/trpc";

const getBlob = async (fileUri: string) => {
  const resp = await fetch(fileUri);
  const imageBody = await resp.blob();
  return imageBody;
};

const Home: NextPage = () => {
  const [image, setImage] = useState<File | null>(null);
  const { mutateAsync: createPresignedUrl } = trpc.useMutation([
    "image.createPresignedUrl",
  ]);

  const { mutate: createPost } = trpc.useMutation(["post.createPost"]);

  const uploadImage = async () => {
    if (!image) return;

    const { url, imageRelativePath } = await createPresignedUrl({
      contentType: image.type,
    });

    const imageBody = await getBlob(URL.createObjectURL(image));

    await fetch(url, {
      method: "PUT",
      body: imageBody,
    });

    return imageRelativePath;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let imageRelativePath;

    if (image) {
      imageRelativePath = await uploadImage();
    }

    const myFormData = new FormData(event.target as HTMLFormElement);
    const { title, content } = Object.fromEntries(
      myFormData.entries()
    ) as Record<string, string>;

    createPost({
      title,
      content,
      image: imageRelativePath,
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <input type="text" name="title" placeholder="Title" />
        </div>
        <div>
          <textarea name="content" placeholder="Content"></textarea>
        </div>
        <input
          type="file"
          onChange={(event) => setImage(event.target.files?.[0])}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Home;
