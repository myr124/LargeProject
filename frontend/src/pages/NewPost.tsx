import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiReq } from "../utils/api";
import Navbar from "../components/ui/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function NewPost() {
  const navigate = useNavigate();

  const authorId = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId ?? null;
    } catch {
      return null;
    }
  }, []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selfRating, setSelfRating] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);

  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);

  const [imageInput, setImageInput] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [stepInput, setStepInput] = useState("");
  const [instructions, setInstructions] = useState<string[]>([]);

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function addItem(
    input: string,
    list: string[],
    setList: (v: string[]) => void,
    setInput: (v: string) => void
  ) {
    const val = input.trim();
    if (val && !list.includes(val)) setList([...list, val]);
    setInput("");
  }

  function removeItem(val: string, list: string[], setList: (v: string[]) => void) {
    setList(list.filter((i) => i !== val));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorId) { setError("You must be logged in to post."); return; }
    if (!title.trim()) { setError("Title is required."); return; }
    if (!description.trim()) { setError("Description is required."); return; }
    if (ingredients.length === 0) { setError("Add at least one ingredient."); return; }
    if (imageUrls.length === 0) { setError("Add at least one image URL."); return; }

    setSubmitting(true);
    setError("");
    try {
      const res = await apiReq("postCreation", {
        author_id: authorId,
        title: title.trim(),
        description: description.trim(),
        ingredients,
        instructions,
        image_urls: imageUrls,
        tags,
        self_rating: selfRating || undefined,
      });
      if (res.error) {
        setError(res.error);
      } else {
        navigate(res.postId ? `/post/${res.postId}` : "/");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.main
        className="max-w-2xl mx-auto px-4 py-10"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h1 className="text-2xl font-bold text-foreground mb-6">New Post</h1>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Sourdough Focaccia"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Tell the story of this dish..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>

              {/* Ingredients */}
              <ChipField
                label="Ingredients"
                placeholder="e.g. 2 cups flour"
                input={ingredientInput}
                setInput={setIngredientInput}
                items={ingredients}
                onAdd={() => addItem(ingredientInput, ingredients, setIngredients, setIngredientInput)}
                onRemove={(v) => removeItem(v, ingredients, setIngredients)}
              />

              {/* Instructions / Steps */}
              <StepField
                input={stepInput}
                setInput={setStepInput}
                steps={instructions}
                onAdd={() => {
                  const val = stepInput.trim();
                  if (val) { setInstructions([...instructions, val]); setStepInput(""); }
                }}
                onRemove={(i) => setInstructions(instructions.filter((_, idx) => idx !== i))}
              />

              {/* Image URLs */}
              <ChipField
                label="Image URLs"
                placeholder="https://..."
                input={imageInput}
                setInput={setImageInput}
                items={imageUrls}
                onAdd={() => addItem(imageInput, imageUrls, setImageUrls, setImageInput)}
                onRemove={(v) => removeItem(v, imageUrls, setImageUrls)}
              />

              {/* Tags */}
              <ChipField
                label="Tags (optional)"
                placeholder="e.g. Italian, vegetarian"
                input={tagInput}
                setInput={setTagInput}
                items={tags}
                onAdd={() => addItem(tagInput, tags, setTags, setTagInput)}
                onRemove={(v) => removeItem(v, tags, setTags)}
              />

              {/* Self rating */}
              <div className="flex flex-col gap-1.5">
                <Label>Your Rating (optional)</Label>
                <div className="flex gap-1" onMouseLeave={() => setRatingHover(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSelfRating(star === selfRating ? 0 : star)}
                      onMouseEnter={() => setRatingHover(star)}
                      className="transition-transform hover:scale-125 focus:outline-none"
                    >
                      <svg
                        className={`w-7 h-7 ${(ratingHover || selfRating) >= star ? "text-yellow-400" : "text-muted"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Posting..." : "Post"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </motion.main>
    </div>
  );
}

// ─── Step field ───────────────────────────────────────────────────────────────

interface StepFieldProps {
  input: string;
  setInput: (v: string) => void;
  steps: string[];
  onAdd: () => void;
  onRemove: (i: number) => void;
}

function StepField({ input, setInput, steps, onAdd, onRemove }: StepFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>Steps / Instructions (optional)</Label>
      <div className="flex gap-2">
        <Input
          placeholder="e.g. Mix flour and water until combined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAdd(); } }}
        />
        <Button type="button" variant="outline" onClick={onAdd}>Add</Button>
      </div>
      {steps.length > 0 && (
        <ol className="flex flex-col gap-2 mt-1">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="flex-1 text-foreground leading-relaxed pt-0.5">{step}</span>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="text-muted-foreground hover:text-foreground transition-colors mt-0.5"
                aria-label="Remove step"
              >
                ×
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// ─── Chip field ───────────────────────────────────────────────────────────────

interface ChipFieldProps {
  label: string;
  placeholder: string;
  input: string;
  setInput: (v: string) => void;
  items: string[];
  onAdd: () => void;
  onRemove: (v: string) => void;
}

function ChipField({ label, placeholder, input, setInput, items, onAdd, onRemove }: ChipFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAdd(); } }}
        />
        <Button type="button" variant="outline" onClick={onAdd}>Add</Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 text-xs bg-muted text-foreground px-2.5 py-1 rounded-full"
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="text-muted-foreground hover:text-foreground transition-colors leading-none"
                aria-label={`Remove ${item}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
