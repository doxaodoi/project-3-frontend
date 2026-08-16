"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { PinPicker } from "@/components/map/PinPicker";
import { LocationSearch } from "@/components/map/LocationSearch";
import { CAMPUS_CENTER, nearestLocation, type LngLat } from "@/lib/geo";
import { cn } from "@/lib/cn";
import {
  items as itemsApi,
  categories as catApi,
  type ItemDTO,
  type CategoryDTO,
} from "@/lib/api";

function selectClass(filled: boolean) {
  return cn(
    "w-full cursor-pointer rounded-[9px] border border-line bg-card px-3.5 py-3 text-sm focus:border-rust focus:outline-none",
    filled ? "text-ink" : "text-muted",
  );
}

/**
 * Edit an existing item report. Pre-filled from the item; updates the text
 * fields, category and location (photos and tags are preserved server-side).
 */
export function EditReportForm({ item }: { item: ItemDTO }) {
  const router = useRouter();
  const isFound = item.type === "FOUND";

  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description ?? "");
  const [categoryId, setCategoryId] = useState<number | null>(item.categoryId);
  const [location, setLocation] = useState(item.location ?? "");
  const [heldAt, setHeldAt] = useState(item.heldAt ?? "");
  const [date, setDate] = useState(item.eventDate ?? "");
  const [color, setColor] = useState(item.color ?? "");
  const [brand, setBrand] = useState(item.brand ?? "");
  const [coord, setCoord] = useState<LngLat>({
    lat: item.latitude ?? CAMPUS_CENTER.lat,
    lng: item.longitude ?? CAMPUS_CENTER.lng,
  });

  const [apiCategories, setApiCategories] = useState<CategoryDTO[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    catApi.list().then(setApiCategories).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await itemsApi.update(Number(item.id), {
        title: title.trim(),
        description: description.trim(),
        categoryId,
        locationName: location || null,
        heldAt: isFound ? heldAt || null : null,
        latitude: coord.lat,
        longitude: coord.lng,
        eventDate: date || null,
        color: color || null,
        brand: brand || null,
      });
      router.push(`/items/${item.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Couldn't save changes.");
      setSaving(false);
    }
  }

  const categoryOptions = apiCategories.length > 0 ? apiCategories : [];

  return (
    <form onSubmit={handleSubmit} className="flex max-w-[640px] flex-col gap-[18px]">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
            value={categoryId ?? ""}
            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
            className={selectClass(!!categoryId)}
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
            <Input
              id="heldAt"
              value={heldAt}
              onChange={(e) => setHeldAt(e.target.value)}
              placeholder="e.g. Balme Library Front Desk"
            />
          </div>
        )}

        <div>
          <Label htmlFor="date">{isFound ? "Date found" : "Date lost"}</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="color">Color</Label>
          <Input id="color" value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g. Teal-blue" />
        </div>

        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Hydro Flask" />
        </div>
      </div>

      <LocationSearch
        value={location}
        onSelect={(name, coords) => {
          setLocation(name);
          setCoord(coords);
        }}
        label={isFound ? "Where did you find it?" : "Where did you last see it?"}
        placeholder="Type a place name (e.g. Balme Library, JQB)"
      />

      <PinPicker
        mode={isFound ? "found" : "lost"}
        value={coord}
        onChange={(c) => {
          setCoord(c);
          setLocation(nearestLocation(c));
        }}
        place={location || nearestLocation(coord)}
      />

      {error && (
        <div className="rounded-lg border border-[#e5c1b0] bg-[#fdf0ea] px-4 py-3 text-sm text-rust">
          {error}
        </div>
      )}

      <div className="mt-1.5 flex flex-wrap gap-3">
        <Button type="submit" size="lg" disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push(`/items/${item.id}`)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
