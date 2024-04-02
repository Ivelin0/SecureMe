import { createClient } from "redis";
import PQueue from "p-queue";
const queue = new PQueue({ concurrency: 1 });
export const client = createClient();

(async () => await client.connect())();

export interface Device {
  fcm_token: string;
  last_location?: {
    longitude: number;
    latitude: number;
  };
}
export async function getTokens(userId: string) {
  const result = await client.json.get(`user:${userId}`, {
    path: "$.tokens",
  });

  return ((result && (result as string[])[0]) ?? []) as unknown as Device[];
}

export async function addToken(userId: string, tokenData: Device) {
  await queue.add(async () => {
    const key = `user:${userId}`;
    const tokens = await getTokens(userId);

    const isUnique = (tokens: any[], tokenData: Device): boolean => {
      return (
        tokens.find((curr: any) => curr.fcm_token == tokenData.fcm_token) ==
        undefined
      );
    };
    if (tokens.length === 0) {
      await client.json.set(key, "$", { tokens: [tokenData as {}] });
    } else if (isUnique(tokens, tokenData)) {
      await client.json.arrAppend(key, "$.tokens", tokenData as {});
    } else {
      removeToken(userId, tokenData.fcm_token).then(async () => {
        await client.json.set(key, "$", { tokens: [tokenData as {}] });
      });
    }
  });
}
export async function removeToken(userId: string, fcm_token: string) {
  await queue.add(async () => {
    const tokens: Device[] = await getTokens(userId);
    const index = tokens
      .map(({ fcm_token }: any) => fcm_token)
      .indexOf(fcm_token);
    if (index !== -1) {
      tokens.splice(index, 1);
      await client.json.set(`user:${userId}`, "$.tokens", tokens as {});
    } else {
    }
  });
}