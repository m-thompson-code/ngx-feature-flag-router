import { Injectable } from '@angular/core';
import hljs from 'highlight.js';

@Injectable({
    providedIn: 'root',
})
export class HighlightService {
    highlight(element?: HTMLElement): void {
        const source = element || document;

        source.querySelectorAll('pre code, .inline-highlight').forEach((el) => {
            // then highlight each
            hljs.highlightElement(el as HTMLElement);
        });

        this.doHighlightFixes(element || document.body);
    }

    doHighlightFixes(element: HTMLElement): void {
        this.doHighlightFix1(element);
        this.doHighlightFix2(element);
        this.doHighlightFix3(element);
        this.doHighlightFix4(element);
        this.doHighlightFix5(element);
        this.doHighlightFix6(element);
        this.doHighlightFix7(element);
        this.doHighlightFix8(element);
    }

    doHighlightFix1(element: HTMLElement): void {
        const textNodes = this.getTextNodes(element);

        textNodes.forEach((node) => {
            const nodeValue = node.nodeValue || '';

            if (nodeValue !== '@NgModule' && nodeValue !== '@Injectable') {
                return;
            }

            const replacementSpan = document.createElement('SPAN');
            replacementSpan.className = 'hljs';
            replacementSpan.innerText = '@';

            const replacementSpan2 = document.createElement('SPAN');
            replacementSpan2.className = 'hljs-title class_';
            replacementSpan2.innerText = nodeValue.replace('@', '');

            node.replaceWith(replacementSpan, replacementSpan2);
        });
    }

    doHighlightFix2(element: HTMLElement): void {
        const textNodes = this.getTextNodes(element);

        textNodes.forEach((node) => {
            const nodeValue = node.nodeValue || '';

            if (!nodeValue.includes('(routes')) {
                return;
            }

            const split = nodeValue.split('routes');

            const replacementSpan = document.createElement('SPAN');
            replacementSpan.className = 'hljs-attr';
            replacementSpan.innerText = 'routes';

            node.replaceWith(split[0], replacementSpan, split[1]);
        });
    }

    doHighlightFix3(element: HTMLElement): void {
        const textNodes = this.getTextNodes(element);

        textNodes.forEach((node) => {
            const nodeValue = node.nodeValue || '';

            if (!nodeValue.includes('m.')) {
                return;
            }

            const split = nodeValue.split('m');

            const replacementSpan = document.createElement('SPAN');
            replacementSpan.className = 'hljs-attr';
            replacementSpan.innerText = 'm';

            node.replaceWith(split[0], replacementSpan, split[1]);
        });
    }

    doHighlightFix4(element: HTMLElement): void {
        const textNodes = this.getTextNodes(element);

        textNodes.forEach((node) => {
            const nodeValue = node.nodeValue || '';

            if (nodeValue !== 'this') {
                return;
            }

            const replacementSpan = document.createElement('SPAN');
            replacementSpan.className = 'hljs-variable language_ this-color this-color';
            replacementSpan.innerText = 'this';
            node.replaceWith(replacementSpan);
        });
    }

    doHighlightFix5(element: HTMLElement): void {
        const textNodes = this.getTextNodes(element);

        textNodes.forEach((node) => {
            const nodeValue = node.nodeValue || '';

            if (!nodeValue.includes(':')) {
                return;
            }

            const split = nodeValue.split(':');

            const replacementSpan = document.createElement('SPAN');
            replacementSpan.className = 'white-symbol-color';
            replacementSpan.innerText = ':';

            const replacementSpan2 = document.createElement('SPAN');
            replacementSpan2.className = 'hljs-title class_';
            replacementSpan2.innerText = split[1];

            node.replaceWith(split[0], replacementSpan, replacementSpan2);
        });
    }

    doHighlightFix6(element: HTMLElement): void {
        const textNodes = this.getTextNodes(element);

        textNodes.forEach((node) => {
            const nodeValue = node.nodeValue || '';

            if (nodeValue !== 'return') {
                return;
            }

            const replacementSpan = document.createElement('SPAN');
            replacementSpan.className = 'return-color';
            replacementSpan.innerText = 'return';
            node.replaceWith(replacementSpan);
        });
    }

    doHighlightFix7(element: HTMLElement): void {
        const textNodes = this.getTextNodes(element);

        textNodes.forEach((node) => {
            const nodeValue = node.nodeValue || '';

            if (!nodeValue.endsWith('.')) {
                return;
            }

            if (nodeValue.startsWith('/')) {
                return;
            }

            const split = nodeValue.split('.');

            if (split.length !== 2) {
                return;
            }

            if (split[0] === ')') {
                return;
            }

            const replacementSpan = document.createElement('SPAN');
            replacementSpan.className = 'hljs-attr';
            replacementSpan.innerText = split[0];

            const replacementSpan2 = document.createElement('SPAN');
            replacementSpan2.className = 'white-symbol-color';
            replacementSpan2.innerText = '.';

            node.replaceWith(replacementSpan, replacementSpan2);
        });
    }

    doHighlightFix8(containerElement: HTMLElement): void {
        const textNodes = this.getTextNodes(containerElement);
        const elements = textNodes.map((textNode) => textNode.parentElement);

        elements.forEach((element) => {
            if (!element) {
                return;
            }

            if (element.nextSibling?.textContent === '<') {
                element.classList.add('method-color');
            }

            const firstCharacter = element.textContent?.trim().charAt(0);

            if (!firstCharacter) {
                return;
            }

            if (firstCharacter !== firstCharacter.toUpperCase()) {
                return;
            }

            if (element.classList.contains('hljs-property')) {
                element.classList.add('class-color');
            }
        });
    }

    getTextNodes(node: ChildNode, includeWhitespaceNodes = false, textNodes: ChildNode[] = []): ChildNode[] {
        const whitespace = /^\s*$/;

        if (node.nodeType == 3) {
            if (includeWhitespaceNodes || !whitespace.test(node.nodeValue || '')) {
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
