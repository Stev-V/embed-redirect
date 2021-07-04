/* Copyright (C) 2020 TaiAurori (Gabriel Sylvain), Juby210 - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the MIT license.
 * Basically, you can change and redistribute this code
 * but this copyright notice must remain unmodified.
 */

const { MoldSettings, req } = require("./modules/moldit.js");
let settings;

const { Plugin } = req("entities");
const { inject, uninject } = req("injector");
const { getModule, getModuleByDisplayName } = req("webpack");

const Settings = require("./Settings");

module.exports = class EmbedRedirect extends Plugin {
  startPlugin() {
    settings = new MoldSettings(this);
    settings.register({
      id: "embed-redirect",
      label: "Embed Redirect",
      render: Settings,
    });
    this.initInject();
  }

  async initInject() {
	  inject("embed-redirect", (await getModule(["MessageAccessories"])), "default", (args, res) => {
	      res.props.message.embeds = res.props.message.embeds.map((embed) => {
	          if (embed.video) {
	              if ((embed.video.originalURL ? embed.video.originalURL : embed.video.url).includes("youtube")) {
	              	  if (!embed.video.originalURL) embed.video.originalURL = embed.video.url;
	                  let invidiousInstance = settings.get("invidiousInstance", "yewtu.be")
	                  if (invidiousInstance.startsWith("https://") || invidiousInstance.startsWith("http://")) invidiousInstance = invidiousInstance.split("://")[1]
	                  if (invidiousInstance.endsWith("/")) invidiousInstance = invidiousInstance.slice(0, invidiousInstance.length - 1)
	                  if (!invidiousInstance) {
	                   	embed.video.url = "data:text/plain,No Invidious instance selected. You can either:\n- Go to the settings page for Embed Redirect and select one\n- Turn off Embed Redirect\n\n\n"        	
					  } else {
					  	embed.video.url = embed.video.url.replace("www.youtube.com", invidiousInstance)
					  }
	              }
	          }
	          return embed
		  })
	      return res;
      })
  }

  pluginWillUnload() {
    settings.unregister("embed-redirect");
    uninject("embed-redirect");
  };

  start() {this.startPlugin()}
  stop() {this.pluginWillUnload()}
};
