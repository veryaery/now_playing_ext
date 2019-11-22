import * as browser from "webextension-polyfill";

import * as defaults from "../../lib/defaults.json";
import {
	Storage,
	MessageType
} from "../../lib/types";

const song_el: HTMLElement = document.getElementById("song");
const status_el: HTMLElement = document.getElementById("status");

const port_el: HTMLInputElement = <HTMLInputElement>document.getElementById("port");
const poll_interval_el: HTMLInputElement = <HTMLInputElement>document.getElementById("poll_interval");
const space_el: HTMLInputElement = <HTMLInputElement>document.getElementById("space");

const save_el: HTMLInputElement = <HTMLInputElement>document.getElementById("save");

function save_listener() {
	save_el.addEventListener("click", () => {
		browser.storage.local.set({
			port: port_el.value,
			poll_interval: poll_interval_el.value,
			space: space_el.value
		});
	});
}

async function set_inputs() {
	const storage: Storage = <Storage>await browser.storage.local.get();

	port_el.value = storage.port ? storage.port.toString() : defaults.port.toString();
	poll_interval_el.value = storage.poll_interval ? storage.poll_interval.toString() : defaults.poll_interval.toString();
	space_el.value = storage.space ? storage.space.toString() : defaults.space.toString();

	save_listener();
}

set_inputs();

browser.runtime.sendMessage({ type: MessageType.Open });

browser.runtime.onMessage.addListener((message) => {
	switch (message.type) {
		case MessageType.Playing:
			song_el.innerHTML = "Now playing: " + message.payload;
			break;
		case MessageType.NotPlaying:
			song_el.innerHTML = "Not playing";
			break;
		case MessageType.Connected:
			if (message.payload) {
				status_el.innerHTML = "Connected to local server";
			} else {
				status_el.innerHTML = "Disconnected from local server";
			}
			break;
	}
});