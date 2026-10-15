/** A certification card, the same shape on every persona. */
export type Certification = {
  title: string;
  issuer: string;
  year: string;
  /** The badge, from `public/`; without one the card shows an icon. */
  image?: string;
};
