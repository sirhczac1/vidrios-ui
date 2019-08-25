import {authenticationService} from '@/services';

export function authHeader() {
	const currentUser = authenticationService.currrentUserValue;
	if (currentUser && currentUser.token) {
    return { Authorization: `Bearer ${currentUser.token}` };
	}
	return {};
}