const { React } = require("powercord/webpack")

const redirectLinkColor = "#1fdd7e"

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
		default: "invidious.kavin.rocks",
		replacedURL: "youtube.com",
		embedMatches: (embed) => {return embed.video && (embed.video.originalURL ? embed.video.originalURL : embed.video.url).includes("youtube")},
		replaceEmbed: (embed, settings) => {
	        if (!embed.video.originalURL) embed.video.originalURL = embed.video.url;
	        let instance = setting(settings, "invidiousInstance", "invidious.kavin.rocks")
	        if (!instance) {
	            embed.video.url = "data:text/plain,No Invidious instance selected. You can either:\n- Go to the settings page for Embed Redirect and select one\n- Turn off Embed Redirect\n\n\n"
	        } else {
	        	if (!settings.get("redirectColorEmbeds", true)) {
		            embed.provider.url = "https://" + instance
		            embed.author.url = embed.author.url.replace("www.", "").replace("youtube.com", instance)
		            embed.url = embed.url.replace("www.", "").replace("youtube.com", instance)
	            }
	            embed.video.url = embed.video.url.replace("www.", "").replace("youtube.com", instance)
	            if (settings.get("enableCosmetics", true)) {
	                embed.provider.name = "Invidious 🠔 YouTube"
	                embed.color = "#f1680d"
	            }
	        }
		},
		replaceLink: (link, settings) => {
			if (!link.props.originallink) link.props.originallink = link.props.href
			link.props.href = link.props.href.replace(/(www\.)?youtube\.com|youtu\.be/, setting(settings, "invidiousInstance", "yewtu.be"))
			link.props.onClick = (e) => {}
			if (settings.get("enableCosmetics", true)) link.props.style = {color: redirectLinkColor}
			link.props.title = link.props.href
		}
	},
	{
		name: "Nitter",
		replaces: "Twitter",
		instances: "https://github.com/zedeus/nitter/wiki/Instances",
		default: "nitter.moomoo.me",
		replacedURL: "twitter.com",
		embedMatches: (embed) => {return embed.footer && embed.footer.text == "Twitter"},
		replaceEmbed: (embed, settings) => {
	        let instance = setting(settings, "nitterInstance", "nitter.moomoo.me")
	        if (instance) {
				if (!settings.get("redirectColorEmbeds", true)) {
		            embed.url = embed.url.replace("twitter.com", instance)
		            embed.author.url = embed.author.url.replace("twitter.com", instance)
	            }
	            if (embed.mtega) embed.video.url = embed.video.url.replace("twitter.com", instance)
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
			link.props.href = link.props.href.replace(link.props.href.includes("fxtwitter.com") ? "fxtwitter.com" : "twitter.com", setting(settings, "nitterInstance", "nitter.moomoo.me"))
			link.props.onClick = (e) => {}
			if (settings.get("enableCosmetics", true)) link.props.style = {color: redirectLinkColor}
			link.props.title = link.props.href
		}
	},
	{
		name: "Libreddit",
		replaces: "reddit",
		instances: "https://github.com/spikecodes/libreddit#instances",
		default: "libreddit.silkky.cloud",
		replacedURL: "reddit.com",
		embedMatches: (embed) => {return embed.provider && embed.provider.name == "reddit"},
		replaceEmbed: (embed, settings) => {
	        let instance = setting(settings, "libredditInstance", "libreddit.silkky.cloud")
	        if (instance) {
	            if (!settings.get("redirectColorEmbeds", true)) embed.url = embed.url.replace("reddit.com", instance)
	            if (settings.get("enableCosmetics", true)) {
	                embed.provider.name = "Libreddit 🠔 reddit"
	                embed.color = "#009a9a"
	            }
	        }
		},
		replaceLink: (link, settings) => {
			if (!link.props.originallink) link.props.originallink = link.props.href
			link.props.href = link.props.href.replace(/((old|new|www)\.)?reddit\.com|redd\.it/, setting(settings, "libredditInstance", "libreddit.silkky.cloud"))
			link.props.onClick = (e) => {}
			if (settings.get("enableCosmetics", true)) link.props.style = {color: redirectLinkColor}
			link.props.title = link.props.href
		}
	},
	{
		name: "Bibliogram",
		replaces: "Instagram",
		instances: "https://git.sr.ht/~cadence/bibliogram-docs/tree/master/docs/Instances.md",
		default: "bibliogram.snopyta.org",
		replacedURL: "instagram.com",
		embedMatches: (embed) => {return false},
		replaceEmbed: (embed, settings) => {},
		replaceLink: (link, settings) => {
			if (!link.props.originallink) link.props.originallink = link.props.href
			let subpage = link.props.href.split("://")[1].split("/")[1]
			if (!(["", "p", "about"].includes(subpage))) {
				link.props.href = link.props.href.replace("www.instagram", "instagram").replace("instagram.com/", "instagram.com/u/")
			}
			link.props.href = link.props.href.replace("www.instagram", "instagram").replace("instagram.com", setting(settings, "bibliogramInstance", "bibliogram.snopyta.org"))
			link.props.onClick = (e) => {}
			if (settings.get("enableCosmetics", true)) link.props.style = {color: redirectLinkColor}
			link.props.title = link.props.href
		}
	},
	{
		name: "Wikiless",
		replaces: "Wikipedia",
		instances: "https://codeberg.org/orenom/Wikiless#instances",
		default: "wikiless.org",
		replacedURL: "en.wikipedia.org",
		embedMatches: (embed) => {return false},
		replaceEmbed: (embed, settings) => {},
		replaceLink: (link, settings) => {
			if (!link.props.originallink) link.props.originallink = link.props.href
			link.props.href = link.props.href.replace("en.wikipedia.org", setting(settings, "wikilessInstance", "wikiless.org"))
			link.props.onClick = (e) => {}
			if (settings.get("enableCosmetics", true)) link.props.style = {color: redirectLinkColor}
			link.props.title = link.props.href
		}
	},
	{
		name: "Scribe",
		replaces: "Medium",
		instances: null,
		default: "scribe.rip",
		replacedURL: "medium.com",
		embedMatches: (embed) => {return embed.provider && embed.provider.name == "Medium"},
		replaceEmbed: (embed, settings) => {
			if (settings.get("enableCosmetics", true)) {
				embed.provider.name = "Scribe 🠔 Medium"
			}
		},
		replaceLink: (link, settings) => {
			if (!link.props.originallink) link.props.originallink = link.props.href
			link.props.href = link.props.href.replace("medium.com", setting(settings, "scribeInstance", "scribe.rip"))
			link.props.onClick = (e) => {}
			if (settings.get("enableCosmetics", true)) link.props.style = {color: redirectLinkColor}
			link.props.title = link.props.href
		}
	},
]

module.exports.guide = {
	"www.youtube.com": 0,
	"youtube.com": 0,
	"youtu.be": 0,
	"twitter.com": 1,
	"fxtwitter.com": 1,
	"www.reddit.com": 2,
	"old.reddit.com": 2,
	"new.reddit.com": 2,
	"reddit.com": 2,
	"redd.it": 2,
	"instagram.com": 3,
	"www.instagram.com": 3,
	"en.wikipedia.org": 4,
	"medium.com": 5,
}
