import { bootstrapApplication } from "@angular/platform-browser";
import { provideHttpClient, withXhr } from "@angular/common/http";
import { AppComponent } from "./app/app.component";
import { provideRouter } from "@angular/router";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./app/interceptors/auth.interceptor";
import { AuthGuard } from "./app/guards/auth.guard";

/**
 * Configuration des routes de l'application.
 */
const routes = [
  {
    path: "login",
    loadComponent: () =>
      import("./app/components/login/login.component").then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: "",
    loadComponent: () =>
      import("./app/app.component").then((m) => m.AppComponent),
    canActivate: [AuthGuard],
  },
];

/**
 * Point d'entrée principal de l'application.
 */
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withXhr()),
    provideRouter(routes),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
}).catch((err) => console.error(err));
