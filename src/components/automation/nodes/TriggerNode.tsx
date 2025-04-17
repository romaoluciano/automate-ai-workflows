
import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";

type TriggerNodeProps = {
  data: {
    label: string;
  };
  isConnectable?: boolean;
};

export const TriggerNode = memo(({ data, isConnectable }: TriggerNodeProps) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-purple-300">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-600 mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </div>
        <div className="ml-2">
          <div className="text-sm font-medium">{data.label}</div>
          <div className="text-xs text-gray-500">Gatilho</div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-purple-500"
      />
    </div>
  );
});
