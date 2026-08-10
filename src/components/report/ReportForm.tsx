"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { Tag } from "@/components/ui/Tag";
import { Sparkle } from "@/components/ui/Icon";
import { PinPicker } from "@/components/map/PinPicker";
import {
  CAMPUS_CENTER,
  coordsForLocation,
  nearestLocation,
  type LngLat,
} from "@/lib/geo";
import { cn } from "@/lib/cn";
import {
  items as itemsApi,
  ai as aiApi,
  categories as catApi,
  locations as locApi,
  type CategoryDTO,
  type LocationDTO,
} from "@/lib/api";

type Mode = "lost" | "found";
type Photo = { kind: "sample" } | { kind: "upload"; url: string; file: File };
type Phase = "idle" | "analyzing" | "done" | "error";

const ANALYZING_MESSAGES = [
  "Looking at the photo...",
  "Identifying the object...",
  "Choosing a category...",
  "Writing a description...",
];

const emptyFields = {
  title: "",
  description: "",
  category: "",
  categoryId: null as number | null,
  heldAt: "",
  locationId: null as number | null,
  location: "",
  date: "",
  color: "",
  brand: "",
};

function selectClass(filled: boolean) {
  return cn(
    "w-full cursor-pointer rounded-[9px] border border-line bg-card px-3.5 py-3 text-sm focus:border-rust focus:outline-none",
    filled ? "text-ink" : "text-muted",
  );
}

export function ReportForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("found");
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [msgIndex, setMsgIndex] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [fields, setFields] = useState(emptyFields);
  const [coord, setCoord] = useState<LngLat>(CAMPUS_CENTER);
  const [posted, setPosted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiCategories, setApiCategories] = useState<CategoryDTO[]>([]);
  const [apiLocations, setApiLocations] = useState<LocationDTO[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const isFound = mode === "found";

  // Load categories and locations from API
  useEffect(() => {
    catApi.list().then(setApiCategories).catch(() => {});
    locApi.list().then(setApiLocations).catch(() => {});
  }, []);

  function pickCoord(c: LngLat) {
    setCoord(c);
    setFields((f) => ({ ...f, location: nearestLocation(c) }));
  }

  // Cycle the loader messages while analyzing
  useEffect(() => {
    if (phase !== "analyzing") return;
    const t = setInterval(
      () => setMsgIndex((i) => (i + 1) % ANALYZING_MESSAGES.length),
      450,
    );
    return () => clearInterval(t);
  }, [phase]);

  function set<K extends keyof typeof emptyFields>(key: K, value: (typeof emptyFields)[K]) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto({ kind: "upload", url: URL.createObjectURL(file), file });
    setPhase("idle");
  }

  async function runAiDescribe() {
    if (!photo || photo.kind !== "upload") return;
    setPhase("analyzing");
    setMsgIndex(0);

    try {
      const result = await aiApi.describe(photo.file);
      // Find matching category ID
      const cat = apiCategories.find(
        (c) => c.name.toLowerCase() === result.category?.toLowerCase(),
      );
      setFields((f) => ({
        ...f,
        title: result.title || f.title,
        description: result.description || f.description,
        category: result.category || f.category,
        categoryId: cat?.id ?? f.categoryId,
        color: result.color || f.color,
        brand: result.brand || f.brand,
      }));
      setTags(result.tags ?? []);
      setPhase("done");
    } catch {
      // AI not available — fall back to manual
      setPhase("error");
      setTimeout(() => setPhase("idle"), 2000);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Find location ID from name
      const loc = apiLocations.find(
        (l) => l.name.toLowerCase() === fields.location.toLowerCase(),
      );

      await itemsApi.create({
        type: isFound ? "FOUND" : "LOST",
        title: fields.title,
        description: fields.description,
        categoryId: fields.categoryId,
        locationId: loc?.id ?? null,
        heldAt: isFound ? fields.heldAt : null,
        latitude: coord.lat,
        longitude: coord.lng,
        eventDate: fields.date || null,
        color: fields.color || null,
        brand: fields.brand || null,
        tags: tags,
        photoUrls: photo?.kind === "upload" ? [] : [],
      });

      setPosted(true);
    } catch {
      // Show error inline
      setSubmitting(false);
    }
  }

  if (posted) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rusttint text-rust">
          <Sparkle size={26} />
        </div>
        <h2 className="mb-2 font-serif text-2xl font-semibold">
          Posted to the board
        </h2>
        <p className="mb-6 text-sm text-ink3">
          Your {isFound ? "found" : "lost"} item is now live. We&apos;ll ping you
          the moment something matches.
        </p>
        <Link href="/">
          <Button size="lg">Back to board</Button>
        </Link>
      </div>
    );
  }

  const categoryOptions = apiCategories.length > 0
    ? apiCategories
    : [
        { id: 1, name: "Electronics", icon: "" },
        { id: 2, name: "Accessories", icon: "" },
        { id: 3, name: "Keys", icon: "" },
        { id: 4, name: "Cards", icon: "" },
        { id: 5, name: "Bags", icon: "" },
        { id: 6, name: "Jewelry", icon: "" },
        { id: 7, name: "Clothing", icon: "" },
        { id: 8, name: "Documents", icon: "" },
        { id: 9, name: "Books", icon: "" },
        { id: 10, name: "Other", icon: "" },
      ];

  const locationOptions = apiLocations.length > 0
    ? apiLocations
    : [
        { id: 1, name: "Balme Library", description: null, latitude: null, longitude: null },
        { id: 2, name: "JQB", description: null, latitude: null, longitude: null },
      ];

  return (
    <div className="pb-16">
      {/* Lost / Found toggle */}
      <div className="mb-4 flex w-fit gap-2 rounded-[9px] bg-[#eee7db] p-[5px] text-[13.5px] font-semibold">
        {(["lost", "found"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "rounded-[6px] px-5 py-2 transition-colors",
              mode === m
                ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                : "text-muted",
            )}
          >
            {m === "lost" ? "I lost an item" : "I found an item"}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-8 md:grid-cols-[420px_1fr]"
      >
        {/* Left: photo + AI */}
        <div>
          <div className="eyebrow mb-2.5 text-muted">Photo</div>

          <div className="relative h-[250px] overflow-hidden rounded-[11px] border border-line2">
            {photo ? (
              <>
                {photo.kind === "upload" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo.url}
                    alt="Item"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-[#356b7a] to-[#5aa0aa]" />
                )}

                {phase === "analyzing" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/55 text-paper backdrop-blur-[2px]">
                    <div className="h-11 w-11 animate-spin rounded-full border-4 border-[#f0d2c1] border-t-rust" />
                    <div className="text-sm font-medium">
                      {ANALYZING_MESSAGES[msgIndex]}
                    </div>
                  </div>
                )}

                {phase === "error" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-ink/55 text-paper backdrop-blur-[2px]">
                    <div className="text-sm font-medium">
                      AI not available — describe it manually
                    </div>
                  </div>
                )}

                {phase === "done" && (
                  <div className="absolute bottom-3.5 left-3.5 flex items-center gap-2.5 rounded-lg bg-ink/80 px-3 py-2.5 text-paper backdrop-blur-sm">
                    <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-rust text-white">
                      <Sparkle size={10} />
                    </span>
                    <span className="text-[12.5px] font-semibold">
                      Analyzed by Reclaim AI
                    </span>
                  </div>
                )}

                {phase === "idle" && photo.kind === "upload" && (
                  <button
                    type="button"
                    onClick={runAiDescribe}
                    className="absolute inset-x-3.5 bottom-3.5 flex items-center justify-center gap-2 rounded-lg bg-rust px-3 py-3 text-sm font-bold text-paper hover:bg-rustdark"
                  >
                    <Sparkle size={16} /> Analyze with Reclaim AI
                  </button>
                )}
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 bg-panel px-6 text-center">
                <div className="text-sm text-ink3">
                  Add a photo so Smart-Describe can fill in the details.
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => fileRef.current?.click()}
                  >
                    Upload photo
                  </Button>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onUpload}
                />
              </div>
            )}
          </div>

          {phase === "done" && (
            <div className="mt-3 rounded-[11px] border border-rustline bg-rusttint p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rust text-white">
                  <Sparkle size={11} />
                </span>
                <span className="font-mono text-[11px] tracking-[0.08em] text-rust">
                  SMART-DESCRIBE FILLED THIS IN
                </span>
              </div>
              <div className="rounded-lg border border-rustline bg-card px-3 py-2.5 text-[13.5px] leading-relaxed text-[#5c3f30]">
                {fields.description}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              <div className="mt-3 text-[11.5px] text-[#a56a4e]">
                Review &amp; edit anything before posting — you&apos;re always in control.
              </div>
            </div>
          )}
        </div>

        {/* Right: fields */}
        <div className="flex flex-col gap-[18px]">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={fields.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Blue Hydro Flask water bottle"
            />
          </div>

          <div>
            <Label
              htmlFor="description"
              hint={
                phase === "done" && (
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] text-rust">
                    <Sparkle size={10} /> AI
                  </span>
                )
              }
            >
              Description
            </Label>
            <textarea
              id="description"
              value={fields.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Describe the item..."
              className="min-h-[66px] w-full resize-y rounded-[9px] border border-line bg-card px-3.5 py-3 text-sm leading-relaxed text-ink placeholder:text-muted focus:border-rust focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={fields.categoryId ?? ""}
                onChange={(e) => {
                  const id = e.target.value ? Number(e.target.value) : null;
                  const cat = categoryOptions.find((c) => c.id === id);
                  set("categoryId", id);
                  set("category", cat?.name ?? "");
                }}
                className={selectClass(!!fields.categoryId)}
              >
                <option value="">Select...</option>
                {categoryOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {isFound && (
              <div>
                <Label htmlFor="heldAt">Currently held at</Label>
                <select
                  id="heldAt"
                  value={fields.heldAt}
                  onChange={(e) => set("heldAt", e.target.value)}
                  className={selectClass(!!fields.heldAt)}
                >
                  <option value="">Select...</option>
                  {locationOptions.map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <Label htmlFor="location">
                {isFound ? "Location seen" : "Last seen"}
              </Label>
              <select
                id="location"
                value={fields.locationId ?? ""}
                onChange={(e) => {
                  const id = e.target.value ? Number(e.target.value) : null;
                  const loc = locationOptions.find((l) => l.id === id);
                  set("locationId", id);
                  set("location", loc?.name ?? "");
                  if (loc?.name) {
                    setCoord(coordsForLocation(loc.name));
                  }
                }}
                className={selectClass(!!fields.locationId)}
              >
                <option value="">Select...</option>
                {locationOptions.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="date">
                {isFound ? "Date found" : "Date lost"}
              </Label>
              <Input
                id="date"
                type="date"
                value={fields.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={fields.color}
                onChange={(e) => set("color", e.target.value)}
                placeholder="e.g. Teal-blue"
              />
            </div>

            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={fields.brand}
                onChange={(e) => set("brand", e.target.value)}
                placeholder="e.g. Hydro Flask"
              />
            </div>
          </div>

          <PinPicker
            mode={mode}
            value={coord}
            onChange={pickCoord}
            place={fields.location || nearestLocation(coord)}
          />

          <div className="mt-1.5 flex flex-wrap gap-3">
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting
                ? "Posting..."
                : isFound
                  ? "Post found item"
                  : "Post lost item"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
