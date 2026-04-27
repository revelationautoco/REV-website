"use client";

import { useEffect } from "react";

const EMBED_ID = "ba2350b3-fdf2-4695-8065-ad2c3127b952-4642745";
const CSS_HREF =
  "https://d3ey4dbjkt2f6s.cloudfront.net/assets/external/work_request_embed.css";
const SCRIPT_SRC =
  "https://d3ey4dbjkt2f6s.cloudfront.net/assets/static_link/work_request_embed_snippet.js";
const CLIENTHUB_ID = "ba2350b3-fdf2-4695-8065-ad2c3127b952-4642745";
const FORM_URL =
  "https://clienthub.getjobber.com/client_hubs/ba2350b3-fdf2-4695-8065-ad2c3127b952/public/work_request/embedded_work_request_form?form_id=4642745";

export function JobberWorkRequestEmbed() {
  useEffect(() => {
    const existingLink = document.querySelector<HTMLLinkElement>(
      `link[href="${CSS_HREF}"]`,
    );
    if (!existingLink) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = CSS_HREF;
      link.media = "screen";
      document.head.appendChild(link);
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"][clienthub_id="${CLIENTHUB_ID}"]`,
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.setAttribute("clienthub_id", CLIENTHUB_ID);
      script.setAttribute("form_url", FORM_URL);
      document.body.appendChild(script);
    }
  }, []);

  return <div id={EMBED_ID} />;
}

