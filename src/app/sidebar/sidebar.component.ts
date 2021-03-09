import {Component, Input, OnInit, Output} from '@angular/core';
import {Message} from '../model/Message';
import {User} from '../model/User';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Friend} from '../model/Friend';
import {NgForm} from '@angular/forms';
import {environment} from "../../environments/environment";
import {SharedUser} from "../service/SharedUser";

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

	public user: User;
	public friendsList: Array<Friend>;

	public messageHistory: {};

	// tslint:disable-next-line:variable-name
	constructor(private http: HttpClient, private sharedUser: SharedUser) {

		// init with server req.
		this.friendsList = [];
		this.messageHistory = {};
	}

	ngOnInit(): void {
    this.refreshFriendList();
    this.sharedUser.sharedUser.subscribe(u => this.user = u);
	}

	refreshFriendList(): void {
		this.http.get(environment.apiUrl + 'user/friends', {responseType: 'text', headers: {'authorization':localStorage.getItem('authorization')}}).subscribe(data => {
			this.friendsList = JSON.parse(data);
		});
	}

}

