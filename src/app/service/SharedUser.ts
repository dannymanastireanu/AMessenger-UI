import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {User} from '../model/User';


@Injectable()
export class SharedUser {
	private user = new BehaviorSubject<User>(null);
	sharedUser = this.user.asObservable();

	constructor() {}

	nextUser(user: User): void{
		this.user.next(user);
	}
}
