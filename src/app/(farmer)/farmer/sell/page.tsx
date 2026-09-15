"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { createProductSchema, type CreateProductInput } from "@/lib/schemas/product";
import { productApi } from "@/features/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STEPS = ["Details", "Grade & harvest", "Photos", "Review"];

export default function SellPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const form = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      crop: "",
      variety: "",
      quantityKg: 50,
      pricePerKg: 20,
      grade: "A",
      harvestDate: new Date().toISOString().slice(0, 10),
      description: "",
      district: "Nashik",
      photos: [],
    },
  });

  const values = form.watch();

  async function onFiles(files: FileList | null) {
    if (!files) return;
    const compressed: string[] = [];
    for (const file of Array.from(files).slice(0, 4)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 8 * 1024 * 1024) {
        toast.error("Image too large (max 8MB before compress)");
        continue;
      }
      const blob = await imageCompression(file, { maxSizeMB: 0.4, maxWidthOrHeight: 1280 });
      compressed.push(URL.createObjectURL(blob));
    }
    setPhotos((p) => [...p, ...compressed].slice(0, 6));
  }

  async function submit() {
    const parsed = createProductSchema.safeParse({ ...values, photos });
    if (!parsed.success) {
      toast.error("Please complete required fields");
      return;
    }
    try {
      await productApi.create(parsed.data);
      toast.success("Listing published");
      router.push("/farmer/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not publish");
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="font-display text-2xl">Sell my product</h1>
      <ol className="flex gap-2 text-xs">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={`flex-1 rounded-full px-2 py-1 text-center ${i === step ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            {label}
          </li>
        ))}
      </ol>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[step]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 0 && (
            <>
              <div className="space-y-2">
                <Label>Crop</Label>
                <Input {...form.register("crop")} placeholder="Tomato" />
              </div>
              <div className="space-y-2">
                <Label>Variety</Label>
                <Input {...form.register("variety")} placeholder="Abhinav" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Quantity (kg)</Label>
                  <Input type="number" {...form.register("quantityKg")} />
                </div>
                <div className="space-y-2">
                  <Label>Price / kg</Label>
                  <Input type="number" {...form.register("pricePerKg")} />
                </div>
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label>Grade</Label>
                <select className="h-11 w-full rounded-xl border border-input bg-card px-3" {...form.register("grade")}>
                  <option value="A">A — premium</option>
                  <option value="B">B — standard</option>
                  <option value="C">C — processing</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Harvest date</Label>
                <Input type="date" {...form.register("harvestDate")} />
              </div>
              <div className="space-y-2">
                <Label>District</Label>
                <Input {...form.register("district")} />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea {...form.register("description")} />
              </div>
            </>
          )}
          {step === 2 && (
            <div className="space-y-3">
              <Label>Photos (compressed on device)</Label>
              <Input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => onFiles(e.target.files)} />
              <div className="grid grid-cols-3 gap-2">
                {photos.map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={src} src={src} alt="" className="h-24 w-full rounded-lg object-cover" />
                ))}
              </div>
            </div>
          )}
          {step === 3 && (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt>Crop</dt>
                <dd>{values.crop}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Qty / price</dt>
                <dd>
                  {values.quantityKg} kg · ₹{values.pricePerKg}/kg
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Grade</dt>
                <dd>{values.grade}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Harvest</dt>
                <dd>{values.harvestDate}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Photos</dt>
                <dd>{photos.length}</dd>
              </div>
            </dl>
          )}

          <div className="flex gap-2">
            {step > 0 && (
              <Button type="button" variant="outline" className="flex-1" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" className="flex-1" onClick={() => setStep((s) => s + 1)}>
                Next
              </Button>
            ) : (
              <Button type="button" className="flex-1" onClick={submit}>
                Publish listing
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
