import * as browser from "webextension-polyfill";
import * as socket_io from "socket.io-client";
import * as url from "url";

const POLLING_INTERVAL: number = 1000;
const SUFFIX: string = " - YouTube";

const socket: SocketIOClient.Socket = socket_io("http://localhost:1337");

let last_poll: number = 0;

let playing: boolean = true;
let last_song: string = "";

browser.runtime.onMessage.addListener((message) => {
	console.log(message);
});

socket.on("connect", () => {
	console.log("Connected");

	playing = true;
    last_song = "";

	browser.browserAction.setIcon({
		path: {
			64: "img/connected.png"
		}
	});
	browser.browserAction.setTitle({
		title: "Connected"
	});
});

socket.on("disconnect", () => {
	console.log("Disconnected");

	browser.browserAction.setIcon({
		path: {
			64: "img/disconnected.png"
		}
	});
	browser.browserAction.setTitle({
		title: "Disconnected"
	});
});

async function poll(): Promise<void> {
	for (const window of await browser.windows.getAll({ populate: true })) {
		for (const tab of window.tabs) {
			if (
				tab.audible &&
				url.parse(tab.url).host == "www.youtube.com" &&
				tab.title.endsWith(SUFFIX)
			) {
				const song: string = tab.title.substring(0, tab.title.length - SUFFIX.length);

				if (!playing || last_song != song) {
					playing = true;
					last_song = song;

					console.log("Now playing: " + song);

					socket.emit("playing", song);
				}

				return;
			}
		}
	}

	if (playing) {
		playing = false;
		console.log("Not playing");
		socket.emit("not_playing");
	}

}

setInterval(() => {
	if (!socket.connected) {
		return;
	}

	const now: number = Date.now();
	const d: number = now - last_poll;

	if (d >= POLLING_INTERVAL) {
		last_poll = now;

		poll();
	}
});