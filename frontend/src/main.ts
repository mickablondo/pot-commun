import { bootstrapApplication } from "@angular/platform-browser";
import {
  provideHttpClient,
  withInterceptors,
  withXhr,
} from "@angular/common/http";
import { AppComponent } from "./app/app.component";
import { provideRouter } from "@angular/router";
import { AuthGuard } from "./app/guards/auth.guard";
import { authInterceptor } from "./app/interceptors/auth.interceptor";

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
      import("./app/components/dashboard/dashboard.component").then(
        (m) => m.DashboardComponent,
      ),
    canActivate: [AuthGuard],
  },
];

/**
 * Point d'entrée principal de l'application.
 */
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withXhr(), withInterceptors([authInterceptor])),
    provideRouter(routes),
  ],
}).catch((err) => console.error(err));
