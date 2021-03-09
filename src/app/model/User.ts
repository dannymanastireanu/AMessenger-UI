
export class User {
    private uuid: string;
    private _username: string;
    private password: string;
    private _fullName: string;
    private _mail: string;
    private _image: any;

    constructor( username: string, password: string, fullName: string, mail: string, image: any ) {
        this._username = username;
        this.password = password;
        this._fullName = fullName;
        this._mail = mail;
        this._image = image;
    }


  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get fullName(): string {
    return this._fullName;
  }

  set fullName(value: string) {
    this._fullName = value;
  }

  get mail(): string {
    return this._mail;
  }

  set mail(value: string) {
    this._mail = value;
  }

  get image(): any {
    return this._image;
  }

  set image(value: any) {
    this._image = value;
  }


    get _password(): string {
        return this.password;
    }

    set _password(value: string) {
        this.password = value;
    }

    set _uuid(value: string) {
        this.uuid = value;
    }

    get _uuid(): string {
        return this.uuid;
    }
}
