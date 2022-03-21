import { Injectable } from "@angular/core";
import hljs from "highlight.js";

@Injectable({
    providedIn: "root",
})
export class HighlightService {
    highlight(element?: HTMLElement): void {
        const source = element || document;

        source.querySelectorAll("pre code, .inline-highlight").forEach((el) => {
            // then highlight each
            hljs.highlightElement(el as HTMLElement);
        });

        this.doHighlightFixes(element || document.body);
    }

    doHighlightFixes(element: HTMLElement): void {
        this.doHighlightFix1(element);
        this.doHighlightFix2(element);
        this.doHighlightFix3(element);
    }

    doHighlightFix1(element: HTMLElement): void {
        const textNodes = this.getTextNodes(element);

        textNodes.forEach((node) => {
            const nodeValue = node.nodeValue || "";

            if (nodeValue !== "@NgModule") {
                return;
            }

            const replacementSpan = document.createElement("SPAN");
            replacementSpan.className = "hljs";
            replacementSpan.innerText = "@";

            const replacementSpan2 = document.createElement("SPAN");
            replacementSpan2.className = "hljs-title class_";
            replacementSpan2.innerText = "NgModule";

            node.replaceWith(replacementSpan, replacementSpan2);
        });
    }

    doHighlightFix2(element: HTMLElement): void {
        const textNodes = this.getTextNodes(element);

        textNodes.forEach((node) => {
            const nodeValue = node.nodeValue || "";

            if (!nodeValue.includes("(routes)")) {
                return;
            }

            const split = nodeValue.split("routes");

            const replacementSpan = document.createElement("SPAN");
            replacementSpan.className = "hljs-attr";
            replacementSpan.innerText = "routes";

            node.replaceWith(split[0], replacementSpan, split[1]);
        });
    }

    doHighlightFix3(element: HTMLElement): void {
        const textNodes = this.getTextNodes(element);

        textNodes.forEach((node) => {
            const nodeValue = node.nodeValue || "";

            if (!nodeValue.includes("m.")) {
                return;
            }

            const split = nodeValue.split("m");

            const replacementSpan = document.createElement("SPAN");
            replacementSpan.className = "hljs-attr";
            replacementSpan.innerText = "m";

            node.replaceWith(split[0], replacementSpan, split[1]);
        });
    }

    getTextNodes(node: ChildNode, includeWhitespaceNodes = false, textNodes: ChildNode[] = []): ChildNode[] {
        const whitespace = /^\s*$/;

        if (node.nodeType == 3) {
            if (includeWhitespaceNodes || !whitespace.test(node.nodeValue || "")) {
                textNodes.push(node);
            }
        } else {
            for (const childNode of Array.from(node.childNodes)) {
                this.getTextNodes(childNode, includeWhitespaceNodes, textNodes);
            }
        }

        return textNodes;
    }
}
