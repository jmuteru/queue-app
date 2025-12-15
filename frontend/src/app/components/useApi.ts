const apiBase =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") || "http://localhost:4000";

export const useApiBase = () => apiBase;

export const parseJson = async (res: Response, url: string) => {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    const snippet = text.slice(0, 200).replace(/\s+/g, " ");
    throw new Error(`Non-JSON response from ${url}: ${snippet || "empty"}`);
  }
  return res.json();
};


