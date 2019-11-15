import * as browser from "webextension-polyfill";

import { MessageType } from "../../lib/types";

browser.runtime.sendMessage({ type: MessageType.Open });

browser.runtime.onMessage.addListener((message) => {
	switch (message.type) {
		case MessageType.Connected:
			console.log("Connected : " + message.payload);
			break;
	}
});