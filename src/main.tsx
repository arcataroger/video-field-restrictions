import { connect, RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import "datocms-react-ui/styles.css";
import ConfigScreen from "./entrypoints/ConfigScreen";
import { render } from "./utils/render";
import { VideoFieldRestrictions } from "./components/VideoFieldRestrictions.tsx";

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
      },
    ];
  },

  renderFieldExtension(fieldExtensionId: string, ctx: RenderFieldExtensionCtx) {
    switch (fieldExtensionId) {
      case "videoFieldRestrictions":
        return render(<VideoFieldRestrictions ctx={ctx} />);
    }
  },
});
