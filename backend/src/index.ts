import * as http from "http";
import * as path from "path";
import * as fs from "fs";

import * as socket_io from "socket.io";

require("json5/lib/register");

type Config = {
	port: number;
	song_path: string;
};

const config: Config = <Config>require(path.resolve(__dirname, "../config.json5"));

const song_path: string = path.resolve(process.cwd(), config.song_path);

const http_server: http.Server = new http.Server();
const server: socket_io.Server = socket_io(http_server);

function log_figlet(): Promise<void> {
	return new Promise((res, rej) => {
		fs.readFile(path.resolve(__dirname, "../figlet.txt"), (err, data) => {
			if (err) {
				rej(err);
			} else {
				console.log(data.toString());
				res();
			}
		});
	});
}

function write_song(song: string): Promise<void> {
	return new Promise((res, rej) => {
		fs.writeFile(song_path, song, err => {
			if (err) {
				rej(err);
			} else {
				res();
			}
		});
	});
}

async function playing(song: string) {
	console.log("Now playing: " + song);
	await write_song(song + "    ");
}

async function not_playing() {
	console.log("Not playing");
	await write_song("");
}

server.on("connect", socket => {
	console.log("Connection");

	socket.on("playing", playing);
	socket.on("not_playing", not_playing);
});

async function main() {
	http_server.listen(config.port, async () => {
		await log_figlet();
		console.log("Listening");
		console.log("Port : " + config.port);
	});
}

main();