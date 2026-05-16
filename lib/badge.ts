import crypto from "crypto"

export function generateBadgeCode(): string {
  return crypto.randomBytes(16).toString("hex")
}

export function generateBadgeSvg(toolName: string): string {
  const label = "Listed on"
  const value = "ActiveAI Tools"
  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="54" viewBox="0 0 200 54">
  <rect width="200" height="54" rx="6" fill="#18181b"/>
  <text x="12" y="22" font-family="Inter,system-ui,sans-serif" font-size="10" fill="#a1a1aa">${label}</text>
  <text x="12" y="40" font-family="Inter,system-ui,sans-serif" font-size="13" font-weight="600" fill="#ffffff">${value}</text>
  <rect x="163" y="14" width="26" height="26" rx="4" fill="#7c3aed"/>
  <text x="176" y="31" font-family="Inter,system-ui,sans-serif" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">A</text>
</svg>`
}
