import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { HighlightService } from '../services/highlight/highlight.service';

@Component({
    selector: 'demo-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
    constructor(private readonly elementRef: ElementRef, private readonly highlightService: HighlightService) {}

    ngAfterViewInit(): void {
        this.highlightService.highlight(this.elementRef.nativeElement);
    }

    scrollIntoView(elementTagName: string): void {
        const element = document.getElementsByTagName(elementTagName)[0];
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'start',
            });
        } else {
            console.warn('Unexpected missing element', elementTagName);
        }
    }
}
