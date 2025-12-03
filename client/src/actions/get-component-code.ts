"use server";

import fs from "fs/promises";
import path from "path";

export async function getComponentCode(filePath: string): Promise<string | null> {
    try {
        // Security check: Ensure path starts with allowed prefixes
        // We want to allow @/components/ui/... and @/lib/utils
        // The input path will likely be "components/ui/button" or "lib/utils" (without @/)

        // Normalize path to prevent directory traversal
        const safePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, "");

        const allowedPrefixes = ["components/ui", "lib"];
        const isAllowed = allowedPrefixes.some((prefix) => safePath.startsWith(prefix));

        if (!isAllowed) {
            console.error(`Access denied: ${safePath}`);
            return null;
        }

        // Construct absolute path
        const absolutePath = path.join(process.cwd(), "src", safePath);

        // Try adding extensions if missing
        const extensions = [".tsx", ".ts", ".jsx", ".js"];
        let finalPath = absolutePath;

        try {
            await fs.access(finalPath);
        } catch {
            // If exact match fails, try extensions
            let found = false;
            for (const ext of extensions) {
                if (await fs.access(absolutePath + ext).then(() => true).catch(() => false)) {
                    finalPath = absolutePath + ext;
                    found = true;
                    break;
                }
            }
            if (!found) return null;
        }

        const content = await fs.readFile(finalPath, "utf-8");
        return content;
    } catch (error) {
        console.error("Error reading file:", error);
        return null;
    }
}
