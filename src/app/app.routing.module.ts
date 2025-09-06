import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // { path: '', redirectTo: 'quote-engine', pathMatch: 'full' },
  { path: '', redirectTo: 'admin/login', pathMatch: 'full' },
  { path: 'admin', loadChildren: () =>
      import("./admin/admin.module").then((m) => m.AdminModule)
  }


]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
