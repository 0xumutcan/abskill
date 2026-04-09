"use client";

import { useState } from "react";
import { skills, PACKAGES, CATEGORIES } from "@/data/skills";
import { Skill, SkillSource, SkillPackage } from "@/types/skill";

interface Props {
  onOpenSkill: (skill: Skill) => void;
}

type View = "root" | "source" | "package";

export default function SkillsExplorer({ onOpenSkill }: Props) {
  const [view, setView] = useState<View>("root");
  const [activeSource, setActiveSource] = useState<SkillSource | null>(null);
  const [activePackage, setActivePackage] = useState<SkillPackage | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const officialSkills = skills.filter((s) => s.source === "official");
  const communitySkills = skills.filter((s) => s.source === "community");

  const officialPackages = PACKAGES.filter((p) => p.type === "indexed");
  const communityCategories = CATEGORIES.filter((c) =>
    communitySkills.some((s) => s.category === c)
  );

  const skillsInPackage = activePackage
    ? skills.filter((s) => s.package === activePackage.id)
    : [];

  const skillsInView =
    activeSource === "official" ? skillsInPackage : communitySkills;

  const getPath = () => {
    if (view === "root") return "C:\\abSkill";
    const sourceLabel = activeSource === "official" ? "Official Skills" : "Community Skills";
    if (view === "source") return `C:\\abSkill\\${sourceLabel}`;
    return `C:\\abSkill\\${sourceLabel}\\${activePackage?.label}`;
  };

  const handleBack = () => {
    if (view === "package") { setView("source"); setActivePackage(null); setSelectedItem(null); }
    else if (view === "source") { setView("root"); setActiveSource(null); setSelectedItem(null); }
  };

  const statusText = () => {
    if (view === "root") return "2 folder(s)";
    if (view === "source") {
      if (activeSource === "official")
        return `${officialPackages.length + PACKAGES.filter(p => p.type === "linked").length} folder(s), ${officialSkills.length} skill(s) total`;
      return `${communityCategories.length} folder(s), ${communitySkills.length} skill(s) total`;
    }
    return `${skillsInPackage.length} skill(s)`;
  };

  const currentFolderLabel =
    view === "root" ? "abSkill"
    : view === "source" ? (activeSource === "official" ? "Official Skills" : "Community Skills")
    : (activePackage?.label ?? "");

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--win-silver)" }}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-1 py-1 border-b" style={{ borderColor: "var(--win-dark)" }}>
        <button className="win-btn" style={{ minWidth: 60, fontSize: 11 }} onClick={handleBack} disabled={view === "root"}>
          ← Back
        </button>
        <div className="flex items-center gap-1 flex-1 mx-1 sunken px-1 py-0.5" style={{ background: "white", fontSize: 11 }}>
          <span>📁</span>
          <span>{currentFolderLabel}</span>
        </div>
      </div>

      {/* Address bar */}
      <div className="flex items-center gap-1 px-2 py-0.5 border-b" style={{ borderColor: "var(--win-dark)", fontSize: 11 }}>
        <span style={{ color: "var(--win-darker)" }}>Address:</span>
        <div className="flex-1 sunken px-1 py-0.5" style={{ background: "white" }}>{getPath()}</div>
      </div>

      {/* File area */}
      <div className="flex-1 overflow-auto p-2 sunken" style={{ background: "white", margin: 4 }}>

        {/* ROOT */}
        {view === "root" && (
          <div className="flex flex-wrap gap-6 p-2">
            {[
              { id: "official" as SkillSource, label: "Official Skills", count: officialSkills.length, icon: "📁" },
              { id: "community" as SkillSource, label: "Community Skills", count: communitySkills.length, icon: "📂" },
            ].map((folder) => (
              <div
                key={folder.id}
                className="flex flex-col items-center gap-1 p-2 cursor-default"
                style={{
                  width: 90,
                  background: selectedItem === folder.id ? "var(--win-blue)" : "transparent",
                  color: selectedItem === folder.id ? "white" : "var(--win-black)",
                  outline: selectedItem === folder.id ? "1px dotted white" : "none",
                }}
                onClick={() => setSelectedItem(folder.id)}
                onDoubleClick={() => { setActiveSource(folder.id); setView("source"); setSelectedItem(null); }}
              >
                <span style={{ fontSize: 36 }}>{folder.icon}</span>
                <span className="text-center" style={{ fontSize: 11, lineHeight: 1.3 }}>{folder.label}</span>
                <span style={{ fontSize: 10, opacity: 0.7 }}>{folder.count} skills</span>
              </div>
            ))}
          </div>
        )}

        {/* SOURCE — Official: dynamic package folders */}
        {view === "source" && activeSource === "official" && (
          <div className="flex flex-wrap gap-4 p-2">
            {PACKAGES.map((pkg) => {
              const count = skills.filter((s) => s.package === pkg.id).length;
              return (
                <div
                  key={pkg.id}
                  className="flex flex-col items-center gap-1 p-2 cursor-default"
                  style={{
                    width: 90,
                    background: selectedItem === pkg.id ? "var(--win-blue)" : "transparent",
                    color: selectedItem === pkg.id ? "white" : "var(--win-black)",
                    outline: selectedItem === pkg.id ? "1px dotted white" : "none",
                  }}
                  onClick={() => setSelectedItem(pkg.id)}
                  onDoubleClick={() => {
                    if (pkg.type === "linked" && pkg.url) {
                      window.open(pkg.url, "_blank");
                    } else {
                      setActivePackage(pkg);
                      setView("package");
                      setSelectedItem(null);
                    }
                  }}
                >
                  {pkg.logo ? (
                    <img src={pkg.logo} alt={pkg.label} style={{ width: 36, height: 36, objectFit: "contain" }} />
                  ) : (
                    <span style={{ fontSize: 36 }}>📁</span>
                  )}
                  <span className="text-center" style={{ fontSize: 11, lineHeight: 1.3 }}>{pkg.label}</span>
                  <span style={{ fontSize: 10, opacity: 0.7 }}>
                    {pkg.type === "linked" ? "skill.md" : `${count} skills`}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* SOURCE — Community: category folders */}
        {view === "source" && activeSource === "community" && (
          <div className="flex flex-wrap gap-4 p-2">
            {communityCategories.map((cat) => {
              const count = communitySkills.filter((s) => s.category === cat).length;
              return (
                <div
                  key={cat}
                  className="flex flex-col items-center gap-1 p-2 cursor-default"
                  style={{
                    width: 80,
                    background: selectedItem === cat ? "var(--win-blue)" : "transparent",
                    color: selectedItem === cat ? "white" : "var(--win-black)",
                    outline: selectedItem === cat ? "1px dotted white" : "none",
                  }}
                  onClick={() => setSelectedItem(cat)}
                  onDoubleClick={() => { setSelectedItem(null); }}
                >
                  <span style={{ fontSize: 32 }}>📁</span>
                  <span className="text-center" style={{ fontSize: 11, lineHeight: 1.2 }}>{cat}</span>
                  <span style={{ fontSize: 10, opacity: 0.7 }}>{count} skills</span>
                </div>
              );
            })}
          </div>
        )}

        {/* PACKAGE: skill files */}
        {view === "package" && (
          <div className="flex flex-wrap gap-4 p-2">
            {skillsInPackage.map((skill) => (
              <div
                key={skill.id}
                className="flex flex-col items-center gap-1 p-2 cursor-default"
                style={{
                  width: 80,
                  background: selectedItem === skill.id ? "var(--win-blue)" : "transparent",
                  color: selectedItem === skill.id ? "white" : "var(--win-black)",
                  outline: selectedItem === skill.id ? "1px dotted white" : "none",
                }}
                onClick={() => setSelectedItem(skill.id)}
                onDoubleClick={() => onOpenSkill(skill)}
              >
                <span style={{ fontSize: 32 }}>📄</span>
                <span className="text-center" style={{ fontSize: 11, lineHeight: 1.2, wordBreak: "break-word" }}>
                  {skill.name}
                </span>
                {skill.verified && <span style={{ fontSize: 10 }}>✓</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-4 px-2 py-0.5 border-t" style={{ borderColor: "var(--win-dark)", fontSize: 11 }}>
        <div className="sunken px-2 py-0.5 flex-1">{statusText()}</div>
        <div className="sunken px-2 py-0.5">
          {selectedItem && view === "package"
            ? skills.find((s) => s.id === selectedItem)?.verified ? "Verified" : "Community"
            : ""}
        </div>
      </div>
    </div>
  );
}
