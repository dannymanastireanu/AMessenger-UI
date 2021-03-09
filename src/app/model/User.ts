
export class User {
    private uuid: string;
    private username: string;
    private password: string;
    private fullName: string;
    private mail: string;
    private image: any;

    constructor( username: string, password: string, fullName: string, mail: string, image: any ) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.mail = mail;
        this.image = image;
    }


  get _username(): string {
    return this.username;
  }

  set _username(value: string) {
    this.username = value;
  }

  get _fullName(): string {
    return this.fullName;
  }

  set _fullName(value: string) {
    this.fullName = value;
  }

  get _mail(): string {
    return this.mail;
  }

  set _mail(value: string) {
    this.mail = value;
  }

  get _image(): any {
    return this.image;
  }

  set _image(value: any) {
    this.image = value;
  }


  get _password(): string {
    return this.password;
  }

  set _password(value: string) {
    this.password = value;
  }
}
