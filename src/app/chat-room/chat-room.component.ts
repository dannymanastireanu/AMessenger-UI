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


declare var SockJS;
declare var Stomp;
declare var JSEncrypt: any;
import {User} from '../model/User';
import {environment} from "../../environments/environment";
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
				const messageToHistory = new Message(this.user.username, this.imageURL,
					(Math.floor(Date.now() / 1000)) as unknown as bigint, 'image', null);
				// 	Store message in history
				this.messageHistory.push(messageToHistory);
				// Send the image
				const urlSend: string = '/app/chat/' + "all";
				this.stompClient.send(urlSend, {}, JSON.stringify(messageToHistory));
			};
		} catch (error) {
			console.log('Opened file window was closed!');
		}
	}


	// tslint:disable-next-line:variable-name max-line-length
	constructor(private http: HttpClient, private sharedUser: SharedUser) {
		this.messageInputText = '';
	}


	ngOnInit(): void {
	  this.getUserByToken();
    this.setHistoryMessage();
    this.initStomp();
    this.scrollToBottom();
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
		const serverUrl = environment.apiUrl + 'chat';
		const ws = new SockJS(serverUrl);
		this.stompClient = Stomp.over(ws);
		const that = this;
		this.stompClient.connect({}, (frame) => {
			console.log('Connected: ' + frame);
			that.stompClient.subscribe('/topic/messages/' + that.user.username, (message) => {
				const messageFromFriend: Message = new Message(null,  null, null, null, JSON.parse(message.body));
				this.messageHistory.push(messageFromFriend);
				console.log("AM PRIMIT MESAJ NOU : " + JSON.stringify(message.body));
			});
		}, () => {
			console.log('Probleme la server, user ul nu poate sa mentinta conexiunea sau sa se conecteze');
		});
	}

	sendMessage(f: NgForm): void {
		const message = new Message(this.user.username, this.messageInputText,
			(Math.floor(Date.now() / 1000)) as unknown as bigint, 'text',  null);
		const urlSend: string = '/app/chat/' + "all";
		this.stompClient.send(urlSend, {}, JSON.stringify(message));
		this.messageHistory.push(message);
		this.messageInputText = '';
	}

	ngOnDestroy(): void {
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
