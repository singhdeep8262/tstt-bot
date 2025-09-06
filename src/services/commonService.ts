import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class CommonService extends BaseService {
	public static isAuthenticated = false;
	public static sessionTimeout = false;
	public static isShowSessionTimeoutModal: boolean = false;
	public accountDetails: any;
	public cardsDetails: any;
	private accessToken: any;
	public customerID: any;

	public constructor(_http: HttpClient, private cookie_service: CookieService) {
		super(_http);
	}
	setAccessToken(token) {
		this.accessToken = token;
	}

	public setCustomerId(val) {
		this.customerID = val;
	}

	public getCustomerId() {
		return this.customerID;
	}

	public setAccountDetails(data) {
		this.accountDetails = data;
	}

	public getAccountDetails() {
		return this.accountDetails;
	}
	public setCardsDetails(data) {
		this.cardsDetails = data;
	}

	public getCardsDetails() {
		return this.cardsDetails;
	}

	public login(body: any): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
		});
		const url = 'api/admin/login';
		return this.regularPostRequest(url, body, headers);
	}

	public getRoles(body, page): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		let url = `api/admin/role?&page=${page}&limit=10`;
		if (body.name) {
			url += `&name=${body.name}`;
		}
		if (body.key) {
			url += `&key=${body.key}`;
		}
		return this.regularGetRequest(url, headers);
	}
	public getFeedback(body, page, id?: any): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		let url = `api/admin/nps-surveys?&page=${page}&limit=10`;
		if (body.formLabel) {
			url += `&formLabel=${body.formLabel}`;
		}
		// if (id) {
		// 	url += `&formId=${id}`;
		// }
		return this.regularGetRequest(url, headers);
	}
	public addFeedback(body) {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = 'api/admin/nps-surveys';
		return this.regularPostRequest(url, body, headers);
	}
	public updateSurvey(id, body): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/nps-surveys/${id}`;
		return this.regularPutRequest(url, body, headers);
	}
	public changeStatus(id): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/nps-surveys/${id}/toggle-form-status`;
		return this.regularPutRequest(url, "",headers);
	}
	public deleteFeedback(id): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/nps-surveys/${id}`;
		return this.regularDeleteRequest(url, headers);
	}

	public getModules(body, page): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		let url = `api/admin/module?&page=${page}&limit=10`;
		if (body.name) {
			url += `&name=${body.name}`;
		}
		if (body.key) {
			url += `&key=${body.key}`;
		}
		if (body.url) {
			url += `&url=${body.url}`;
		}
		return this.regularGetRequest(url, headers);
	}

	public getDropdownRoles(): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = 'api/admin/role';
		return this.regularGetRequest(url, headers);
	}

	public logoutUnauthenticated(body) {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = 'api/admin/logout';
		return this.regularPostRequest(url, body, headers);
	}

	public getEditRole(roleId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/role/${roleId}`;
		return this.regularGetRequest(url, headers);
	}

	public getCustomerData(customerId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/customer-management/customer/${customerId}`;
		return this.regularGetRequest(url, headers);
	}

	public getEditModule(moduleId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/module/${moduleId}`;
		return this.regularGetRequest(url, headers);
	}

	public editRole(body, roleId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/role/${roleId}`;
		return this.regularPutRequest(url, body, headers);
	}

	//heirarchy
	public confirmNewHeirarchy(body): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/role/hierarchy`;
		return this.regularPutRequest(url, body, headers);
	}

	public getEditUser(userId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/user/${userId}`;
		return this.regularGetRequest(url, headers);
	}

	public editUser(body, userId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/user/${userId}`;
		return this.regularPutRequest(url, body, headers);
	}
	public editModule(body, moduleId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/module/${moduleId}`;
		return this.regularPutRequest(url, body, headers);
	}

	public getUsers(body, page): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		let url = `api/admin/user?&page=${page}&limit=10`;
		if (body.email) {
			url += `&email=${body.email}`;
		}
		if (body.username) {
			url += `&username=${body.username}`;
		}
		if (body.roleIds) {
			url += `&roleIds=[${body.roleIds}]`;
		}
		if (body.firstName) {
			url += `&firstName=${body.firstName}`;
		}
		if (body.lastName) {
			url += `&lastName=${body.lastName}`;
		}
		if (body.phone) {
			url += `&phone=${body.phone}`;
		}
		return this.regularGetRequest(url, headers);
	}

	public getFaqList(body, page): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		let url = `api/admin/faq?&page=${page}&limit=10`;
		if (body.label) {
			url += `&label=${body.label}`;
		}
		return this.regularGetRequest(url, headers);
	}
	public createNewFaq(body: any): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = 'api/admin/faq';
		return this.regularPostRequest(url, body, headers);
	}

	public UpdateFaq(faqId, body): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/faq/${faqId}`;
		return this.regularPutRequest(url, body, headers);
	}
	public DeleteFaq(faq): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/faq/${faq}`;
		return this.regularDeleteRequest(url, headers);
	}
	public editfaqLabel(labelId, body): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/faq/${labelId}/label`;
		return this.regularPutRequest(url, body, headers);
	}
	public getCustomerList(body, page ,isAll): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		let url = `api/admin/customer-management/customer?&page=${page}&limit=10&isAll=${isAll}`;

		if (body.fromDate) {
			url += `&fromDate=${body.fromDate}`;
		}
		if (body.toDate) {
			url += `&toDate=${body.toDate}`;
		}
		if (body.email) {
			url += `&email=${body.email}`;
		}
		if (body.firstName) {
			url += `&firstName=${body.firstName}`;
		}
		if (body.lastName) {
			url += `&lastName=${body.lastName}`;
		}
		if (body.status) {
			url += `&status=${body.status}`;
		}
		if (body.phone) {
			url += `&phone=${body.phone}`;
		}
		if (body.customerId) {
			url += `&customerId=${body.customerId}`;
		}
		return this.regularGetRequest(url, headers);
	}

	public createUser(body: any): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = 'api/admin/user';
		return this.regularPostRequest(url, body, headers);
	}

	public logoutCustomers(customerId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/customer-management/customer/${customerId}/logout`;
		return this.regularPutRequest(url, '', headers);
	}

	public editMobile(body, customerId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/customer-management/customer/${customerId}`;
		return this.regularPutRequest(url, body, headers);
	}

	public createModules(body: any): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = 'api/admin/module';
		return this.regularPostRequest(url, body, headers);
	}
	public createRoles(body: any): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = 'api/admin/role';
		return this.regularPostRequest(url, body, headers);
	}

	public changePassword(body: any): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = 'api/admin/change-password';
		return this.regularPostRequest(url, body, headers);
	}

	public DeleteRole(roleId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/role/${roleId}`;
		return this.regularDeleteRequest(url, headers);
	}

	public DeleteModule(moduleId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/module/${moduleId}`;
		return this.regularDeleteRequest(url, headers);
	}

	public getTransactionHistory(customerId, body, page, isAll): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		let url = `api/admin/customer-management/customer/${customerId}/transaction-history?&page=${page}&limit=10&isAll=${isAll}`;
		if (body.fromDate) {
			url += `&fromDate=${body.fromDate}`;
		}
		if (body.toDate) {
			url += `&toDate=${body.toDate}`;
		}
		if (body.status) {
			url += `&status=${body.status}`;
		}
		if (body.transactionType) {
			url += `&transactionType=${body.transactionType}`;
		}
		if (body.phone) {
			url += `&phone=${body.phone}`;
		}
		if (body.accountNumber) {
			url += `&accountNumber=${body.accountNumber}`;
		}
		return this.regularGetRequest(url, headers);

	}
	//coupon-transaction-history
	public couponTransactionHistory(body, page, isAll): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		let url = `api/admin/report/coupon-transaction-history?&page=${page}&limit=10&isAll=${isAll}`;
		if (body.couponCode) {
			url += `&couponCode=${body.couponCode}`;
		}
		if (body.couponName) {
			url += `&couponName=${body.couponName}`;
		}
		if (body.fromDate) {
			url += `&fromDate=${body.fromDate}`;
		}
		if (body.toDate) {
			url += `&toDate=${body.toDate}`;
		}
		if (body.status) {
			url += `&couponStatus=${body.status}`;
		}
		if (body.couponSource) {
			url += `&couponSource=${body.couponSource}`;
		}


		// if(body.issuedPhone){
		// 	url += `&issuedPhone=${body.issuedPhone}`;
		// }
		// if(body.redeemedPhone){
		// 	url += `&redeemedPhone=${body.redeemedPhone}`;
		// }
		// if(body.email){
		// 	url += `&email=${body.email}`;
		// }
		// if (body.transactionType) {
		// 	url += `&transactionType=${body.transactionType}`;
		// }
		// if (body.phone) {
		// 	url += `&phone=${body.phone}`;
		// }
		// if (body.customerId) {
		// 	url += `&customerId=${body.customerId}`;
		// }
		// if (body.accountNumber) {
		// 	url += `&accountNumber=${body.accountNumber}`;
		// }
		return this.regularGetRequest(url, headers);

	}

	//Redeemed-coupon-transaction-history
	public getRedeemedTransactionHistory(body, page, isAll): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		let url = `api/admin/report/redeemed-coupon-transaction-history?&page=${page}&limit=10&isAll=${isAll}`;
		if (body.couponCode) {
			url += `&couponCode=${body.couponCode}`;
		}
		if (body.couponName) {
			url += `&couponName=${body.couponName}`;
		}
		if (body.influencerName) {
			url += `&influencerName=${body.influencerName}`;
		}
		if (body.couponSource) {
			url += `&couponSource=${body.couponSource}`;
		}
		if (body.firstName) {
			url += `&firstName=${body.firstName}`;
		}
		if (body.lastName) {
			url += `&lastName=${body.lastName}`;
		}
		if (body.fromDate) {
			url += `&fromDate=${body.fromDate}`;
		}
		if (body.toDate) {
			url += `&toDate=${body.toDate}`;
		}
		if (body.status) {
			url += `&transactionStatus=${body.status}`;
		}
		if (body.phone) {
			url += `&phone=${body.phone}`;
		}
		if (body.email) {
			url += `&email=${body.email}`;
		}
		if (body.customerId) {
			url += `&customerId=${body.customerId}`;
		}
		if (body.accountNumber) {
			url += `&accountNumber=${body.accountNumber}`;
		}
		return this.regularGetRequest(url, headers);

	}

	//Influencer Coupon Transaction Report
	public getinfluencerCouponReport(body, page, isAll): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		let url = `api/admin/report/influencer-coupon-transaction-history?&page=${page}&limit=10&isAll=${isAll}`;
		if (body.couponCode) {
			url += `&couponCode=${body.couponCode}`;
		}
		if (body.couponName) {
			url += `&couponName=${body.couponName}`;
		}
		if (body.influencerName) {
			url += `&influencerName=${body.influencerName}`;
		}
		return this.regularGetRequest(url, headers);

	}


	//users-transaction-history
	public getUsersTransactionHistory(body, page, isAll): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		let url = `api/admin/report/transaction-history?&page=${page}&limit=10&isAll=${isAll}`;
		if (body.fromDate) {
			url += `&fromDate=${body.fromDate}`;
		}
		if (body.toDate) {
			url += `&toDate=${body.toDate}`;
		}
		if (body.status) {
			url += `&transactionStatus=${body.status}`;
		}
		if (body.guestFilterType) {
			url += `&guestFilterType=${body.guestFilterType}`;
		}
		if (body.transactionType) {
			url += `&transactionType=${body.transactionType}`;
		}
		if (body.phone) {
			url += `&phone=${body.phone}`;
		}
		if (body.customerId) {
			url += `&customerId=${body.customerId}`;
		}
		if (body.accountNumber) {
			url += `&accountNumber=${body.accountNumber}`;
		}
		return this.regularGetRequest(url, headers);

	}
	// For status change 
	public toggleCustomerStatus(body) {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		let url = `api/admin/customer-management/customer/${body.id}/toggleUserStatus`;
		return this.regularPutRequest(url, body, headers);
	}

	// Push Notifications
	public pushNotification(body, page, isAll) {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});

		let url = `api/admin/notification/get-notification-histories?&page=${page}&limit=10&isAll=${isAll}`;
		if (body.dateFrom) {
			url += `&dateFrom=${body.dateFrom}`;
		}
		if (body.dateTo) {
			url += `&dateTo=${body.dateTo}`;
		}
		if (body.notificationCode) {
			url += `&notificationCode=${body.notificationCode}`;
		}
		return this.regularGetRequest(url, headers);
	}

	public sendNotification(body) {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		let url = `api/admin/notification/send-push-notification`;
		return this.regularPostRequest(url, body, headers);
	}

	public getrefundTransactionHistory(body, page, isAll): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		let url = `api/admin/report/refund-payment?&page=${page}&limit=10&isAll=${isAll}`;
		if (body.fromDate) {
			url += `&fromDate=${body.fromDate}`;
		}
		if (body.toDate) {
			url += `&toDate=${body.toDate}`;
		}
		if (body.paymentStatus) {
			url += `&paymentStatus=${body.paymentStatus}`;
		}
		if (body.transactionType) {
			url += `&transactionType=${body.transactionType}`;
		}
		if (body.mobileNumber) {
			url += `&mobileNumber=${body.mobileNumber}`;
		}
		if (body.customerId) {
			url += `&customerId=${body.customerId}`;
		}
		if (body.accountNumber) {
			url += `&accountNumber=${body.accountNumber}`;
		}
		return this.regularGetRequest(url, headers);

	}

	public refundPaymentById(body): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/report/refund-payment/${body.id}`;
		return this.regularPutRequest(url, body, headers);
	}

	public getPromotionBanners(page): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/customer/promotion?&page=${page}&limit=50`;
		return this.regularGetRequest(url, headers);
	}


	public addPromotionBanners(body: any): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`
		});
		const url = 'api/admin/customer/promotion';
		return this.regularPostRequest(url, body, headers);
	}

	public addAlert(body: any): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`
		});
		const url = 'api/admin/alert';
		return this.regularPostRequest(url, body, headers);
	}

	public editAlert(body, editId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/alert/${editId}`;
		return this.regularPutRequest(url, body, headers);
	}

	public addLocations(body: any): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`
		});
		const url = 'api/admin/tstt-store';
		return this.regularPostRequest(url, body, headers);
	}


	public updatePromotionBanner(body, promotionId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`
		});
		const url = `api/admin/customer/promotion/${promotionId}`;
		return this.regularPostRequest(url, body, headers);
	}

	public fetchDataImage(url): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({});
		return super.makeGetRequestForFiles(url, headers);
	}

	public deletePromotionBanner(promotionId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/customer/promotion/${promotionId}`;
		return this.regularDeleteRequest(url, headers);
	}

	public deleteAlert(alertId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/alert/${alertId}`;
		return this.regularDeleteRequest(url, headers);
	}
	public getLookups(body: any): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = 'api/admin/lookups';
		return this.regularPostRequest(url, body, headers);
	}

	public getUserLookups(body: any): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = 'api/admin/user-lookups';
		return this.regularPostRequest(url, body, headers);
	}

	//alerts

	public getAlerts(page): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/alert?&page=${page}&limit=10`;
		return this.regularGetRequest(url, headers);
	}

	//locations
	public getLocations(page): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/tstt-store?&page=${page}&limit=50`;
		return this.regularGetRequest(url, headers);
	}
	public deleteLocations(storeId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/tstt-store/${storeId}`;
		return this.regularDeleteRequest(url, headers);
	}
	public getEditLocations(storeId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/tstt-store/${storeId}`;
		return this.regularGetRequest(url, headers);
	}

	public editLocations(body, storeId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`
		});
		const url = `api/admin/tstt-store/${storeId}`;
		return this.regularPutRequest(url, body, headers);
	}

	//platform-reports

	public getReportDataValue(page, body): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		let url = `api/admin/report/export?&page=${page}`;
		if (body.fromDate) {
			url += `&fromDate=${body.fromDate}`;
		}
		if (body.toDate) {
			url += `&toDate=${body.toDate}`;
		}
		if (body.reportType) {
			url += `&reportType=${body.reportType}`;
		}
		return this.regularGetRequest(url, headers);
	}
	public generateReport(body) {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = 'api/admin/report/export';
		return this.regularPostRequest(url, body, headers);
	}
	public downloadReport(reportId) {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/report/export/${reportId}`;
		return this.regularGetRequest(url, headers);
	}
	public fileUrl(fileUrl) {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`
		});
		const url = fileUrl;
		return this.makeGetRequestForFiles(url, headers);
	}
	public deleteUser(customerId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/customer-management/customer/${customerId}`
		return this.regularDeleteRequest(url, headers);
	}

	public deletePlatformReport(reportId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/report/export/${reportId}`;
		return this.regularDeleteRequest(url, headers);
	}

	//bundles

	public getBundlesList(body, page): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		let url = `api/admin/tstt-bundles?&page=${page}&limit=10`;
		if (body.accountType) {
			url += `&accountType=${body.accountType}`;
		}
		if (body.bundleType) {
			url += `&bundleType=${body.bundleType}`;
		}
		return this.regularGetRequest(url, headers);
	}

	public deleteBundle(bundleId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/tstt-bundles/${bundleId}`;
		return this.regularDeleteRequest(url, headers);
	}

	public activeDeactivateBundle(body, bundleIdentifier): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/tstt-bundles/${bundleIdentifier}`;
		return this.regularPutRequest(url, body, headers);
	}

	public getEditBundles(bundleId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/tstt-bundles/${bundleId}`;
		return this.regularGetRequest(url, headers);
	}

	public editBundles(body, roleId): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`,
			'Content-Type': 'application/json'
		});
		const url = `api/admin/tstt-bundles/${roleId}`;
		return this.regularPutRequest(url, body, headers);
	}

	public addBundle(body: any): Observable<any> {
		const headers: HttpHeaders = new HttpHeaders({
			'Authorization': `Bearer ${this.accessToken}`
		});
		const url = 'api/admin/tstt-bundles';
		return this.regularPostRequest(url, body, headers);
	}

	/* Generic HTTP requests */
	regularPostRequest(url: any, formData: any, headers: any) {
		return super.makePostRequest(url, formData, headers)
			.pipe(map(super.extractData), catchError((e): any => {
				if (document.getElementById('loader')) {
					document.getElementById('loader').style.display = 'none';
				}
				if (e.status == 402) {
					this.logoutUnauthenticated('');
					CommonService.isAuthenticated = false;
					CommonService.sessionTimeout = true;
					window.location.href = '/#/admin/login';
					this.cookie_service.removeAll();
				}
				if (e.status == 401) {
					this.logoutUnauthenticated('');
					CommonService.isAuthenticated = false;
					window.location.href = '/#/admin/login';
					CommonService.isShowSessionTimeoutModal = true;
					this.cookie_service.removeAll();
				}
				if (e instanceof Response && window.location.hostname !== "localhost") {
					window.location.reload();
				} else {
					return throwError(() =>
						new Error(`${e.status} ${e.statusText}`)
					);
				}
			}));
	}

	regularPutRequest(url: any, body: any, headers: any) {
		return super.makePutRequest(url, body, headers)
			.pipe(map(super.extractData), catchError((e): any => {
				if (document.getElementById('loader')) {
					document.getElementById('loader').style.display = 'none';
				}
				if (e.status == 402) {
					this.logoutUnauthenticated('');
					CommonService.isAuthenticated = false;
					CommonService.sessionTimeout = true;
					window.location.href = '/#/admin/login';
					this.cookie_service.removeAll();
				}
				if (e.status == 401) {
					this.logoutUnauthenticated('');
					CommonService.isAuthenticated = false;
					window.location.href = '/#/admin/login';
					CommonService.isShowSessionTimeoutModal = true;
					this.cookie_service.removeAll();
				}
				if (e instanceof Response && window.location.hostname !== "localhost") {
					window.location.reload();
				} else {
					return throwError(() =>
						new Error(`${e.status} ${e.statusText}`)
					);
				}
			}));
	}

	regularGetRequest(url: any, headers: any) {
		return super.makeGetRequest(url, headers)
			.pipe(map(super.extractData), catchError((e): any => {
				if (document.getElementById('loader')) {
					document.getElementById('loader').style.display = 'none';
				}
				if (e.status == 402) {
					this.logoutUnauthenticated('');
					CommonService.isAuthenticated = false;
					CommonService.sessionTimeout = true;
					window.location.href = '/#/admin/login';
					this.cookie_service.removeAll();
				}
				if (e.status == 401) {
					this.logoutUnauthenticated('');
					CommonService.isAuthenticated = false;
					window.location.href = '/#/admin/login';
					CommonService.isShowSessionTimeoutModal = true;
					this.cookie_service.removeAll();
				}
				if (e instanceof Response && window.location.hostname !== "localhost") {
					window.location.reload();
				} else {
					return throwError(() =>
						new Error(`${e.status} ${e.statusText}`)
					);
				}
			}));
	}

	regularDeleteRequest(url: any, headers: any) {
		return super.makeDeleteRequest(url, headers)
			.pipe(catchError((e): any => {
				if (document.getElementById('loader')) {
					document.getElementById('loader').style.display = 'none';
				}
				if (e.status == 402) {
					this.logoutUnauthenticated('');
					CommonService.isAuthenticated = false;
					CommonService.sessionTimeout = true;
					window.location.href = '/#/admin/login';
					this.cookie_service.removeAll();
				}
				if (e.status == 401) {
					this.logoutUnauthenticated('');
					CommonService.isAuthenticated = false;
					window.location.href = '/#/admin/login';
					CommonService.isShowSessionTimeoutModal = true;
					this.cookie_service.removeAll();
				}
				if (e instanceof Response && window.location.hostname !== "localhost") {
					window.location.reload();
				} else {
					return throwError(() =>
						new Error(`${e.status} ${e.statusText}`)
					);
				}
			}));
	}

}
