import {
	AfterViewChecked,
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Input,
	OnDestroy,
	OnInit,
	ViewChild
} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Message} from '../model/Message';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LoginComponent} from '../login/login.component';
import {Friend} from '../model/Friend';

declare var SockJS;
declare var Stomp;
declare var JSEncrypt: any;
import {User} from '../model/User';
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {SharedUser} from "../service/SharedUser";


@Component({
	selector: 'app-chat-room',
	templateUrl: './chat-room.component.html',
	styleUrls: ['./chat-room.component.css']
})


export class ChatRoomComponent implements OnInit, OnDestroy, AfterViewChecked {

	@ViewChild('scrollMe') private myScrollContainer: ElementRef;

	public messageInputText: string;
	public user;
	public stompClient;
	public messageHistory: Array<Message>;
	public cryptoRSA;
	public decryptoRSA;

	public pbKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC2u2lQ2fmlvsl6qhmDMngNSm85mh9hr3iU/lRmlnGVyJTOtQQ3cYgPmDvhsrOnFkAuYkWyJecYcRHYjlCpyietgoRMP+nhygkzLnx6LKZ2WqpAxmFDRnNmICsWj4GobALUNKsgLPqsg0qHmP2WPOs7JdHw2CC9n9K+oRRtPmK7LQIDAQAB';
	public pvKey = 'MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBALa7aVDZ+aW+yXqqGYMyeA1KbzmaH2GveJT+VGaWcZXIlM61BDdxiA+YO+Gys6cWQC5iRbIl5xhxEdiOUKnKJ62ChEw/6eHKCTMufHospnZaqkDGYUNGc2YgKxaPgahsAtQ0qyAs+qyDSoeY/ZY86zsl0fDYIL2f0r6hFG0+YrstAgMBAAECgYAED/ySaJYtQiWWjYuNqCSVHw+D91I1SMJkhZb4xOV3kAMG6W1TkjmVJyxFo0RtNYhtv4+PG1qc536fEuLmM3FYV4SWwbiUSW1BTPl4EVVfVcE1RjTqRSt95jEABO6gUWzr+1fkRVSKnt8ggvMlOSEbXzwWrWK5fWN9WSxlkUbUwQJBAOuJqbCtV/JgCg7lU6FNw+edQ2OQKvleLR7iIwrHvWTu3+QelXpjHzVSJH84X9GO8LjsVWklbUavTvvhuSC2PlECQQDGm1r+ZdPQAqRAT866LpYjiY74qJltoT8I26BsMKZRiLnCQFqxCyxrW2qkdfCd57YSVCPfL4UKE1FOy/Zp2+wdAkAX4NjnJGuqErpyUCVuUOfvby4Jxe/VYArK+rn6uc0lkmH4SnF0+t+LFEzG6PwtzoPw+2SdSEIPzG4BcxzFiDRBAkBlyKq6pA8IlMH+36fPzR5O+imWkDmJcNDwRjaSG+Cw+oRQ5FBWWaabIo+l13fIRT8PZ6W2tRDWmA3cdzVDDV2VAkBtB8QtofV12dxNZkQT/GZ6vG+0qaP07s4qhXM/EUFdc63pVx90UuC/ALw2T+U7GTaSLQDkLs5KgzhafvbS+200';


	private selectedFile: File;
	private imageURL: string | ArrayBuffer;

	onFileSelect(event): void {
		try {
			this.selectedFile = event.target.files[0];
			console.log(this.selectedFile.name);
			console.log(this.selectedFile.size);
			const reader = new FileReader();
			reader.readAsDataURL(this.selectedFile);
			reader.onload = (ev) => {
				this.imageURL = reader.result;
				// const messageToHistory = new Message(this.user.username, this.connectedWith.username, this.imageURL,
				// 	(Math.floor(Date.now() / 1000)) as unknown as bigint, 'image', '', null);
				// // 	Store message in history
				// this.messageHistory[this.connectedWith.username].push(messageToHistory);
				// // Send the image
				// const urlSend: string = '/app/chat/' + messageToHistory._to;
				// this.stompClient.send(urlSend, {}, JSON.stringify(messageToHistory));
			};
		} catch (error) {
			console.log('Opened file window was closed!');
		}
	}


	// tslint:disable-next-line:variable-name max-line-length
	constructor(private http: HttpClient, private sharedUser: SharedUser) {
		this.messageInputText = '';
		this.cryptoRSA = new JSEncrypt();
		this.decryptoRSA = new JSEncrypt();
	}


	ngOnInit(): void {
	  this.getUserByToken();
    this.setHistoryMessage();
	}

  async setHistoryMessage(): Promise<void> {
    await this.http.get(environment.apiUrl + 'user/messages',
      {observe: 'response', headers: {'authorization': localStorage.getItem('authorization')}}).subscribe(
      data=>{
        let messages = data.body as [];
        this.messageHistory = new Array<Message>();
        messages.forEach(m =>  {
          this.messageHistory.push(new Message(m["from"], m["body"], m["timestamp"], m["type"], null));
        });
      }
    );
  }

  async getUserByToken(): Promise<void> {
	  await this.http.get(environment.apiUrl + 'user', {observe: 'response', headers: {'authorization': localStorage.getItem('authorization')}}).subscribe(
	    res => {
	      let tmpu = res.body;
	      this.user = new User(tmpu["username"], "", tmpu["fullName"], tmpu["mail"], tmpu["image"]);
	      this.sharedUser.nextUser(this.user);
      }, error => console.error(error)
    );
  }



	initStomp(): void {
		const headers = {
			login: this.user._username,
			passcode: this.user._password,
		};
		const serverUrl = environment.apiUrl + 'chat';
		const ws = new SockJS(serverUrl);
		this.stompClient = Stomp.over(ws);
		const that = this;
		// TODO: change {} => headers (sa mai introduc si header ul pentru o securitate mai buna)
		// tslint:disable-next-line:only-arrow-functions typedef
		this.stompClient.connect({}, (frame) => {
			console.log('Connected: ' + frame);
			that.stompClient.subscribe('/topic/messages/' + that.user.username, (message) => {
				console.log('Subscribe at: /topic/messages/' + this.user.username.toString());
				// const messageFromFriend: Message = new Message(null, null, null, null, null, null, JSON.parse(message.body));
				// if (messageFromFriend._type === 'text') {
				// 	messageFromFriend._body = this.decryptoRSA.decrypt(messageFromFriend._body);
				// } else if (messageFromFriend._type === 'image') {
				// 	messageFromFriend._body = messageFromFriend._body;
				// }
				// this.messageHistory[this.connectedWith.username].push(messageFromFriend);
			});
		}, () => {
			// TODO: Voi trimite un POST la server sa-l notific de acest lucru
			console.log('Probleme la server, user ul nu poate sa mentinta conexiunea sau sa se conecteze');
		});
	}

	sendMessage(f: NgForm): void {
		// send to server encrypted body
		const messageBody: string = this.cryptoRSA.encrypt(this.messageInputText);
		// const messageBody: string = this.messageInputText;
		console.log('ENCR: ' + messageBody);
		// const message = new Message(this.user.username, this.connectedWith.username, messageBody,
		// 	(Math.floor(Date.now() / 1000)) as unknown as bigint, 'text', '', null);
		// const urlSend: string = '/app/chat/' + message._to;
		// this.stompClient.send(urlSend, {}, JSON.stringify(message));
    //
		// message._body = this.messageInputText;
		// this.messageHistory[this.connectedWith.username].push(message);
		this.messageInputText = '';
	}


	async getKPbServer(): Promise<void> {
		try{
			await this.http.get('http://localhost:8080/avoice/crypto/pubKey', {responseType: 'text', withCredentials: true,
				headers: {"Authorization": `Bearer ${localStorage.getItem("jwt")}`}}).subscribe(data => {
				this.cryptoRSA.setPublicKey(data);
				console.log('DE LA SERVER(PUB KEY): ' + data);
			});
		} catch (error){
			return null;
		}
	}

	async setKPbServer(): Promise<void> {
		try{
			const headers = new HttpHeaders();
			headers.set('Content-Type', 'application/json; charset=utf-8');
			await this.http.post('http://localhost:8080/avoice/crypto/pubKey', this.pbKey,
				{responseType: 'text', withCredentials: true}).subscribe(data => {
				console.log('Am trimis la server key cu care sa-mi cripteze mesajele: ' + this.pbKey);
			});
		} catch (error){
			return null;
		}
	}

	ngOnDestroy(): void {
		console.log('Componenta Chat-room a fost distrusa');
		// 	close websocket
	}

	ngAfterViewChecked(): void {
		this.scrollToBottom();
	}

	private scrollToBottom(): void {
		try {
			this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
		} catch (err) { }
	}
}
