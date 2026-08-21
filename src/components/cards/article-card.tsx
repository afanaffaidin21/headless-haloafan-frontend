import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types";

export function ArticleCard({
  post,
  className,
}: {
  post: BlogPost;
  className?: string;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex flex-col border border-line bg-panel transition-all hover:border-accent",
        className
      )}
    >
      {post.featuredImage && (
        <div className="h-[180px] overflow-hidden border-b border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.featuredImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className="flex flex-col gap-3 p-6 pb-7">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs text-accent">{post.category}</span>
          <span className="font-mono text-xs text-muted">/</span>
          <span className="font-mono text-xs text-muted">{post.date}</span>
        </div>
        <h3 className="font-display text-[23px] leading-snug text-ink transition-colors group-hover:text-accent">
          {post.title}
        </h3>
        <p className="text-[15px] leading-relaxed text-muted">{post.excerpt}</p>
      </div>
    </Link>
  );
}