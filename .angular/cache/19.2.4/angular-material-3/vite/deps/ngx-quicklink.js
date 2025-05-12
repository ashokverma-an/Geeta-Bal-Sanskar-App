import {
  PRIMARY_OUTLET,
  Router,
  RouterLink,
  RouterPreloader
} from "./chunk-PYTHWPPO.js";
import "./chunk-C2ETLFHE.js";
import "./chunk-IBN32GE7.js";
import "./chunk-7FY6VJ6T.js";
import {
  Directive,
  ElementRef,
  Inject,
  Injectable,
  InjectionToken,
  Input,
  NgModule,
  NgZone,
  Optional,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵinject
} from "./chunk-5UEM3QDS.js";
import "./chunk-PEBH6BBU.js";
import "./chunk-WPM5VTLQ.js";
import {
  EMPTY
} from "./chunk-4S3KYZTJ.js";
import "./chunk-EIB7IA3J.js";

// node_modules/ngx-quicklink/fesm2022/ngx-quicklink.mjs
var globalRegistry = [];
var PrefetchRegistry = class _PrefetchRegistry {
  constructor(router) {
    this.router = router;
    this.trees = globalRegistry;
  }
  add(tree) {
    this.trees.push(tree);
  }
  shouldPrefetch(url) {
    const tree = this.router.parseUrl(url);
    return this.trees.some(containsTree.bind(null, tree));
  }
  static {
    this.ɵfac = function PrefetchRegistry_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _PrefetchRegistry)(ɵɵinject(Router));
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _PrefetchRegistry,
      factory: _PrefetchRegistry.ɵfac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PrefetchRegistry, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: Router
  }], null);
})();
function containsQueryParams(container, containee) {
  return Object.keys(containee).length <= Object.keys(container).length && Object.keys(containee).every((key) => containee[key] === container[key]);
}
function containsTree(containee, container) {
  return containsQueryParams(container.queryParams, containee.queryParams) && containsSegmentGroup(container.root, containee.root, containee.root.segments);
}
function containsSegmentGroup(container, containee, containeePaths) {
  if (container.segments.length > containeePaths.length) {
    const current = container.segments.slice(0, containeePaths.length);
    if (!equalPath(current, containeePaths)) return false;
    if (containee.hasChildren()) return false;
    return true;
  } else if (container.segments.length === containeePaths.length) {
    if (!equalPath(container.segments, containeePaths)) return false;
    if (!containee.hasChildren()) return true;
    for (const c in containee.children) {
      if (!container.children[c]) break;
      if (containsSegmentGroup(container.children[c], containee.children[c], containee.children[c].segments)) return true;
    }
    return false;
  } else {
    const current = containeePaths.slice(0, container.segments.length);
    const next = containeePaths.slice(container.segments.length);
    if (!equalPath(container.segments, current)) return false;
    if (!container.children[PRIMARY_OUTLET]) return false;
    return containsSegmentGroup(container.children[PRIMARY_OUTLET], containee, next);
  }
}
function equalPath(as, bs) {
  if (as.length !== bs.length) return false;
  return as.every((a, i) => a.path === bs[i].path || a.path.startsWith(":") || bs[i].path.startsWith(":"));
}
var requestIdleCallback = typeof window !== "undefined" ? window.requestIdleCallback || function(cb) {
  const start = Date.now();
  return setTimeout(function() {
    cb({
      didTimeout: false,
      timeRemaining: function() {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
} : () => {
};
var observerSupported = () => typeof window !== "undefined" ? !!window.IntersectionObserver : false;
var LinkHandler = new InjectionToken("LinkHandler");
var ObservableLinkHandler = class _ObservableLinkHandler {
  constructor(loader, registry, ngZone) {
    this.loader = loader;
    this.registry = registry;
    this.ngZone = ngZone;
    this.elementLink = /* @__PURE__ */ new Map();
    this.observer = observerSupported() ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!this.observer) {
          return;
        }
        if (entry.isIntersecting) {
          const link = entry.target;
          const routerLink = this.elementLink.get(link);
          if (!routerLink || !routerLink.urlTree) return;
          this.registry.add(routerLink.urlTree);
          this.observer.unobserve(link);
          requestIdleCallback(() => {
            this.loader.preload().subscribe(() => void 0);
          });
        }
      });
    }) : null;
  }
  register(el) {
    this.elementLink.set(el.element, el);
    this.ngZone.runOutsideAngular(() => {
      if (!this.observer) {
        return;
      }
      this.observer.observe(el.element);
    });
  }
  // First call to unregister will not hit this.
  unregister(el) {
    if (!this.observer) {
      return;
    }
    if (this.elementLink.has(el.element)) {
      this.observer.unobserve(el.element);
      this.elementLink.delete(el.element);
    }
  }
  supported() {
    return observerSupported();
  }
  static {
    this.ɵfac = function ObservableLinkHandler_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ObservableLinkHandler)(ɵɵinject(RouterPreloader), ɵɵinject(PrefetchRegistry), ɵɵinject(NgZone));
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _ObservableLinkHandler,
      factory: _ObservableLinkHandler.ɵfac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ObservableLinkHandler, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: RouterPreloader
  }, {
    type: PrefetchRegistry
  }, {
    type: NgZone
  }], null);
})();
var PreloadLinkHandler = class _PreloadLinkHandler {
  constructor(loader, registry) {
    this.loader = loader;
    this.registry = registry;
  }
  register(el) {
    this.registry.add(el.urlTree);
    requestIdleCallback(() => this.loader.preload().subscribe(() => void 0));
  }
  unregister(_) {
  }
  supported() {
    return true;
  }
  static {
    this.ɵfac = function PreloadLinkHandler_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _PreloadLinkHandler)(ɵɵinject(RouterPreloader), ɵɵinject(PrefetchRegistry));
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _PreloadLinkHandler,
      factory: _PreloadLinkHandler.ɵfac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PreloadLinkHandler, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: RouterPreloader
  }, {
    type: PrefetchRegistry
  }], null);
})();
var LinkDirective = class _LinkDirective {
  constructor(linkHandlers, el, link, linkWithHref) {
    this.linkHandlers = linkHandlers;
    this.el = el;
    this.linkHandler = this.linkHandlers.filter((h) => h.supported()).shift();
    this.rl = link || linkWithHref;
    if (this.element && this.element.setAttribute) {
      this.element.setAttribute("ngx-ql", "");
    }
  }
  ngOnChanges(c) {
    if (c["routerLink"] && this.linkHandler) {
      this.linkHandler.unregister(this);
      this.linkHandler.register(this);
    }
  }
  ngOnDestroy() {
    if (!this.linkHandler) {
      return;
    }
    this.linkHandler.unregister(this);
  }
  get element() {
    return this.el.nativeElement;
  }
  get urlTree() {
    return this.rl.urlTree;
  }
  static {
    this.ɵfac = function LinkDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _LinkDirective)(ɵɵdirectiveInject(LinkHandler), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(RouterLink, 8), ɵɵdirectiveInject(RouterLink, 8));
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _LinkDirective,
      selectors: [["", "routerLink", ""]],
      inputs: {
        routerLink: "routerLink"
      },
      features: [ɵɵNgOnChangesFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LinkDirective, [{
    type: Directive,
    args: [{
      selector: "[routerLink]",
      standalone: true
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Inject,
      args: [LinkHandler]
    }]
  }, {
    type: ElementRef
  }, {
    type: RouterLink,
    decorators: [{
      type: Optional
    }]
  }, {
    type: RouterLink,
    decorators: [{
      type: Optional
    }]
  }], {
    routerLink: [{
      type: Input
    }]
  });
})();
var findPath = (config, route) => {
  config = config.slice();
  const parent = /* @__PURE__ */ new Map();
  const visited = /* @__PURE__ */ new Set();
  while (config.length) {
    const el = config.shift();
    if (!el) {
      continue;
    }
    visited.add(el);
    if (el === route) break;
    let children = el.children || [];
    const current2 = el._loadedRoutes || [];
    for (const route2 of current2) {
      if (route2 && route2.children) {
        children = children.concat(route2.children);
      }
    }
    children.forEach((r) => {
      if (visited.has(r)) return;
      parent.set(r, el);
      config.push(r);
    });
  }
  let path = "";
  let current = route;
  while (current) {
    if (isPrimaryRoute(current)) {
      path = `/${current.path}${path}`;
    } else {
      path = `/(${current.outlet}:${current.path}${path})`;
    }
    current = parent.get(current);
  }
  return path.replace(/[\/]+/, "/");
};
function isPrimaryRoute(route) {
  return route.outlet === PRIMARY_OUTLET || !route.outlet;
}
var QuicklinkStrategy = class _QuicklinkStrategy {
  constructor(registry, router) {
    this.registry = registry;
    this.router = router;
    this.loading = /* @__PURE__ */ new Set();
  }
  preload(route, load) {
    if (this.loading.has(route)) {
      return EMPTY;
    }
    const conn = typeof navigator !== "undefined" ? navigator.connection : void 0;
    if (conn) {
      if ((conn.effectiveType || "").includes("2g") || conn.saveData) return EMPTY;
    }
    if (route.data && route.data["preload"] === false) {
      return EMPTY;
    }
    const fullPath = findPath(this.router.config, route);
    if (this.registry.shouldPrefetch(fullPath)) {
      this.loading.add(route);
      return load();
    }
    return EMPTY;
  }
  static {
    this.ɵfac = function QuicklinkStrategy_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _QuicklinkStrategy)(ɵɵinject(PrefetchRegistry), ɵɵinject(Router));
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _QuicklinkStrategy,
      factory: _QuicklinkStrategy.ɵfac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(QuicklinkStrategy, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: PrefetchRegistry
  }, {
    type: Router
  }], null);
})();
var quicklinkProviders = [{
  provide: LinkHandler,
  useClass: ObservableLinkHandler,
  multi: true
}, {
  provide: LinkHandler,
  useClass: PreloadLinkHandler,
  multi: true
}, PrefetchRegistry, QuicklinkStrategy];
var QuicklinkModule = class _QuicklinkModule {
  static {
    this.ɵfac = function QuicklinkModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _QuicklinkModule)();
    };
  }
  static {
    this.ɵmod = ɵɵdefineNgModule({
      type: _QuicklinkModule,
      imports: [LinkDirective],
      exports: [LinkDirective]
    });
  }
  static {
    this.ɵinj = ɵɵdefineInjector({
      providers: quicklinkProviders
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(QuicklinkModule, [{
    type: NgModule,
    args: [{
      imports: [LinkDirective],
      exports: [LinkDirective],
      providers: quicklinkProviders
    }]
  }], null, null);
})();
export {
  LinkDirective as QuicklinkDirective,
  QuicklinkModule,
  QuicklinkStrategy,
  quicklinkProviders
};
//# sourceMappingURL=ngx-quicklink.js.map
