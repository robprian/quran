import { NeumorphicInput, NeumorphicButton } from "@/components/neumorphism";
import { useLangStore } from "@/features/lang/store/langStore";

interface DuaFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedGroup: string;
  setSelectedGroup: (val: string) => void;
  groups: string[];
  selectedTag: string;
  setSelectedTag: (val: string) => void;
  tags: string[];
}

export function DuaFilterBar({
  searchQuery, setSearchQuery,
  selectedGroup, setSelectedGroup, groups,
  selectedTag, setSelectedTag, tags
}: DuaFilterBarProps) {
  const { t, lang } = useLangStore();
  const isId = lang === "id";

  return (
    <div className="space-y-4 mb-6">
      <NeumorphicInput
        placeholder={isId ? "Cari doa..." : "Search duas..."}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
        icon={<span>🔍</span>}
      />

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Select Dropdown */}
        <div className="relative w-full sm:w-1/3">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full appearance-none bg-neu-bg dark:bg-neu-dark rounded-2xl py-3 px-4 text-sm font-semibold text-neu-text dark:text-neu-dark-text shadow-[inset_4px_4px_8px_#A3B1C6,inset_-4px_-4px_8px_#FFFFFF] dark:shadow-[inset_4px_4px_8px_#0a0a0a,inset_-4px_-4px_8px_#2a2a2a] focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            <option value="">{isId ? "Semua Kategori" : "All Categories"}</option>
            {groups.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neu-muted text-xs">
            ▼
          </div>
        </div>

        {/* Scrollable Tags */}
        <div className="flex-1 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2">
            <NeumorphicButton
              variant={!selectedTag ? "pressed" : "flat"}
              size="sm"
              onClick={() => setSelectedTag("")}
              className="whitespace-nowrap"
            >
              {isId ? "Semua Tag" : "All Tags"}
            </NeumorphicButton>
            {tags.map(tag => (
              <NeumorphicButton
                key={tag}
                variant={selectedTag === tag ? "pressed" : "flat"}
                size="sm"
                onClick={() => setSelectedTag(tag === selectedTag ? "" : tag)}
                className="whitespace-nowrap text-xs"
              >
                #{tag}
              </NeumorphicButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
