import { Client, GatewayIntentBits } from "discord.js";
import fs from "fs/promises";
import path from "path";
import { Command } from "./types/Command";

export class PlayNowApplication {
    private client: Client;
    public commands: Map<string, Command>;
    public static commandDir = path.join(__dirname, "commands");

    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates
            ]
        });
        this.commands = new Map<string, Command>();
    }

    async start() {
        await this.commandSetup();
        this.eventSetup();
        this.client.login(process.env.DISCORD_BOT_TOKEN)
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

        this.client.on("interactionCreate", async (interaction) => {

            if (!interaction.isChatInputCommand())
                return;
    
            const command = this.commands.get(interaction.commandName);
    
            if (!command)
                return;
    
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        });
    }
}
