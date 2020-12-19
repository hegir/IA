import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot, Route } from "@angular/router";
import { fadeInItems } from "@angular/material";

export class CustomReuseStrategy extends RouteReuseStrategy {
  handlers: { [path: string]: DetachedRouteHandle } = {};
  isNew: boolean = false;
  lastNewRoutePath: string = '';


  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    if (this.routeForAttach.find(x => x === this.getRoutePath(route)) == undefined) {
      return false;
    }
    else if (this.handlers[this.getRoutePath(route)] === null)
      return false;

    return true;
  }


  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    let path: string = this.getRoutePath(route);
    if (route) {
      let config: Route = route.routeConfig;
      var reuseRoute: boolean = config != null && config.hasOwnProperty('data') && config.data.hasOwnProperty('reuseRoute') && config.data.reuseRoute;

      if (reuseRoute && handle != null) {
        this.handlers[path] = handle;
        let childRoute: ActivatedRouteSnapshot = route.firstChild;
        let futureRedirectTo = childRoute ? childRoute.url.map(function (urlSegment) {
          return urlSegment.path;
        }).join('/') : '';
        let childRouteConfigs: Route[] = config.children;
        if (childRouteConfigs) {
          let redirectConfigIndex: number;
          let redirectConfig: Route = childRouteConfigs.find(function (childRouteConfig, index) {
            if (childRouteConfig.path === '' && !!childRouteConfig.redirectTo) {
              redirectConfigIndex = index;
              return true;
            }
            return false;
          });
          if (redirectConfig) {
            if (futureRedirectTo !== '') {
              redirectConfig.redirectTo = futureRedirectTo;
            }
            else {
              childRouteConfigs.splice(redirectConfigIndex, 1);
            }
          }
          else if (futureRedirectTo !== '') {
            childRouteConfigs.push({
              path: '',
              redirectTo: futureRedirectTo,
              pathMatch: 'dashboard'
            });
          }
        }
      }
    }
  }
  routeForAttach: string[] = new Array();

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    var config = route.routeConfig;
    var reuseRoute: boolean = config != null && config.hasOwnProperty('data') && config.data.hasOwnProperty('reuseRoute') && config.data.reuseRoute;
    var url = this.getRoutePath(route);
    if (this.routeForAttach.find(x => x === url) === undefined && reuseRoute)
      this.routeForAttach.push(url);
    if (!reuseRoute)
      return false;

    return !!this.handlers[this.getRoutePath(route)];
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    let config: Route = route.routeConfig;
    if (!config || config.loadChildren) {
      return false;
    }
    if (this.isNew && this.lastNewRoutePath.includes(this.getRoutePath(route))) {
      delete this.handlers[this.getRoutePath(route)];
      this.isNew = false;
      return false;
    }

    return this.handlers[this.getRoutePath(route)];
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    var futurePath = this.getRoutePath(future);
    var currentPath = this.getRoutePath(curr);
    if (!futurePath.includes(currentPath)) {
      delete this.handlers[futurePath];
      return false;
    }
    if (future.params != null && future.params.id != null && future.params.id == "0") {
      this.isNew = true;
      this.lastNewRoutePath = futurePath;
      return false;
    }
    return future.routeConfig === curr.routeConfig;
  }

  getRoutePath(route: ActivatedRouteSnapshot): string {
    let namedOutletCount: number = 0;
    return route.pathFromRoot.reduce((path, route) => {
      let config: Route = route.routeConfig;
      if (config) {
        if (config.outlet && config.outlet !== "primary") {
          path += `(${config.outlet})`;
          namedOutletCount++;
        }
        else {
          path += '/';
        }
        if (config.path == "login") {
          this.clear();
        }
        return path += config.path;
      }
      return path;
    }, '') + (namedOutletCount ? new Array(namedOutletCount + 1).join(')') : '');
  }


  clear() {
    this.routeForAttach.forEach(route => {
      delete this.handlers[route];
    });
  }
}
