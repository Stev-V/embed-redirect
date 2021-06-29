const { req, MoldSettings } = require("./modules/moldit.js");
var settings;

const { React, getModuleByDisplayName } = req("webpack");
const { Category, TextInput, SwitchItem } = req("components/settings");
const FormItem = getModuleByDisplayName("FormItem", false);
const FormText = getModuleByDisplayName("FormText", false);

module.exports = class Settings extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
    settings = new MoldSettings(this, "embed-redirect");
  }

  render() {
    return (
      <div>
        <TextInput
          note={<span>This is the Invidious instance that will replace all YouTube embeds. <a href="https://github.com/iv-org/documentation/blob/master/Invidious-Instances.md" target="_blank">See here</a> for a list of Invidious instances (maintained by someone else)</span>}
          defaultValue={settings.getSetting("invidiousInstance", "")}
          onChange={(val) =>
            settings.updateSetting("invidiousInstance", val)
          }
        >
          Invidious Instance (YouTube)
        </TextInput>
      </div>
    );
  }
};
