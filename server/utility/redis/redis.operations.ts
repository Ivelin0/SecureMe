import { createClient } from "redis";
import PQueue from "p-queue";
const queue = new PQueue({ concurrency: 1 });
export const client = createClient();

(async () => await client.connect())();
export async function getTokens(userId: string) {
  const result = await client.json.get(`user:${userId}`, {
    path: "$.tokens",
  });

  return ((result && (result as string[])[0]) ?? []) as unknown as string[];
}

export async function addToken(userId: string, token: string) {
  await queue.add(async () => {
    const key = `user:${userId}`;
    const tokens = await getTokens(userId);

    const isUnique = (tokens: string[], token: string): boolean =>
      tokens.find((curr: string) => curr == token) == undefined;

    if (tokens.length === 0) {
      await client.json.set(key, "$", { tokens: [token] });
    } else if (isUnique(tokens, token)) {
      await client.json.arrAppend(key, "$.tokens", token);
    }
  });
}

export async function removeToken(userId: string, token: string) {
  await queue.add(async () => {
    const tokens = await getTokens(userId);
    const index = tokens.indexOf(token);
    if (index !== -1) {
      tokens.splice(index, 1);
      await client.json.set(`user:${userId}`, "$.tokens", tokens);
    }
  });
}