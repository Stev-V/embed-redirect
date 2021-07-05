module.exports = [
	{
		name: "Invidious",
		replaces: "YouTube",
		instances: "https://github.com/iv-org/documentation/blob/master/Invidious-Instances.md",
		default: "yewtu.be",
		matches: (embed) => {return embed.video && (embed.video.originalURL ? embed.video.originalURL : embed.video.url).includes("youtube")},
		replacefunc: (embed, settings) => {
	        if (!embed.video.originalURL) embed.video.originalURL = embed.video.url;
	        let invidiousInstance = settings.get("invidiousInstance", "yewtu.be")
	        if (invidiousInstance.startsWith("https://") || invidiousInstance.startsWith("http://")) invidiousInstance = invidiousInstance.split("://")[1]
	        if (invidiousInstance.endsWith("/")) invidiousInstance = invidiousInstance.slice(0, invidiousInstance.length - 1)
	        if (!invidiousInstance) {
	            embed.video.url = "data:text/plain,No Invidious instance selected. You can either:\n- Go to the settings page for Embed Redirect and select one\n- Turn off Embed Redirect\n\n\n"
	        } else {
	            embed.video.url = embed.video.url.replace("www.youtube.com", invidiousInstance)
	            embed.provider.url = "https://" + invidiousInstance
	            embed.author.url = embed.author.url.replace("www.youtube.com", invidiousInstance)
	            embed.url = embed.url.replace("www.youtube.com", invidiousInstance)
	            if (settings.get("enableCosmetics", true)) {
	                embed.provider.name = "Invidious 🠔 YouTube"
	                embed.color = "#f1680d"
	            }
	        }
		}
	}
]
