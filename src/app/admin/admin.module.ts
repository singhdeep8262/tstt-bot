import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { UsersComponent } from './users/users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../common/common.module';
import { RolesComponent } from './roles/roles.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { ModulesComponent } from './modules/modules.component';
import { CreateModuleComponent } from './create-module/create-module.component';
import { EditRoleComponent } from './edit-role/edit-role.component';
import { EditModuleComponent } from './edit-module/edit-module.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { DemographicsComponent } from './demographics/demographics.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { AddedAccountsComponent } from './added-accounts/added-accounts.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UsersTransactionHistoryComponent } from './users-transaction-history/users-transaction-history.component';
import { PromotionsComponent } from './promotions/promotions.component';
import { RefundPaymentComponent } from './refund-payment/refund-payment.component';
import { LocationsComponent } from './locations/locations.component';
import { AddLocationsComponent } from './add-locations/add-locations.component';
import { EditLocationsComponent } from './edit-locations/edit-locations.component';
import { BundlesComponent } from './bundles/bundles.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddPromotionsComponent } from './add-promotions/add-promotions.component';
import { EditPromotionsComponent } from './edit-promotions/edit-promotions.component';
import { PlatformReportsComponent } from './platform-reports/platform-reports.component';
import { AddPlatformReportComponent } from './add-platform-report/add-platform-report.component';
import { AddedCardsComponent } from './added-cards/added-cards.component';
import { AddBundlesComponent } from './add-bundles/add-bundles.component';
import { EditBundlesComponent } from './edit-bundles/edit-bundles.component';
import { AlertsComponent } from './alerts/alerts.component';
import { AddAlertsComponent } from './add-alerts/add-alerts.component';
import { CouponTransactionHistoryComponent } from './coupon-transaction-history/coupon-transaction-history.component';
import { RedeemedCouponTransactionHistoryComponent } from './redeemed-coupon-transaction-history/redeemed-coupon-transaction-history.component';
import { InfuencerCouponTransactionReportComponent } from './infuencer-coupon-transaction-report/infuencer-coupon-transaction-report.component';
import { PushNotificationComponent } from './push-notification/push-notification.component';
import { FaqComponent } from './faq/faq.component';
import { FeedbackManagementComponent } from './feedback-management/feedback-management.component';
import { AddSurveyComponent } from './add-survey/add-survey.component';

@NgModule({
  declarations: [
    UsersComponent,
    CreateUserComponent,
    LoginComponent,
    RolesComponent,
    CreateRoleComponent,
    ModulesComponent,
    CreateModuleComponent,
    EditRoleComponent,
    EditModuleComponent,
    EditUserComponent,
    CustomerManagementComponent,
    DemographicsComponent,
    TransactionHistoryComponent,
    AddedAccountsComponent,
    ChangePasswordComponent,
    UsersTransactionHistoryComponent,
    PromotionsComponent,
    RefundPaymentComponent,
    LocationsComponent,
    AddLocationsComponent,
    EditLocationsComponent,
    BundlesComponent,
    AddPromotionsComponent,
    EditPromotionsComponent,
    PlatformReportsComponent,
    AddPlatformReportComponent,
    AddedCardsComponent,
    AddBundlesComponent,
    EditBundlesComponent,
    CouponTransactionHistoryComponent,
    AlertsComponent,
    AddAlertsComponent,
    CouponTransactionHistoryComponent,
    RedeemedCouponTransactionHistoryComponent,
    InfuencerCouponTransactionReportComponent,
    PushNotificationComponent,
    FaqComponent,
    FeedbackManagementComponent,
    AddSurveyComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    DragDropModule,
    NgSelectModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot()
  ],
  providers: [BsDatepickerConfig]
})
export class AdminModule { }
