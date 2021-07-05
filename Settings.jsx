const { req, MoldSettings } = require("./modules/moldit.js");
var settings;

const { React, getModuleByDisplayName } = req("webpack");
const { Category, TextInput, SwitchItem } = req("components/settings");
const FormItem = getModuleByDisplayName("FormItem", false);
const FormText = getModuleByDisplayName("FormText", false);

const services = require("./services.js")

module.exports = class Settings extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
    settings = new MoldSettings(this, "embed-redirect");
  }

  render() {
    return (
      <div>
        <SwitchItem
          note="Embed cosmetics will make embeds with redirected services visually different. (may require refresh to apply)"
          value={settings.getSetting("enableCosmetics", true)}
          onChange={p=>{
            settings.toggleSetting('enableCosmetics', true)
          }}
        >Embed Cosmetics</SwitchItem>
        {
	        services.map(s => {
	          return <Category name={s.name + " (" + s.replaces + ")"} 
	          	opened={this.state["opened_" + s.name]} 
	          	onChange={() => {
	          	  this.setState({ ["opened_" + s.name]: !this.state["opened_" + s.name ] })
	          	}}>
			      <SwitchItem
			        note=<span>Toggles whether {s.replaces} embeds will be replaced with {s.name}.</span>
			        value={settings.getSetting(s.name.toLowerCase() + "Active", true)}
			        onChange={p=>{
			          settings.toggleSetting(s.name.toLowerCase() + "Active", true)
                    }}
                  >
                  	Replace Embeds
			      </SwitchItem>
			      <SwitchItem
			        note=<span>Toggles whether {s.replaces} links will be replaced with {s.name}.</span>
			        value={settings.getSetting(s.name.toLowerCase() + "LinkActive", true)}
			        onChange={p=>{
			          settings.toggleSetting(s.name.toLowerCase() + "LinkActive", true)
                    }}
                  >
                  	Replace Links
			      </SwitchItem>
		          <TextInput
		            note={<span>This is the {s.name} instance that will replace all {s.replaces} links/embeds. <a href={s.instances} rel="noreferrer noopener" target="_blank">See here</a> for a list of {s.name} instances (maintained by someone else)</span>}
		            defaultValue={settings.getSetting(s.name.toLowerCase() + "Instance", s.default)}
		            onChange={(val) =>
		              settings.updateSetting(s.name.toLowerCase() + "Instance", val)
		            }
		          >
		            {s.name} Instance
		          </TextInput>
	          </Category>
	        })
        }
      </div>
    );
  }
};
