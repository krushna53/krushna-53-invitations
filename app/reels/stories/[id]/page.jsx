import { notFound } from "next/navigation";
import StoryLibrary from "@/components/StoryLibrary";
import { STORY_VIDEOS, storyPath } from "@/lib/story-videos";

// One static page per story (/reels/stories/story-1 … story-6), each with its own link preview.
// A new story added to lib/story-videos.js gets its page on the next build.
export const dynamicParams = false;

export function generateStaticParams() {
  return STORY_VIDEOS.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const story = STORY_VIDEOS.find((s) => s.id === id);
  if (!story) return {};
  const title = `${story.title} · ${story.couple} | EveryMoment Wedding`;
  const description = story.description;
  const images = story.poster ? [{ url: story.poster, width: 480, height: 853, alt: `${story.couple}: ${story.title}` }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: storyPath(story.id) },
    openGraph: { title, description, images, type: "video.other", url: storyPath(story.id), videos: [{ url: story.src, type: "video/mp4", width: 720, height: 1280 }] },
    twitter: { card: "summary_large_image", title, description, images: story.poster ? [story.poster] : undefined },
  };
}

export default async function StoryPage({ params }) {
  const { id } = await params;
  if (!STORY_VIDEOS.some((s) => s.id === id)) notFound();
  return <StoryLibrary initialId={id} />;
}
