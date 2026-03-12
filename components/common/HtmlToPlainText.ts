export function HtmlToPlainText(html: string): string {
  if (typeof window !== "undefined") {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }
  return ""; // SSR 환경 대응
}
