import { connect, RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import "datocms-react-ui/styles.css";
import ConfigScreen from "./entrypoints/ConfigScreen";
import { render } from "./utils/render";
import { VideoFieldRestrictions } from "./components/VideoFieldRestrictions.tsx";
import {
  FieldSpecificConfigScreen,
  PluginParameters,
} from "./components/FieldSpecificConfigScreen.tsx";

connect({
  renderConfigScreen(ctx) {
    return render(<ConfigScreen ctx={ctx} />);
  },

  manualFieldExtensions() {
    return [
      {
        id: "videoFieldRestrictions",
        name: "Video Field Provider Restrictions",
        type: "addon",
        fieldTypes: ["video"],
        configurable: true,
      },
    ];
  },

  renderManualFieldExtensionConfigScreen(_, ctx) {
    render(<FieldSpecificConfigScreen ctx={ctx} />);
  },

  renderFieldExtension(_, ctx: RenderFieldExtensionCtx) {
    render(<VideoFieldRestrictions ctx={ctx} />);
  },

  validateManualFieldExtensionParameters(_, parameters: PluginParameters) {
    if (!parameters.allowedProviders?.length) {
      return { allowedProviders: "You must select at least one provider" };
    }
    return { allowedProviders: "test" };
  },
});
