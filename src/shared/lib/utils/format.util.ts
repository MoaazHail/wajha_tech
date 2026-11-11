/** 1200 → "1,200". Western digits on purpose: the design shows prices in the mono/display fonts. */
export const formatNumber = (value: number) => value.toLocaleString("en-US");

/** `tel:` needs the digits only. */
export const phoneHref = (phone: string) => `tel:${phone.replace(/[^0-9+]/g, "")}`;

export const emailHref = (email: string) => `mailto:${email}`;
