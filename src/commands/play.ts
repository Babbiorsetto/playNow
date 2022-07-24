import { SlashCommandBuilder, SlashCommandIntegerOption } from "discord.js";
import { Command } from "../types/Command";

const play: Command = {
    data: new SlashCommandBuilder()
    .setName("p")
    .setDescription("Play a song")
    .addIntegerOption(
        new SlashCommandIntegerOption()
        .setName("n")
        .setDescription("song number")
        .setRequired(true)
    )
    .setDMPermission(false),
    execute: async (interaction, applicationContext) => {
        const n = interaction.options.getInteger("n");
    }
};

export = play;
