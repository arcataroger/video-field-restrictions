import { Canvas } from "datocms-react-ui";
import type {
  FieldAdditionalProperties,
  ItemFormAdditionalProperties,
  RenderFieldExtensionCtx,
} from "datocms-plugin-sdk";
import { useEffect, useMemo, useState } from "react"; // For simpler flat records, we can just use `ctx.formValues[ctx.fieldPath]`, but that won't work if the video field

// For simpler flat records, we can just use `ctx.formValues[ctx.fieldPath]`, but that won't work if the video field
// is inside a Modular Content Field block (because it becomes an array of blocks)
const getFieldValueByFieldPath = (
  formValues: ItemFormAdditionalProperties["formValues"],
  fieldPath: FieldAdditionalProperties["fieldPath"],
) => {
  return fieldPath
    .split(".")
    .reduce(
      (acc, key) =>
        acc && (acc[key] as ItemFormAdditionalProperties["formValues"]),
      formValues,
    );
};

type VideoParams = {
  url: string;
  title: string;
  width: number;
  height: number;
  provider: "youtube" | "vimeo" | "facebook";
  provider_uid: string;
  thumbnail_url: string;
};

const FORMATTED_PROVIDER_NAMES: Record<VideoParams["provider"], string> = {
  youtube: "YouTube",
  vimeo: "Vimeo",
  facebook: "Facebook",
};

const joinWithAnd = (strings: string[]): string =>
  strings.length === 1
    ? strings[0]
    : `${strings.slice(0, -1).join(", ")} and ${strings[strings.length - 1]}`;

export const VideoFieldRestrictions = ({
  ctx,
}: {
  ctx: RenderFieldExtensionCtx;
}) => {
  const { formValues, fieldPath, field, parentField, block } = ctx;

  const [isLastInputValid, setIsLastInputValid] = useState(true);

  const allowedProviders = new Set<VideoParams["provider"]>([
    "youtube",
    "facebook",
    "facebook",
  ]);

  const allowedProvidersString: string = joinWithAnd(
    [...allowedProviders].map((provider) => FORMATTED_PROVIDER_NAMES[provider]),
  );

  const chosenProvider = useMemo<VideoParams["provider"] | undefined>(() => {
    const videoParams = getFieldValueByFieldPath(
      formValues,
      fieldPath,
    ) as VideoParams;

    return videoParams?.provider ?? undefined;
  }, [formValues, fieldPath]);

  useEffect(() => {
    // Do nothing if no provider detected
    if (!chosenProvider) {
      return;
    }

    const parentLabel = parentField?.attributes?.label;
    const blockLabel = block?.blockModel?.attributes?.name;

    if (!allowedProviders.has(chosenProvider)) {
      (async () => {
        await ctx.setFieldValue(fieldPath, null);
        setIsLastInputValid(false);
        await ctx.alert(
          `Sorry, you can't use a ${FORMATTED_PROVIDER_NAMES[chosenProvider]} video here. The "${field.attributes.label}" field ${parentLabel && blockLabel ? `in ${parentLabel} > ${blockLabel}` : ""} only allows ${allowedProvidersString}.`,
        );
      })();
    } else {
      setIsLastInputValid(true);
    }
  }, [chosenProvider]);

  return (
    <Canvas ctx={ctx}>
      <div
        style={{
          marginTop: 0,
          color: `var(${isLastInputValid ? "--light-body-color" : "--alert-color"})`,
        }}
      >
        Allowed providers: {allowedProvidersString}
      </div>
      <div style={{ marginBottom: "1em" }} />
    </Canvas>
  );
};