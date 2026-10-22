# Bride & groom artwork: prompts

Current couple scenes are drawn directly in code in `lib/scenes-couple.ts`.
For optional future image-based scenes, use a free image tool (Gemini, ChatGPT, Bing Image Creator, Meta AI, Leonardo).
Use a **vertical 9:16** (portrait) size. Save each generated raster picture as a JPG with the exact file name shown,
into `public/art/couples/`. Then add the id (the file name without `.jpg`) to
`COUPLE_ART_READY` in `lib/couple-art.ts`. The design then appears in templates, the card
editor and the reel maker.

Every prompt ends with the same instruction. It keeps the top of the picture empty so the names
and date can sit there:

> …The top 40% of the picture is a calm, softly blurred plain background with nothing in it, left empty for text. No text, no letters, no logos, no watermark.

---

**couple-varmala.jpg** (Wedding)
Vertical 9:16 semi-realistic digital painting for an Indian wedding invitation. A happy Indian bride and groom stand together full-length in the lower 60% of the picture. The bride wears a red and gold embroidered lehenga with a dupatta over her head and gold jewellery. The groom wears an ivory sherwani with a gold safa. They exchange varmala garlands of roses in front of a floral mandap of pink and white roses with soft fairy lights, with petals on the ground. Warm, romantic, luminous painterly illustration with a soft-focus background. The top 40% of the picture is a calm, softly blurred pale cream and blush background with nothing in it, left empty for text. No text, no letters, no logos, no watermark.

**couple-palace.jpg** (Wedding)
Vertical 9:16 semi-realistic digital painting for an Indian wedding invitation. A royal Indian bride in a pastel pink lehenga and a groom in a gold sherwani with a turban walk hand in hand down the marble steps of a Rajasthani palace at golden hour. There are lanterns, rose petals, and fountains behind them. The couple is in the lower 60%. Warm golden light, luminous painterly illustration. The top 40% of the picture is a calm, softly blurred pale apricot sky with nothing in it, left empty for text. No text, no letters, no logos, no watermark.

**couple-south.jpg** (Wedding · South Indian)
Vertical 9:16 semi-realistic digital painting for a South Indian wedding invitation. The bride wears a red and gold Kanjivaram silk saree with temple jewellery and jasmine in her hair. The groom wears a white silk veshti and angavastram. They stand smiling, full-length, in the lower 60%, in front of a temple gopuram, banana trees, brass lamps and a marigold toran. Luminous painterly illustration. The top 40% of the picture is a calm, softly blurred pale gold sky with nothing in it, left empty for text. No text, no letters, no logos, no watermark.

**couple-haldi.jpg** (Haldi)
Vertical 9:16 semi-realistic digital painting for an Indian haldi ceremony invitation. A laughing Indian bride and groom dressed in yellow sit together on a low wooden seat. Turmeric is smeared on their cheeks, with marigold strings hanging around them, brass bowls of haldi, and bright sunshine. The couple is in the lower 60%. Cheerful, luminous painterly illustration. The top 40% of the picture is a calm, softly blurred pale butter-yellow background with nothing in it, left empty for text. No text, no letters, no logos, no watermark.

**couple-mehndi.jpg** (Mehndi)
Vertical 9:16 semi-realistic digital painting for an Indian mehndi ceremony invitation. A bride in a green and pink lehenga sits on a flower-covered swing showing her henna-painted hands. The groom in a light kurta stands beside her smiling. Colourful parasols, cushions and a peacock are in the garden. The couple is in the lower 60%. Vibrant, luminous painterly illustration. The top 40% of the picture is a calm, softly blurred pale mint background with nothing in it, left empty for text. No text, no letters, no logos, no watermark.

**couple-sangeet.jpg** (Sangeet)
Vertical 9:16 semi-realistic digital painting for an Indian sangeet night invitation. An Indian couple dances on a glowing stage; the bride twirls in a sequinned purple lehenga and the groom wears a black bandhgala. They are surrounded by strings of fairy lights, a dhol and confetti. The couple is in the lower 60%. Festive, luminous painterly illustration. The top 40% of the picture is a calm, softly blurred deep indigo night sky with nothing in it, left empty for text. No text, no letters, no logos, no watermark.

**couple-engagement.jpg** (Engagement)
Vertical 9:16 semi-realistic digital painting for an Indian engagement invitation. An Indian couple in elegant pastel outfits exchange rings in a rose garden at sunset: she wears a blush lehenga and he wears a beige bandhgala. Candles in glass lanterns and a white floral arch are around them. The couple is in the lower 60%. Romantic, luminous painterly illustration. The top 40% of the picture is a calm, softly blurred blush-pink sky with nothing in it, left empty for text. No text, no letters, no logos, no watermark.

**couple-reception.jpg** (Reception)
Vertical 9:16 semi-realistic digital painting for an Indian wedding reception invitation. A glamorous Indian bride in a sparkling midnight-blue gown and a groom in a black tuxedo pose together in a grand ballroom under a crystal chandelier, with soft bokeh lights. The couple is in the lower 60%. Elegant, luminous painterly illustration. The top 40% of the picture is a calm, softly blurred deep navy background with nothing in it, left empty for text. No text, no letters, no logos, no watermark.

**couple-nikah.jpg** (Nikah)
Vertical 9:16 semi-realistic digital painting for a Nikah invitation. A Muslim bride in an ivory and gold gharara with a dupatta and a groom in an ivory sherwani stand under Mughal arches lit by hanging brass lanterns, with roses and a crescent moon. The couple is in the lower 60%. Serene, luminous painterly illustration. The top 40% of the picture is a calm, softly blurred deep emerald night sky with nothing in it, left empty for text. No text, no letters, no logos, no watermark.

**couple-beach.jpg** (Reception · destination)
Vertical 9:16 semi-realistic digital painting for a destination wedding invitation. An Indian couple walks barefoot along a beach at sunset beside a floral arch: she wears a flowing peach lehenga and he wears a white kurta. Palm trees and gentle waves are behind them. The couple is in the lower 60%. Dreamy, luminous painterly illustration. The top 40% of the picture is a calm, softly blurred peach sunset sky with nothing in it, left empty for text. No text, no letters, no logos, no watermark.
