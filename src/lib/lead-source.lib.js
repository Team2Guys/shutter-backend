const ADS_EXCLUSIVE_CLICK_IDS = [
  ["gclid", "Google Ads"],
  ["msclkid", "Microsoft Ads"],
  ["ttclid", "TikTok Ads"],
  ["ScCid", "Snapchat Ads"],
  ["li_fat_id", "LinkedIn Ads"],
  ["twclid", "X (Twitter) Ads"],
];

export const resolveLeadSource = (fields) =>
  ADS_EXCLUSIVE_CLICK_IDS.find(([key]) => fields?.[key])?.[1];

export const formatTrackedSource = (fields) => {
  const leadSource = resolveLeadSource(fields) || fields?.lead_source;
  if (!leadSource) return "";
  if (leadSource !== "Google Ads") return leadSource;

  const parts = [leadSource];
  if (fields.utm_campaign) parts.push(`Campaign ${fields.utm_campaign}`);
  if (fields.utm_content) parts.push(`Ad Group ${fields.utm_content}`);
  if (fields.utm_term) parts.push(`"${fields.utm_term}"`);
  return parts.join(" - ");
};
