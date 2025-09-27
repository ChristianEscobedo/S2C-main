import { Shape } from "@/redux/slice/shapes";
import { Frame } from "./frame";
import { Elipse } from "./elipse";
import { Stroke } from "./stroke";
import { Rectangle } from "./rectangle";
import { Arrow } from "./arrow";
import { Line } from "./line";
import { Text } from "./text";
import { GeneratedUI } from "./generatedui";

export const ShapeRenderer = ({
  shape,
  toggleInspiration,
  toggleChat,
  generateWorkflow,
  exportDesign,
}: {
  shape: Shape;
  toggleInspiration: () => void;
  toggleChat: (generatedUIId: string) => void;
  generateWorkflow: (generatedUIId: string) => void;
  exportDesign: (generatedUIId: string, element: HTMLElement | null) => void;
}) => {
  switch (shape.type) {
    case "frame":
      return <Frame shape={shape} toggleInspiration={toggleInspiration} />;
    case "rect":
      return <Rectangle shape={shape} />;
    case "ellipse":
      return <Elipse shape={shape} />;
    case "freedraw":
      return <Stroke shape={shape} />;
    case "arrow":
      return <Arrow shape={shape} />;
    case "line":
      return <Line shape={shape} />;
    case "text":
      return <Text shape={shape} />;
    case "generatedui":
      return (
        <GeneratedUI
          shape={shape}
          toggleChat={toggleChat}
          generateWorkflow={generateWorkflow}
          exportDesign={exportDesign}
        />
      );
    default:
      return null;
  }
};
