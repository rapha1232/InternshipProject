import { Separator } from "./ui/separator";

import type { JSX } from "react";

interface ContentSectionProps {
  title: string;
  desc: string;
  children: JSX.Element;
}

export default function ContentSection({
  title,
  desc,
  children,
}: ContentSectionProps) {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg p-6 space-y-6 min-h-screen">
      <div className="flex-none space-y-2">
        <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
      <Separator className="my-4" />
      <div className="overflow-hidden bg-gray-50 rounded-lg p-4">
        <div className="lg:max-w-xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
