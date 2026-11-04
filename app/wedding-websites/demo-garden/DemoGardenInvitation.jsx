"use client";
import { useCallback, useMemo, useState } from "react";
import { InviteShell, CreateButton, MusicToggle, useInviteMusic, DemoBar } from "@/components/invite-sections";
import EnvelopeIntro from "@/components/invite-sections/EnvelopeIntro";
import GardenInvitation from "@/components/invite-sections/GardenInvitation";
import { useLang } from "@/components/invite-sections/i18n";
import { demoInvitationFor } from "@/lib/demo-invitation-i18n";

// maroon for the floating buttons, to match the wax seals
const THEME = { "--inv-accent": "#6b1d24", "--inv-accent-bright": "#8b2a33", "--inv-deep": "#6b1d24" };

/** Envelope demo: wax-seal envelope to open, then the invitation on watercolour paper with gold script. */
export default function DemoGardenInvitation() {
  const [opened, setOpened] = useState(false);
  const createBuffer = useCallback(() => import("@/lib/music").then((m) => m.generateMusic("calm", 32)), []);
  const music = useInviteMusic({ createBuffer });

  return <InviteShell theme={THEME} locked={!opened} languages>
    <GardenContent opened={opened} onOpened={() => setOpened(true)} music={music} />
  </InviteShell>;
}

/** Inside InviteShell so it can read the picked language and swap the whole sample. */
function GardenContent({ opened, onOpened, music }) {
  const { lang } = useLang();
  const d = useMemo(() => demoInvitationFor(lang), [lang]);
  return <>
    <EnvelopeIntro monogram={`${d.groom[0]} & ${d.bride[0]}`} onOpen={() => music.play()} onDone={onOpened} />
    {opened && <DemoBar />}
    <GardenInvitation d={d} active={opened} classicLink />
    <CreateButton />
    {opened && <MusicToggle playing={music.playing} onToggle={music.toggle} />}
  </>;
}
