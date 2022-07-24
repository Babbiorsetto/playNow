import { getVoiceConnection } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types/Command";

const disconnect: Command = {
    data: new SlashCommandBuilder()
    .setName("dc")
    .setDescription("Disconnect me from voice :'(")
    .setDMPermission(false),
    execute: async (interaction, applicationContext) => {
        const connection = getVoiceConnection(interaction.guildId);
        if (!connection) {
            interaction.reply("I'm not even there");
            return;
        }
        connection.destroy();
        interaction.reply("buh bye");
    }
}

export = disconnect
