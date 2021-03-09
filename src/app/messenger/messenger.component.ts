import {Component, HostListener, OnInit} from '@angular/core';
import {User} from '../model/User';
import {LoginComponent} from '../login/login.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from "../../environments/environment";


@Component({
	selector: 'app-messenger',
	templateUrl: './messenger.component.html',
	styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit {
	clickedRoom = true;
	private peoples;


	message: User;

	constructor(private http: HttpClient) {
	}

	ngOnInit(): void {
		this.makeOnline();
	}

	ngOnDestroy() {
		this.makeOffline();
	}

	async makeOnline(): Promise<void> {
		await this.http.post(environment.apiUrl + 'user/messenger/onlinestatus', "", {headers: {'authorization':localStorage.getItem('authorization')}}).subscribe(res => {
      }, error => console.error(error => console.error(error)))
	}

	async makeOffline(): Promise<void> {
    await this.http.post(environment.apiUrl + 'user/messenger/offlinestatus', "",{headers: {'authorization':localStorage.getItem('authorization')}}).subscribe(data => {
    });
	}

	name = 'Angular';
	@HostListener('window:beforeunload')
	doSomething() {
		this.makeOffline();
	}
	@HostListener('window:unload', [ '$event' ])
	unloadHandler(event) {
		this.makeOffline()
	}
}
