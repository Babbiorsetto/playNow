import EventEmitter from "events";
import { SongListBuilder } from "src/builders/SongListBuilder";
import { LIST_ENTRIES_PER_PAGE } from "../config";
import { Song } from "./Song";

export class SongList extends EventEmitter {
    public songs: Song[];
    builder: SongListBuilder;

    constructor(builder: SongListBuilder) {
        super();
        this.builder = builder;
    }

    public getPage(pageNumber: number) {
        const start = pageNumber * LIST_ENTRIES_PER_PAGE;
        const end = start + LIST_ENTRIES_PER_PAGE;
        return Array.from(this.songs.entries()).slice(start, end);
    }

    async rebuild() {
        this.songs = await this.builder.build().then((songNames) => {
            return songNames.map((name) => new Song(name));
        });
        this.emit("rebuild");
    }
}
