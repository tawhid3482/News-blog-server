import { MeiliSearch } from "meilisearch";
import config from "../config";
import { noImage } from "../app/modules/post/post.constant";
import { TNews } from "../app/modules/post/post.interface";

const meiliClient = new MeiliSearch({
  host: config.meiliPort as string,
  apiKey: config.meiliApiKey,
});

export async function addDocumentToIndex(
  result: TNews & { id: string },
  indexKey: string
) {
  const index = meiliClient.index(indexKey);

  const { id, title, content, coverImage } = result;
  const image = coverImage || noImage;

  try {
    // Check if the document already exists
    const existing = await index.getDocument(id).catch(() => null);

    if (existing) {
      return;
    }

    const document = {
      id,
      title,
      content,
      image: image,
    };

    await index.addDocuments([document]);
  } catch (error) {
    console.error("Error adding document to MeiliSearch:", error);
  }
}

export const deleteDocumentFromIndex = async (indexKey: string, id: string) => {
  try {
    const index = meiliClient.index(indexKey);
    await index.deleteDocument(id);
  ;
  } catch (error: any) {
    console.error(
      `❌ Failed to delete document with ID ${id} from MeiliSearch index "${indexKey}":`,
      error?.message || error
    );
  }
};

export const deleteMeiliSearchIndex = async (indexKey: string) => {
  meiliClient.deleteIndex(indexKey);
};

export default meiliClient;
