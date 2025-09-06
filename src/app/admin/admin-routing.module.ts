import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { RolesComponent } from './roles/roles.component';
import { ModulesComponent } from './modules/modules.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { CreateModuleComponent } from './create-module/create-module.component';
import { EditRoleComponent } from './edit-role/edit-role.component';
import { EditModuleComponent } from './edit-module/edit-module.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { DemographicsComponent } from './demographics/demographics.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { AddedAccountsComponent } from './added-accounts/added-accounts.component';
import { AuthGuard } from '../auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UsersTransactionHistoryComponent } from './users-transaction-history/users-transaction-history.component';
import { PromotionsComponent } from './promotions/promotions.component';
import { RefundPaymentComponent } from './refund-payment/refund-payment.component';
import { LocationsComponent } from './locations/locations.component';
import { EditLocationsComponent } from './edit-locations/edit-locations.component';
import { AddLocationsComponent } from './add-locations/add-locations.component';
import { AddedCardsComponent } from './added-cards/added-cards.component';
import { BundlesComponent } from './bundles/bundles.component';
import { AddPromotionsComponent } from './add-promotions/add-promotions.component';
import { EditPromotionsComponent } from './edit-promotions/edit-promotions.component';
import { PlatformReportsComponent } from './platform-reports/platform-reports.component';
import { AddPlatformReportComponent } from './add-platform-report/add-platform-report.component';
import { EditBundlesComponent } from './edit-bundles/edit-bundles.component';
import { AddBundlesComponent } from './add-bundles/add-bundles.component';
import { AlertsComponent } from './alerts/alerts.component';
import { AddAlertsComponent } from './add-alerts/add-alerts.component';
import { CouponTransactionHistoryComponent } from './coupon-transaction-history/coupon-transaction-history.component';
import { RedeemedCouponTransactionHistoryComponent } from './redeemed-coupon-transaction-history/redeemed-coupon-transaction-history.component';
import { InfuencerCouponTransactionReportComponent } from './infuencer-coupon-transaction-report/infuencer-coupon-transaction-report.component';
import { PushNotificationComponent } from './push-notification/push-notification.component';
import { FaqComponent } from './faq/faq.component';
import { FeedbackManagementComponent } from './feedback-management/feedback-management.component';
import { AddSurveyComponent } from './add-survey/add-survey.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'create-user', component: CreateUserComponent, canActivate: [AuthGuard] },
  { path: 'roles', component: RolesComponent, canActivate: [AuthGuard] },
  { path: 'create-role', component: CreateRoleComponent, canActivate: [AuthGuard] },
  { path: 'modules', component: ModulesComponent, canActivate: [AuthGuard] },
  { path: 'create-module', component: CreateModuleComponent, canActivate: [AuthGuard] },
  { path: 'edit-role', component: EditRoleComponent, canActivate: [AuthGuard] },
  { path: 'edit-module', component: EditModuleComponent, canActivate: [AuthGuard] },
  { path: 'edit-user', component: EditUserComponent, canActivate: [AuthGuard] },
  { path: 'customer-management', component: CustomerManagementComponent, canActivate: [AuthGuard] },
  { path: 'demographics', component: DemographicsComponent, canActivate: [AuthGuard] },
  { path: 'transaction-history', component: TransactionHistoryComponent, canActivate: [AuthGuard] },
  { path: 'added-accounts', component: AddedAccountsComponent, canActivate: [AuthGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'users-transaction-history', component: UsersTransactionHistoryComponent, canActivate: [AuthGuard] },
  { path: 'promotions', component: PromotionsComponent, canActivate: [AuthGuard] },
  { path: 'refund-payment', component: RefundPaymentComponent, canActivate: [AuthGuard] },
  { path: 'locations', component: LocationsComponent, canActivate: [AuthGuard] },
  { path: 'edit-locations', component: EditLocationsComponent, canActivate: [AuthGuard] },
  { path: 'add-locations', component: AddLocationsComponent, canActivate: [AuthGuard] },
  { path: 'add-cards', component: AddedCardsComponent, canActivate: [AuthGuard] },
  { path: 'bundles', component: BundlesComponent, canActivate: [AuthGuard] },
  { path: 'add-promotions', component: AddPromotionsComponent, canActivate: [AuthGuard] },
  { path: 'edit-promotions', component: EditPromotionsComponent, canActivate: [AuthGuard] },
  { path: 'platform-reports', component: PlatformReportsComponent, canActivate: [AuthGuard] },
  { path: 'add-platform-report', component: AddPlatformReportComponent, canActivate: [AuthGuard] },
  { path: 'add-bundles', component: AddBundlesComponent, canActivate: [AuthGuard] },
  { path: 'edit-bundles', component: EditBundlesComponent, canActivate: [AuthGuard] },
  { path: 'alert', component: AlertsComponent, canActivate: [AuthGuard] },
  { path: 'add-alert', component: AddAlertsComponent, canActivate: [AuthGuard] },
  { path: 'coupon-transaction-history', component: CouponTransactionHistoryComponent, canActivate: [AuthGuard] },
  { path: 'redeemed-coupon-transaction-history', component: RedeemedCouponTransactionHistoryComponent, canActivate: [AuthGuard] },
  { path: 'influencer-coupon-transaction-report', component: InfuencerCouponTransactionReportComponent, canActivate: [AuthGuard] },
  { path: 'push-notification', component: PushNotificationComponent, canActivate: [AuthGuard] },
  { path: 'faq', component: FaqComponent, canActivate: [AuthGuard] },
  { path:'survey-management',component :FeedbackManagementComponent, canActivate:[AuthGuard]},
  {path:'add-survey',component:AddSurveyComponent,canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
