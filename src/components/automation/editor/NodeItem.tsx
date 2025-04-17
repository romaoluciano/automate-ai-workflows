
import { useState } from "react";

interface NodeItemProps {
  type: string;
  label: string;
  category: string;
}

export function NodeItem({ type, label, category }: NodeItemProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify({
      type,
      label,
      category
    }));
    event.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
  };

  return (
    <div
      className={`cursor-grab border rounded p-2 mb-2 bg-white hover:bg-gray-50 ${
        isDragging ? "opacity-50" : ""
      }`}
      onDragStart={onDragStart}
      onDragEnd={() => setIsDragging(false)}
      draggable
    >
      {label}
    </div>
  );
}
