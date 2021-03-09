import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../model/User';
import { Image } from '../model/Image';
import {environment} from "../../environments/environment";
declare var require: any

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
    imageFile: Image = null;
    public fileName: string;
    constructor(private router: Router, private http: HttpClient) {
        this.fileName = 'Choose profile image...';
        this.http.get('./../../assets/avatar.jpg', { responseType: 'blob' })
            .subscribe(res => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result;
                    this.imageFile = new Image();
                    this.imageFile.name = 'default';
                    this.imageFile.type = 'jpg';
                    this.imageFile.pic = base64data;
                };
                reader.readAsDataURL(res);
            });
    }

    ngOnInit(): void {}

    registerRequest( fullname: string, mail: string, username: string, password: string ): void {
        const user: User = new User( username, password, fullname, mail, this.imageFile.pic);

        const obsuser = this.http.post(environment.apiUrl + 'user/registration', user, {
                responseType: 'text',
            }).subscribe((data) => {
              console.log(data);
              this.router.navigate(['login']).then(r => console.log(r));
            });


    }

    handleFileInput(files: FileList): void {
        const reader = new FileReader();
        reader.readAsDataURL(files.item(0));
        reader.onloadend = (event) => {
            this.imageFile = new Image();
            this.imageFile.name = files.item(0).name;
            this.fileName = files.item(0).name;
            this.imageFile.type = files.item(0).type;
            this.imageFile.pic = reader.result;
        };
    }
}
