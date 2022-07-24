export class Song {
    name: string;
    encoding: "opus" | "mp3" | "unsupported";

    constructor(name: string) {
        this.name = name;
        if (name.endsWith(".mp3")) {
            // yes, I know mp3 is not an encoding
            this.encoding = "mp3";
        } else if (name.endsWith(".opus")) {
            this.encoding = "opus";
        } else {
            this.encoding = "unsupported";
        }
    }
}
