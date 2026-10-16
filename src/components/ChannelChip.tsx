'use client';

import {
  Envelope,
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  type Icon,
} from '@phosphor-icons/react';
import { links, type LinkId } from '@/content/links';
import { Chip, type ChipProps } from './Chip';

// The email by its address, the profiles by name.
const channels: Record<LinkId, { label: string; Icon: Icon }> = {
  email: { label: links.email.replace('mailto:', ''), Icon: Envelope },
  instagram: { label: 'Instagram', Icon: InstagramLogo },
  linkedin: { label: 'LinkedIn', Icon: LinkedinLogo },
  github: { label: 'GitHub', Icon: GithubLogo },
};

type ChannelChipProps = { id: LinkId } & Pick<ChipProps, 'tone' | 'tall' | 'stretch'>;

// A link from `links` as a persona page shows it: a link Chip with the
// channel's icon before its name.
export function ChannelChip({ id, ...chip }: ChannelChipProps) {
  const { label, Icon } = channels[id];
  return (
    <Chip href={links[id]} Icon={Icon} iconAt="start" {...chip}>
      {label}
    </Chip>
  );
}
