import { useEffect, useState } from "react";

export function useExtensionImageUrl(imagePath: string): string {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const baseUri = document.body.getAttribute("data-baseuri");
    if (baseUri) {
      setUrl(`${baseUri}/${imagePath}`);
    }
  }, [imagePath]);

  return url;
}
