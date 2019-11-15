export type Storage = {
	port: number,
	poll_interval: number,
	space: number
};

export enum MessageType {
	Open,
	Connected,
	Song
};