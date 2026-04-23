export interface ISocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
}

export interface ISetting {
  // Site Information
  siteName: string;
  tagline: string;
  siteURL: string;
  logo?: string;
  favicon?: string;

  // Contact Information
  email: string;
  phone: string;
  whatsapp?: string;
  address: string;

  // Currency Settings
  currency: string;
  currencySymbol: string;
  symbolPosition: 'before' | 'after';

  // Social Links (আপনার রিকোয়ারমেন্ট অনুযায়ী)
  socialLinks: ISocialLinks;
}