import type { Prompt } from "@/lib/types";

export const exportPromptsAsJSON = (prompts: Prompt[]) => {
  const dataStr = JSON.stringify(prompts, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  downloadFile(
    dataBlob,
    `prompts-export-${new Date().toISOString().split("T")[0]}.json`,
  );
};

export const exportPromptsAsPlainText = (prompts: Prompt[]) => {
  let textContent = "EverPrompt Export\n";
  textContent += `Generated: ${new Date().toLocaleString()}\n`;
  textContent += `Total Prompts: ${prompts.length}\n\n`;
  textContent += "=".repeat(80) + "\n\n";

  prompts.forEach((prompt, index) => {
    textContent += `PROMPT ${index + 1}\n`;
    textContent += "-".repeat(80) + "\n";
    textContent += `Title: ${prompt.title}\n`;
    textContent += `Model: ${prompt.model}\n`;
    textContent += `Type: ${prompt.type}\n`;
    textContent += `Status: ${prompt.isPublic ? "Public" : "Private"}\n`;
    textContent += `Created: ${prompt.createdAt}\n`;
    textContent += `Likes: ${prompt.likes}\n`;

    if (prompt.author) {
      textContent += `Author: ${prompt.author.name} (${prompt.author.email})\n`;
    }

    if (prompt.tags.length > 0) {
      textContent += `Tags: ${prompt.tags.join(", ")}\n`;
    }

    textContent += `\nDescription:\n${prompt.description}\n`;
    textContent += `\nContent:\n${prompt.content}\n`;
    textContent += "\n" + "=".repeat(80) + "\n\n";
  });

  const dataBlob = new Blob([textContent], { type: "text/plain" });
  downloadFile(
    dataBlob,
    `prompts-export-${new Date().toISOString().split("T")[0]}.txt`,
  );
};

const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
