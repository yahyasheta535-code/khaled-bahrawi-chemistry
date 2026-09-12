function getForgeConfig() {
  const forgeUrl = process.env.BUILT_IN_FORGE_API_URL;
  const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;
  if (!forgeUrl || !forgeKey) {
    throw new Error("Storage config missing: BUILT_IN_FORGE_API_URL/BUILT_IN_FORGE_API_KEY");
  }
  return { forgeUrl: forgeUrl.replace(/\/+$/, ""), forgeKey };
}

function withSuffix(relKey: string) {
  const normalized = relKey.replace(/^\/+/, "");
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const dot = normalized.lastIndexOf(".");
  return dot === -1
    ? `${normalized}_${hash}`
    : `${normalized.slice(0, dot)}_${hash}${normalized.slice(dot)}`;
}

export async function storagePutStream(
  relKey: string,
  stream: ReadableStream<Uint8Array>,
  contentType: string,
): Promise<{ key: string; url: string }> {
  const { forgeUrl, forgeKey } = getForgeConfig();
  const key = withSuffix(relKey);
  const presignUrl = new URL("v1/storage/presign/put", `${forgeUrl}/`);
  presignUrl.searchParams.set("path", key);

  const presignResponse = await fetch(presignUrl, {
    headers: { Authorization: `Bearer ${forgeKey}` },
  });
  if (!presignResponse.ok) {
    throw new Error(`Storage presign failed (${presignResponse.status})`);
  }

  const { url } = (await presignResponse.json()) as { url?: string };
  if (!url) throw new Error("Storage returned an empty upload URL");

  const uploadResponse = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: stream,
    duplex: "half",
  } as RequestInit & { duplex: "half" });
  if (!uploadResponse.ok) {
    throw new Error(`Storage upload failed (${uploadResponse.status})`);
  }

  return { key, url: `/manus-storage/${key}` };
}
