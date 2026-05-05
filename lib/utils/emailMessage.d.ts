/**
 * emailMessage — CribHub branded HTML email wrapper.
 *
 * @param message  Pre-escaped HTML for the message body (inner content).
 * @param ctaUrl   Optional call-to-action URL — renders a primary button.
 * @param ctaLabel Optional label for the CTA button (defaults to "Open in CribHub").
 */
declare const emailMessage: (message: string, ctaUrl?: string, ctaLabel?: string) => Promise<string>;
export default emailMessage;
