import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface OAuthSectionProps {
  dividerText: string;
}

interface OAuthButtonProps {
  icon: string;
  label: string;
}

function OAuthButton({ icon, label }: OAuthButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full gap-3 border-stone-200 bg-white hover:bg-stone-50 text-stone-700"
    >
      <span className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-600">
        {icon}
      </span>
      {label}
    </Button>
  );
}

export default function OAuthSection({ dividerText }: OAuthSectionProps) {
  return (
    <>
      <div className="flex items-center gap-3 my-6">
        <Separator className="flex-1 bg-stone-200" />
        <span className="text-xs text-stone-400">{dividerText}</span>
        <Separator className="flex-1 bg-stone-200" />
      </div>
      <div className="flex flex-col gap-3">
        <OAuthButton icon="G" label="Continue with Google" />
        <OAuthButton icon="f" label="Continue with Facebook" />
      </div>
    </>
  );
}
