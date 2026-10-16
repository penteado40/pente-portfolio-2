import {
  Envelope,
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  type Icon,
} from '@phosphor-icons/react';
import { links, type LinkId } from '@/content/links';

/**
 * A link from `links` as a persona page shows it, in a Chip: the email by
 * its address, the profiles by name, each after its icon.
 */
export const channels: Record<LinkId, { href: string; label: string; Icon: Icon }> = {
  email: { href: links.email, label: links.email.replace('mailto:', ''), Icon: Envelope },
  instagram: { href: links.instagram, label: 'Instagram', Icon: InstagramLogo },
  linkedin: { href: links.linkedin, label: 'LinkedIn', Icon: LinkedinLogo },
  github: { href: links.github, label: 'GitHub', Icon: GithubLogo },
};
