import { SlashCommandBuilder, SlashCommandIntegerOption } from "discord.js";
import { Command } from "../types/Command";

const list: Command = {
    data: new SlashCommandBuilder()
    .setName("ls")
    .setDescription("List available songs")
    .addIntegerOption(
        new SlashCommandIntegerOption()
        .setName("n")
        .setDescription("page number")
        .setRequired(false)
    )
    .setDMPermission(false),
    execute: async (interaction, applicationContext) => {
        let n = interaction.options.getInteger("n");
        if (n === undefined) {
            n = 0;
        }
        const songs = applicationContext.songList.getPage(n);
        let text = songs.map(([num, song]) => `${num} - ${song.name}`).join("\n");
        text = text || "Nothing to see here";
        interaction.reply(text);
    }
}

export = list;
