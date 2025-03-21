import { AudioPlayer } from "@discordjs/voice";
import {
    ChatInputCommandInteraction,
    SharedSlashCommand,
    SlashCommandBuilder,
    Snowflake,
} from "discord.js";
import { SongList } from "src/entities/SongList";

export interface ApplicationContext {
    songList: SongList;
    audioPlayers: Map<Snowflake, AudioPlayer>;
}

export interface Command {
    data: SharedSlashCommand;
    execute: (
        interaction: ChatInputCommandInteraction,
        applicationContext: ApplicationContext
    ) => Promise<void>;
}
