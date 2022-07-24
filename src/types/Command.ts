import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"
import { SongList } from "src/entities/SongList";

export interface ApplicationContext {
    songList: SongList;
}

export interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction, applicationContext: ApplicationContext)=> Promise<void>;
}
