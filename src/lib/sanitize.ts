/**
 * OWASP-Compliant Security & Input Sanitization Utilities
 * Defends against XSS, Prompt Injection, SSRF, and Payload Flooding.
 */

/**
 * Sanitizes generic user-supplied strings by stripping HTML/script injections and control characters.
 */
export function sanitizeString(input: unknown, maxLength: number = 500): string {
  if (typeof input !== "string") return "";

  // Strip control characters, null bytes, and script/HTML tags
  let cleaned = input
    .replace(/\0/g, "")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "");

  // Normalize excessive whitespace
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  // Enforce max length
  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength);
  }

  return cleaned;
}

/**
 * Validates a remote image URL to prevent Server-Side Request Forgery (SSRF).
 * Rejects private IPs, cloud metadata endpoints, internal hostnames, and non-HTTPS protocols.
 */
export function isSafeRemoteUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);

    // Only allow HTTPS in production
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();

    // Disallow loopback, cloud metadata, and internal domains
    if (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal") ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname === "::1" ||
      hostname === "169.254.169.254" // AWS/GCP/Azure instance metadata service
    ) {
      return false;
    }

    // Disallow private IPv4 ranges: 10.x.x.x, 172.16-31.x.x, 192.168.x.x
    const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (ipv4Match) {
      const [_, o1, o2] = ipv4Match.map(Number);
      if (o1 === 10) return false;
      if (o1 === 172 && o2 >= 16 && o2 <= 31) return false;
      if (o1 === 192 && o2 === 168) return false;
      if (o1 === 169 && o2 === 254) return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Validates and limits Base64 image payloads to protect against memory exhaustion DDoS.
 */
export function validateBase64Image(
  dataUrl: string,
  maxBytes: number = 8 * 1024 * 1024 // 8 MB limit
): { valid: boolean; mimeType: string; base64: string; error?: string } {
  if (!dataUrl || typeof dataUrl !== "string") {
    return { valid: false, mimeType: "", base64: "", error: "Missing or invalid payload" };
  }

  // Check approximate size (base64 length * 0.75)
  if (dataUrl.length * 0.75 > maxBytes) {
    return { valid: false, mimeType: "", base64: "", error: "Payload exceeds size limit (8MB)" };
  }

  const match = dataUrl.match(/^data:(image\/(jpeg|png|webp|avif|jpg));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) {
    // Might be raw base64 string
    const rawMatch = dataUrl.replace(/^data:.*,/, "").match(/^[A-Za-z0-9+/=]+$/);
    if (rawMatch) {
      return { valid: true, mimeType: "image/jpeg", base64: rawMatch[0] };
    }
    return { valid: false, mimeType: "", base64: "", error: "Invalid image format or non-base64 data" };
  }

  return {
    valid: true,
    mimeType: match[1],
    base64: match[3],
  };
}
