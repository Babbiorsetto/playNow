import { AudioPlayer } from "@discordjs/voice";
import { ChatInputCommandInteraction, SlashCommandBuilder, Snowflake } from "discord.js"
import { SongList } from "src/entities/SongList";

export interface ApplicationContext {
    songList: SongList;
    audioPlayers: Map<Snowflake, AudioPlayer>;
}

export interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction, applicationContext: ApplicationContext)=> Promise<void>;
}
