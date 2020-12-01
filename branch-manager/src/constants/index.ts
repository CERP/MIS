export enum AppUserRole {
	ADMIN = 'ADMIN',
	SUB_ADMIN = 'SUB_ADMIN'
}

export enum SiteConfig {
	SITE_TITLE = 'MIS Branch Manager',
	SITE_TITLE_ALT = 'MISchool Branch Manager',
	EMAIL = '',
	APP_LOGO = '',
	APP_URL = '',
	DESCRIPTION = ''
}

export enum AlertActionTypes {
	PENDING = 'PENDING',
	SUCCESS = 'SUCCESS',
	ERROR = 'ERROR',
	CLEAR = 'CLEAR'
}

export enum UserActionTypes {
	LOGIN_REQUEST = 'LOGIN_REQUEST',
	LOGIN_SUCCESS = 'LOGIN_SUCCESS',
	LOGIN_FAILURE = 'LOGIN_FAILURE',

	LOGOUT = 'LOGOUT'
}
