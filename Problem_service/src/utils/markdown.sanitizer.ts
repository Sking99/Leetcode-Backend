import { marked } from "marked";
import sanitizeHtml from 'sanitize-html';
import logger from "../config/logger.config";
import TurndownService from "turndown";

export async function sanitizeMarkdown(markDown:string): Promise<string> {
    if(!markDown || typeof markDown !== 'string'){
        markDown = "";
    }

    try {
        const convertedHtml = await marked.parse(markDown);

        const sanitizedHtml = sanitizeHtml(convertedHtml, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'pre', 'code']),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                "img": ["src", "alt", "title"],
                "code": ["class"],
                "pre": ["class"],
                "a": ["href", "target"]
            },
            allowedSchemes: ["http", "https"],
            allowedSchemesByTag: {
                "img": ["http", "https"],
            }
        })

        const tds = new TurndownService();
        return tds.turndown(sanitizedHtml);

    } catch (error) {
        logger.error("Error sanitizing markDown");
        return "";
    }
}