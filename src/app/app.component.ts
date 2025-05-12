import { Component, Renderer2, effect, inject } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";
import { DOCUMENT } from "@angular/common";
import { ThemeService } from "./theme/theme.service";
import { filter } from "rxjs";

@Component({
    selector: "app-root",
    imports: [LayoutComponent, RouterOutlet],
    templateUrl: "./app.component.html",
})
export class AppComponent {
  #themeService = inject(ThemeService);
  #document = inject(DOCUMENT);
  #renderer = inject(Renderer2);
  isRootRoute = false;

  userLoggedIn=false;
  
  constructor(private router: Router, private route: ActivatedRoute) {
    effect(() => {
      this.#renderer.setAttribute(this.#document.documentElement, "class", this.#themeService.theme());
    });
  }

  ngOnInit() {
     
    // localStorage.clear();
    if(localStorage.getItem('token')){
      this.userLoggedIn=true;
  
    }
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isRootRoute = event.urlAfterRedirects === '/';
    });

  }
}
