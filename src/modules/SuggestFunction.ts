import {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    EmbedBuilder,
    ButtonStyle,
    ButtonBuilder
} from "discord.js";

export async function Gamble(interaction: any) {
    const { commandName, options, user, guild } = interaction;
    const subcommand = interaction.options.getSubcommand()
    let suggestionMessage;

    const modal = new ModalBuilder()
        .setTitle(' ')
        .setCustomId(`Created by {user.id}`)

    const TextInput = new TextInputBuilder()
        .setCustomId('suggest-input')
        .setLabel('What would you like to suggest')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)

    const actionRow = new ActionRowBuilder().addComponents(TextInput);

    await interaction.showModel(modal);

    const modalInteraction = await interaction.awaitModalSubmit({
        time: 1000 * 60 * 30
    }).catch((error) => console.log(error))

    await modalInteraction.deferReply({ ephemeral: true })

    const suggestionText = modalInteraction.fields.getTextInputValue('suggest-input')

    const suggestionEmbed = new EmbedBuilder()
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
        .addFields()
        .setColor('Yellow')

    const upvoteButton = new ButtonBuilder()
        .setEmoji('')
        .setLabel('upvote')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`suggestion.${user.id}.upvote`)

    const downvoteButton = new ButtonBuilder()
        .setEmoji('')
        .setLabel('downvote')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`suggestion.${user.id}.downvote`)

    const specialButton = new ButtonBuilder()
        .setEmoji('')
        .setLabel('downvote')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`suggestion.${user.id}.downvote`)

    const Row = new ActionRowBuilder().addComponents(upvoteButton, downvoteButton, specialButton)

    suggestionMessage.edit({
        content: `${user} content created`,
        embeds: [suggestionEmbed],
        components: [Row],          
    }) 

}