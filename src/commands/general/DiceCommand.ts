import { CommandContext } from "../../structures/CommandContext.js";
import { createEmbed } from "../../utils/functions/createEmbed.js";
import { BaseCommand } from "../../structures/BaseCommand.js";
import { Command } from "../../utils/decorators/Command.js";
import i18n from "../../config/index.js";
import { ApplicationCommandOptionType } from "discord.js";

@Command<typeof DiceCommand>({
    aliases: ["dd", "d", "roll", "dice"],
    description: i18n.__("commands.general.dice.description"),
    name: "dice",
    slash: {
        options: [
            {
                description: i18n.__("commands.dice.number"),
                name: "number",
                required: false,
                type: ApplicationCommandOptionType.String
            },
            {
                type: ApplicationCommandOptionType.String,
                name: "value",
                required: false,
                description: i18n.__("commands.dice.value")
            }
            
        ]
    },
    usage: "{prefix}dice number value "
})
export class DiceCommand extends BaseCommand {
    public async execute(ctx: CommandContext): Promise<void> {
        if (ctx.isInteraction() && !ctx.deferred) await ctx.deferReply();
        const diceValue =
            ctx.options?.getString("value") ??
            (ctx.additionalArgs.get("value") ? (ctx.additionalArgs.get("value") as string[])[0] : null);
        const diceNumber =
            ctx.options?.getString("number") ??
            (ctx.additionalArgs.get("number") ? (ctx.additionalArgs.get("number") as string[])[0] : null);
        
        const msg = await ctx.reply({ content: "<a:dice2:1177970651072561213> **|** Lancement des dés, veuillez patienter" });
        const embed = createEmbed("info")
            .setColor("#0000FF")
            .setAuthor({
                name: "Lancement des dés",
                iconURL: this.client.user!.displayAvatarURL()
            })
            .addFields(
                {
                    name: `<a:dice2:1177970651072561213> **|** Valeur maximale des dés: \`${diceValue??"20"}\`, Lancement de ${diceNumber??1} dés`,
                    value: `**Résultat: \`${Math.ceil(Math.random()*parseInt(diceValue??"20"))}\`** `,
                    inline: true
                }
            );
        msg.edit({ content: " ", embeds: [embed] }).catch(e => this.client.logger.error("PROMISE_ERR:", e));
    }

    // eslint-disable-next-line class-methods-use-this

}
