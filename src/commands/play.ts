import {
    StreamType,
    createAudioResource,
    VoiceConnectionStatus,
    AudioPlayerStatus,
    createAudioPlayer,
    entersState,
    getVoiceConnection,
    joinVoiceChannel,
} from "@discordjs/voice";
import {
    GuildMember,
    InteractionContextType,
    SlashCommandBuilder,
    SlashCommandIntegerOption,
} from "discord.js";
import { Command } from "../types/Command";
import path from "path";

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
        .setContexts(InteractionContextType.Guild),
    execute: async (interaction, applicationContext) => {
        const member = interaction.member as GuildMember;
        if (!member.voice || !member.voice.channelId) {
            interaction.reply("Must be in a voice channel to do that!");
            return;
        }
        const n = interaction.options.getInteger("n");
        if (!applicationContext.songList.songs.at(n)) {
            interaction.reply("That number doesn't look right");
            return;
        }

        let audioPlayer = applicationContext.audioPlayers.get(
            interaction.guildId
        );
        if (!audioPlayer) {
            audioPlayer = createAudioPlayer();
        } else {
            //something like this
            audioPlayer.removeAllListeners();
        }
        applicationContext.audioPlayers.set(interaction.guildId, audioPlayer);

        audioPlayer.on(AudioPlayerStatus.Idle, async () => {
            entersState(audioPlayer, AudioPlayerStatus.Playing, 5000).catch(
                () => {
                    applicationContext.audioPlayers.delete(interaction.guildId);
                    audioPlayer.stop();
                    audioPlayer.removeAllListeners();
                    console.log("Stopped idle audio player");
                }
            );
        });

        // I can't check which channel the connection is for
        // so I need to rejoin regardless
        let connection = getVoiceConnection(interaction.guildId);

        connection = joinVoiceChannel({
            channelId: member.voice.channelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        const song = applicationContext.songList.songs.at(n);
        const audioResource = createAudioResource(
            path.join(process.cwd(), "songs", song.name),
            {
                inputType:
                    song.encoding === "opus"
                        ? StreamType.OggOpus
                        : StreamType.Arbitrary,
            }
        );

        connection.subscribe(audioPlayer);
        audioPlayer.play(audioResource);
        interaction.reply(`Here's ${song.name}`);
    },
};

export = play;
