import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventSlideComponent } from "../event-slide/event-slide.component";

@Component({
    selector: 'app-hero-section',
    standalone: true,
    templateUrl: './hero-section.component.html',
    styleUrl: './hero-section.component.css',
    imports: [RouterLink, EventSlideComponent]
})
export class HeroSectionComponent {
  scrollToAbout(): void {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  }
}
