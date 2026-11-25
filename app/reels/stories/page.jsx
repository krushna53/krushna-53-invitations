import StoryLibrary from "@/components/StoryLibrary";

export const metadata = {
  title: "Love Story Video Reels | EveryMoment Wedding",
  description: "Watch animated love story reels made with EveryMoment, from the first meeting to the wedding day, then create your own in minutes.",
  openGraph: {
    title: "Love Story Video Reels | EveryMoment Wedding",
    description: "Animated love story reels, from the first meeting to the wedding day. Make yours in minutes.",
    images: [{ url: "/videos/stories/story-1.jpg", width: 480, height: 853, alt: "Animated love story reel" }],
    type: "website",
    url: "/reels/stories",
  },
  twitter: { card: "summary_large_image", images: ["/videos/stories/story-1.jpg"] },
};

export default function StoriesPage() {
  return <StoryLibrary />;
}
