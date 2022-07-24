import { Client, GatewayIntentBits, Snowflake } from "discord.js";
import fs from "fs/promises";
import path from "path";
import { Command } from "./types/Command";
import {DISCORD_BOT_TOKEN} from "./config";
import {SongList} from "./entities/SongList"
import {FileSystemSongListBuilder} from "./builders/SongListBuilder"
import { AudioPlayer } from "@discordjs/voice";

export class PlayNowApplication {
    private client: Client;
    public static commandDir = path.join(__dirname, "commands");
    private commands: Map<string, Command>;
    private songList: SongList;
    private audioPlayers: Map<Snowflake, AudioPlayer>;

    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates
            ]
        });
        this.songList = new SongList(new FileSystemSongListBuilder(path.join(process.cwd(), "songs")));
        this.commands = new Map<string, Command>();
        this.audioPlayers = new Map();
    }

    async start() {
        await this.commandSetup();
        console.log("Done loading commands");
        this.eventSetup();
        console.log("Done loading events");
        await this.songList.rebuild();
        console.log("Done loading songs");
        this.client.login(DISCORD_BOT_TOKEN)
    }

    private async commandSetup() {
        const dir = await fs.opendir(PlayNowApplication.commandDir)
        for await (const dirent of dir) {
            console.log(`Loading command from ${dirent.name}`);
            const importedModule = await import(path.join(PlayNowApplication.commandDir, dirent.name))
            this.commands.set(importedModule.data.name, importedModule);
        }
    }

    private eventSetup() {
        this.client.once("ready", async (client) => {
            console.log("Client ready");
        });

        process.on("SIGINT", () => {
            process.exit(0);
        });

        process.on("exit", () => {
            this.client.destroy();
            console.log("Logged out");
        });

        async function handleInteraction (interaction) {

            if (!interaction.isChatInputCommand())
                return;
    
            const command: Command = this.commands.get(interaction.commandName);
    
            if (!command)
                return;
    
            try {
                await command.execute(interaction, {
                    songList: this.songList,
                    audioPlayers: this.audioPlayers,
                });
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }

        this.client.on("interactionCreate", handleInteraction.bind(this));
    }
}
