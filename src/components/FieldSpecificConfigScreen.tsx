import { RenderManualFieldExtensionConfigScreenCtx } from "datocms-plugin-sdk";
import { Canvas, Form, SelectField } from "datocms-react-ui";
import {useMemo, useState} from "react";
import {
  FORMATTED_PROVIDER_NAMES,
  type KnownLabels,
  type KnownProviders,
} from "./VideoFieldRestrictions.tsx";

type DropdownOptions = {
  value: KnownProviders;
  label: KnownLabels;
}[];

const allProviders: DropdownOptions = Object.entries(
  FORMATTED_PROVIDER_NAMES,
).map((idAndLabel) => ({
  value: idAndLabel[0] as KnownProviders,
  label: idAndLabel[1] as KnownLabels,
}));

export type PluginParameters = {
  allowedProviders?: KnownProviders[];
};

export const paramsToState = (params: PluginParameters): DropdownOptions => {
  if (!params?.allowedProviders) {
    return [];
  }
  return params.allowedProviders.map((provider) => ({
    value: provider,
    label: FORMATTED_PROVIDER_NAMES[provider],
  }));
};

export const stateToParams = (options: DropdownOptions): PluginParameters => ({
  allowedProviders: options.map((option) => option.value),
});

export const FieldSpecificConfigScreen = ({
  ctx,
}: {
  ctx: RenderManualFieldExtensionConfigScreenCtx;
}) => {
  const { parameters, errors } = ctx as typeof ctx & { parameters: PluginParameters };

  const [selectedOptions, setSelectedOptions] = useState<DropdownOptions>(
    parameters ? paramsToState(parameters) : [],
  );

  const handleNewOptions = (newOptions: DropdownOptions) => {
    setSelectedOptions(newOptions);
    (async () => await ctx.setParameters(stateToParams(newOptions)))();
  };

  const error = useMemo(() => {
    if(!selectedOptions?.length) {
      return <span>You must select at least one option</span>
    }
  }, [selectedOptions])

  return (
    <Canvas ctx={ctx}>
      {JSON.stringify(errors)}
      <Form style={{ minHeight: "15em" }}>
        <SelectField
          name="allowedProviders"
          id="allowedProviders"
          label="Which video providers should be allowed?"
          hint="If the one you want isn't listed here, the plugin probably needs an update."
          value={selectedOptions}
          selectInputProps={{
            isMulti: true,
            options: allProviders,
          }}
          onChange={(newOptions) =>
            handleNewOptions(newOptions as DropdownOptions)
          }
          error={error}
        />
      </Form>
    </Canvas>
  );
};
