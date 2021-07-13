/* Copyright (C) 2020 TaiAurori (Gabriel Sylvain) - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the MIT license.
 * Basically, you can change and redistribute this code
 * but this copyright notice must remain unmodified.
 */

let settings;

const { Plugin } = require("powercord/entities");
const { inject, uninject } = require("powercord/injector");
const { getModule, getModuleByDisplayName, React } = require("powercord/webpack");
const { findInReactTree } = require("powercord/util");
const { clipboard } = getModule(["clipboard"], false) || {};

const Settings = require("./Settings");

const services = require("./services.js");

module.exports = class EmbedRedirect extends Plugin {
    startPlugin() {
        settings = this.settings;
        powercord.api.settings.registerSettings(this.entityID, {
            category: this.entityID,
            label: this.manifest.name, 
            render: Settings
        });
        this.initInject();
    }

    async initInject() {
        inject("embed-redirect", (await getModule(["MessageAccessories"])), "default", (args, res) => {
            res.props.message.embeds = res.props.message.embeds.map((embed) => {
                services.forEach((s) => {
                	if (settings.get(s.name.toLowerCase() + "Active", true)) {
	                	if (s.embedMatches(embed)) {
	                		s.replaceEmbed(embed, settings)
	                	}
                	}
                })
                return embed
            })
            return res;
        })
        
        let Anchor = await getModule(m => m.default?.displayName === "Anchor")
        inject("embed-redirect-link", Anchor, "default", (args, res) => {
            if (res.props.href) {
            	let trimmed = res.props.href
			    if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) trimmed = trimmed.split("://")[1]
			    if (trimmed.endsWith("/")) trimmed = trimmed.slice(0, trimmed.length - 1)
			    if (trimmed.includes("/")) trimmed = trimmed.split("/")[0]
			    if (trimmed in services.guide) {
			    	let service = services[services.guide[trimmed]]
			    	if (service) {
			    		if (settings.get(service.name.toLowerCase() + "LinkActive", true)) {
			    			service.replaceLink(res, settings)
			    		}
			    	}
			    }
            }
            return res
        })
        Anchor.default.displayName = "Anchor"

        
        const Menu = await getModule(['MenuGroup', 'MenuItem'])
        const MessageContextMenu = await getModule(m => m.default && m.default.displayName == 'MessageContextMenu')
        inject('embed-redirect-context-menu', MessageContextMenu, 'default', (args, res) => {
        	if (args[0].target.tagName.toLowerCase() == "a" && args[0].target.getAttribute("originallink")) {
	            if (!findInReactTree(res, e => e.props && e.props.id == 'copy-redirected-link')) {
	            	let copyLink = findInReactTree(res, e => e.props && e.props.id == 'copy-native-link');
	            	let openLink = findInReactTree(res, e => e.props && e.props.id == 'open-native-link');
	            	let copyLinkGroup = findInReactTree(res, e => e.props && e.props.children && e.props.children[0] && e.props.children[0].props && e.props.children[0].props.id == 'copy-native-link');
	            	if (copyLink) {
		                (copyLinkGroup ? copyLinkGroup : res).props.children.splice((copyLinkGroup ? 1 : 2), 0, 
		                	React.createElement(Menu.MenuItem,
		                    	{
			                        action: () => {clipboard.copy(args[0].target.getAttribute("href"))},
			                        id: 'copy-redirected-link',
			                        label: 'Copy Redirected Link'
			                    }
		                	)
		                )
		                copyLink.props.action = () => {clipboard.copy(args[0].target.getAttribute("originallink"))}
		                openLink.props.action = () => {window.open(args[0].target.getAttribute("originallink"))}
	                }
	            } 
            }
            return res
        })
        MessageContextMenu.default.displayName = 'MessageContextMenu'
    }

    pluginWillUnload() {
		powercord.api.settings.unregisterSettings(this.entityID);
        uninject("embed-redirect");
        uninject("embed-redirect-link");
        uninject("embed-redirect-context-menu");
    };
};
