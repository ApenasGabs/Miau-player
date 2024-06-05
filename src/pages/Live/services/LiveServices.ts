import axios from "axios";

export const resolveFinalUrl = async (url: string): Promise<string> => {
  try {
    const proxyUrl = `/api${new URL(url).pathname}`;
    const response = await axios.get(proxyUrl, { maxRedirects: 5 });
    return response.request.responseURL || response.config.url;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (
      error.response &&
      error.response.status >= 300 &&
      error.response.status < 400
    ) {
      const location = error.response.headers.location;
      if (location) {
        return resolveFinalUrl(location);
      }
    }
    console.error("Error resolving final URL:", error);
    return url;
  }
};
