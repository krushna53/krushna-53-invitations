"use client";
import { useState } from "react";
import { InviteShell, CreateButton } from "@/components/invite-sections";
import { SacredGardenInvitation, SgEnvelope, gardenTheme } from "@/components/invite-sections/garden";
import { sacredGarden } from "@/lib/sacred-garden";

/** The Sacred Garden: an envelope film opens onto the invitation. */
export default function DemoGardenInvitation() {
  const [opened, setOpened] = useState(false);
  const c = sacredGarden;
  return <InviteShell locked={!opened}>
    <SgEnvelope video={c.envelope.video} music={c.music} tapLabel={c.envelope.tapLabel} monogram={c.monogram} sealTrack={c.envelope.sealTrack} theme={gardenTheme(c)} onDone={() => setOpened(true)} />
    <SacredGardenInvitation c={c} />
    {opened && <CreateButton />}
  </InviteShell>;
}
