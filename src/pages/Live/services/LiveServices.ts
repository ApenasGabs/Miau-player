import axios from "axios";

export const resolveFinalUrl = async (url: string): Promise<string> => {
  try {
    const proxyUrl = `/api${new URL(url).pathname}`;
    const response = await axios.head(proxyUrl, { maxRedirects: 5 });
    return response.request.responseURL;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (
      error.response &&
      error.response.status >= 300 &&
      error.response.status < 400
    ) {
      return error.response.headers.location;
    } else {
      console.error("Error resolving final URL:", error);
      return url;
    }
  }
};
