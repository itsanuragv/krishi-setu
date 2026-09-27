import type { Translations } from "../LanguageContext";
import { farmerTranslations } from "./farmer";
import { consumerTranslations } from "./consumer";
import { buyerTranslations } from "./buyer";
import { deliveryTranslations } from "./delivery";

/**
 * Per-portal translation modules, merged into LanguageContext.TRANSLATIONS.
 * (Admin portal is English-only and adds no keys.)
 */
export const PORTAL_TRANSLATIONS: Translations = {
  ...farmerTranslations,
  ...consumerTranslations,
  ...buyerTranslations,
  ...deliveryTranslations,
};
