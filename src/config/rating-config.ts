/**
 * Rating & Testimonials Display Configuration
 * कृषि सेतु - रेटिंग और प्रशंसापत्र कॉन्फ़िगरेशन
 * 
 * Instructions for easy removal / customization later:
 * 1. To remove the "Dummy Rating" tag: set SHOW_DUMMY_RATING_BADGE = false
 * 2. To remove the prototype disclaimer banner: set SHOW_PROTOTYPE_DISCLAIMER = false
 * 3. To remove the 5-star ratings altogether: set SHOW_STAR_RATINGS = false
 */
export const RATING_CONFIG = {
  /**
   * When true, displays a clear "Sample Demo (डमी रेटिंग)" badge right next to the stars.
   * To remove it later: simply change this to `false`.
   */
  SHOW_DUMMY_RATING_BADGE: true,

  /**
   * When true, displays a subtle prototype demonstration notice in the section header.
   * To remove it later: simply change this to `false`.
   */
  SHOW_PROTOTYPE_DISCLAIMER: true,

  /**
   * When true, displays the 5-star rating icons on testimonials.
   * To hide star ratings completely: change this to `false`.
   */
  SHOW_STAR_RATINGS: true,
};
