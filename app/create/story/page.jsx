import ReelMaker from "@/components/ReelMaker";

export const metadata = {
  title: "Create Your Love Story Video | EveryMoment Wedding",
  description: "Turn how you met and your favourite moments together into a 9:16 love story video reel for WhatsApp and Instagram.",
  openGraph: {
    title: "Create Your Love Story Video | EveryMoment Wedding",
    description: "Turn how you met and your favourite moments together into an animated story reel.",
    images: [{ url: "/videos/stories/story-3.jpg", width: 480, height: 853, alt: "Animated love story reel" }],
    type: "website",
    url: "/create/story",
  },
  twitter: { card: "summary_large_image", images: ["/videos/stories/story-3.jpg"] },
};

export default function CreateStoryPage() {
  return <ReelMaker initialSource="story" />;
}
