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

const services = require("./services.js");

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
                services.forEach((s) => {
                	if (settings.get(s.name.toLowerCase() + "Active", true)) {
	                	if (s.matches(embed)) {
	                		s.replacefunc(embed, settings)
	                	}
                	}
                })
                return embed
            })
            return res;
        })
    }

    pluginWillUnload() {
        settings.unregister("embed-redirect");
        uninject("embed-redirect");
    };

    start() {
        this.startPlugin()
    }
    stop() {
        this.pluginWillUnload()
    }
};
