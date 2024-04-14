import {Directive, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[appTypewriterEffect]',
  standalone: true
})
export class TypewriterEffectDirective implements OnChanges {
  @Input() appTypewriterEffect: string = "";

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appTypewriterEffect']) {
      this.animateLastCharacter();
    }
  }

  private animateLastCharacter(): void {
    const text = this.appTypewriterEffect || '';
    console.log("animate there")
    if (text.length > 0) {
      console.log("animate here: " + `${text.substring(0, text.length - 1)}<span class="animate-char">${text.substring(text.length - 1)}</span>` )
      // Wrap the last character in a span with an animation class
      const animatedText = `${text.substring(0, text.length - 1)}<span class="animate-char">${text.substring(text.length - 1)}</span>`;
      this.el.nativeElement.innerHTML = animatedText;
    }
  }
}
