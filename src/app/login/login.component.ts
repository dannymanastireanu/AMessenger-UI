import {Component, Injectable, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/User';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from "../../environments/environment";

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit{

	private user: User;
	// tslint:disable-next-line:variable-name
	constructor(private router: Router, private http: HttpClient) { }


	ngOnInit(): void {
	}


	public loginRequest(username: string, password: string): any {
		this.user = new User(username, password, '', username, null);
		console.log(this.user);

		const obsuser = this.http.post(environment.apiUrl + 'user/login', this.user,
			{responseType: 'text'}).subscribe(
			data => {
			  console.log(data);
			  if(data.split(' ')[1] === "ERROR"){
			    alert('Wrong user or password');
        } else {
          localStorage.setItem('authorization', data);
          this.router.navigate(['/messenger']);
        }

			}, error => {
				if (error.status === 403) {
					alert('Wrong user or password');
				}
			}
		);
	}


	goToRegister(): void {
		console.log('got to register');
	}
}


