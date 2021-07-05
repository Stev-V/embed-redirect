const { req } = require("./modules/moldit.js")
const { React } = req("webpack")

function setting(settings, one, two) {
    let instance = settings.get(one, two)
    if (instance.startsWith("https://") || instance.startsWith("http://")) instance = instance.split("://")[1]
    if (instance.endsWith("/")) instance = instance.slice(0, instance.length - 1)
    return instance
}

module.exports = [
	{
		name: "Invidious",
		replaces: "YouTube",
		instances: "https://github.com/iv-org/documentation/blob/master/Invidious-Instances.md",
		default: "yewtu.be",
		embedMatches: (embed) => {return embed.video && (embed.video.originalURL ? embed.video.originalURL : embed.video.url).includes("youtube")},
		replaceEmbed: (embed, settings) => {
	        if (!embed.video.originalURL) embed.video.originalURL = embed.video.url;
	        let instance = setting(settings, "invidiousInstance", "yewtu.be")
	        if (!instance) {
	            embed.video.url = "data:text/plain,No Invidious instance selected. You can either:\n- Go to the settings page for Embed Redirect and select one\n- Turn off Embed Redirect\n\n\n"
	        } else {
	            embed.video.url = embed.video.url.replace("www.youtube.com", instance)
	            embed.provider.url = "https://" + instance
	            embed.author.url = embed.author.url.replace("www.youtube.com", instance)
	            embed.url = embed.url.replace("www.youtube.com", instance)
	            if (settings.get("enableCosmetics", true)) {
	                embed.provider.name = "Invidious 🠔 YouTube"
	                embed.color = "#f1680d"
	            }
	        }
		},
		replaceLink: (link, settings) => {
			if (!link.props.originallink) link.props.originallink = link.props.href
			link.props.href = link.props.href.replace("www.youtube.com", setting(settings, "invidiousInstance", "yewtu.be"))
			link.props.onClick = (e) => {}
			if (settings.get("enableCosmetics", true)) link.props.style = {color: "#1fdd7e"}
			link.props.title = link.props.href
		}
	},
	{
		name: "Nitter",
		replaces: "Twitter",
		instances: "https://github.com/zedeus/nitter/wiki/Instances",
		default: "nitter.moomoo.me",
		embedMatches: (embed) => {return embed.footer && embed.footer.text == "Twitter"},
		replaceEmbed: (embed, settings) => {
	        let instance = setting(settings, "nitterInstance", "nitter.moomoo.me")
	        if (instance) {
	            embed.url = embed.url.replace("twitter.com", instance)
	            embed.author.url = embed.author.url.replace("twitter.com", instance)
	            if (settings.get("enableCosmetics", true)) {
	                embed.footer.text = "Nitter 🠔 Twitter"
	                delete embed.footer.iconProxyURL
	                delete embed.footer.iconURL
	                embed.color = "#FF6C60"
	            }
	        }
		},
		replaceLink: (link, settings) => {
			if (!link.props.originallink) link.props.originallink = link.props.href
			link.props.href = link.props.href.replace("twitter.com", setting(settings, "nitterInstance", "nitter.moomoo.me"))
			link.props.onClick = (e) => {}
			if (settings.get("enableCosmetics", true)) link.props.style = {color: "#1fdd7e"}
			link.props.title = link.props.href
		}
	},
]

module.exports.guide = {
	"www.youtube.com": 0,
	"youtu.be": 0,
	"twitter.com": 1,
}
