import fs from "fs/promises";

export interface SongListBuilder {
    build: () => Promise<string[]>;
}

export class FileSystemSongListBuilder implements SongListBuilder {
    songsPath: string;

    constructor(songsPath: string) {
        this.songsPath = songsPath;
    }

    async build() {
        const songs = [] as string[];
        return fs
            .opendir(this.songsPath)
            .then(async (dir) => {
                for await (const dirent of dir) {
                    if (dirent.isFile()) {
                        songs.push(dirent.name);
                    }
                }
                return songs;
            })
            .catch((error) => {
                console.log("Error building SongList " + error);
                return undefined;
            });
    }
}
