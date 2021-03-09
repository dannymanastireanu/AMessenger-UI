import {Component, Input, OnInit, Output} from '@angular/core';
import {Message} from '../model/Message';
import {User} from '../model/User';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Friend} from '../model/Friend';
import {NgForm} from '@angular/forms';
import {environment} from "../../environments/environment";

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

	public user;
	public friendsList: Array<Friend>;

	public messageHistory: {};

	// tslint:disable-next-line:variable-name
	constructor(private http: HttpClient) {

		// init with server req.
		this.friendsList = [];
		this.messageHistory = {};

	}

	ngOnInit(): void {
    this.refreshFriendList();
	}

	async setHistoryMessage(myFriend: Friend): Promise<void> {
		if (this.messageHistory[myFriend.username] === undefined) {
			this.messageHistory[myFriend.username] = [];
			const headers = new HttpHeaders();
			headers.set('Content-Type', 'application/json; charset=utf-8');
			await this.http.get('http://localhost:8080/avoice/messages/' + myFriend.username,
				{responseType: 'text', withCredentials: true}).subscribe( data => {
				const multeMesaje = (JSON.parse(data) as Message);
				// tslint:disable-next-line:forin
				for (const i in multeMesaje){
					this.messageHistory[myFriend.username].push(
						new Message(multeMesaje[i].from, multeMesaje[i].to, multeMesaje[i].body,
							multeMesaje[i].timestamp, multeMesaje[i].type, multeMesaje[i].cachePath, null));
				}
			});
		}
	}

	refreshFriendList(): void {
		this.http.get(environment.apiUrl + 'user/friends', {responseType: 'text', headers: {'authorization':localStorage.getItem('authorization')}}).subscribe(data => {
			this.friendsList = JSON.parse(data);
			console.log(JSON.stringify("ALL MY " + this.friendsList));
		});
	}

}

