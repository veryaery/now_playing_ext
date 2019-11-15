import * as browser from "webextension-polyfill";

browser.runtime.sendMessage("open");

browser.runtime.onMessage.addListener((message, payload) => {
	switch (message) {
		case "song":
			break;
	}
});