import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types/Command";

const play: Command = {
    data: new SlashCommandBuilder().setName("p").setDescription("Play a song"),
    execute: async (interaction) => {
        interaction.reply("hello")
    }
};

export = play;
