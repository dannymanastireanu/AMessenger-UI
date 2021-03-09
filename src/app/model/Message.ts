
export class Message {
	private from: string;
	private to: string;
	private body: string | ArrayBuffer;
	private timestamp: bigint;
	private type: string;
	private cachePath: string;

	constructor(from: string, to: string, body: string | ArrayBuffer, timestamp: bigint, type: string, cachePath: string, m: Message) {
		if (m != null) {
			this.from = m.from;
			this.to = m.to;
			this.body = m.body;
			this.timestamp = m.timestamp;
			this.type = m.type;
			this.cachePath = m.cachePath;
		} else {
			this.from = from;
			this.to = to;
			this.body = body;
			this.timestamp = timestamp;
			this.type = type;
			this.cachePath = cachePath;
		}
	}

	get _type(): string {
		return this.type;
	}

	set _type(value: string) {
		this.type = value;
	}

	get _from(): string {
		return this.from;
	}

	set _from(value: string) {
		this.from = value;
	}

	get _to(): string {
		return this.to;
	}

	set _to(value: string) {
		this.to = value;
	}

	get _body(): string|ArrayBuffer {
		return this.body;
	}

	set _body(value: string|ArrayBuffer) {
		this.body = value;
	}

	get _timestamp(): bigint {
		return this.timestamp;
	}

	set _timestamp(value: bigint) {
		this.timestamp = value;
	}

	getTime(): string {
		// @ts-ignore
		const fullDate = new Date(this.timestamp * 1000);
		let hours = fullDate.getHours();
		let minutes: string | number = fullDate.getMinutes();
		const ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		return hours + ':' + minutes + ' ' + ampm;
	}

	getTimeSpecific(specificTimestamp: bigint): string {
		// @ts-ignore
		const fullDate = new Date(specificTimestamp * 1000);
		let hours = fullDate.getHours();
		let minutes: string | number = fullDate.getMinutes();
		const ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		return hours + ':' + minutes + ' ' + ampm;
	}

}
