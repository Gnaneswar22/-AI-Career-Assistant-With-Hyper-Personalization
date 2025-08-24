import type { NextRequest } from "next/server"

interface VerificationRequest {
  verificationId: string
}

interface VerificationResult {
  valid: boolean
  certificate?: {
    id: string
    title: string
    issuer: string
    issuedDate: string
    recipientName: string
    skills: string[]
    type: string
    blockchainHash: string
    metadata: any
  }
  error?: string
}

// Mock certificate database for verification
const certificateDatabase = new Map([
  [
    "ACA-COUR-USER-ABC123-456789",
    {
      id: "1",
      title: "React Developer Certification",
      issuer: "AI Career Assistant",
      issuedDate: "2024-01-15",
      recipientName: "John Doe",
      skills: ["React", "JavaScript", "Hooks", "Context API"],
      type: "course",
      blockchainHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      metadata: {
        completionDate: "2024-01-15",
        score: 95,
      },
    },
  ],
  [
    "ACA-PROJ-USER-DEF456-789012",
    {
      id: "2",
      title: "Full-Stack Project Completion",
      issuer: "AI Career Assistant",
      issuedDate: "2024-02-20",
      recipientName: "Jane Smith",
      skills: ["React", "Node.js", "MongoDB", "Full-Stack Development"],
      type: "project",
      blockchainHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      metadata: {
        completionDate: "2024-02-20",
        projectUrl: "https://github.com/user/project",
        rating: 4.5,
      },
    },
  ],
])

// Verify certificate in blockchain (mock implementation)
async function verifyInBlockchain(verificationId: string, expectedHash: string): Promise<boolean> {
  try {
    // In a real implementation, this would query the blockchain
    console.log("[v0] Verifying certificate in blockchain:", verificationId)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // For demo purposes, assume all certificates in our database are valid
    return certificateDatabase.has(verificationId)
  } catch (error) {
    console.error("Blockchain verification error:", error)
    return false
  }
}

// Check if certificate is still valid (not expired or revoked)
function isCertificateValid(certificate: any): boolean {
  // Check expiration date for skill certificates
  if (certificate.metadata.validUntil) {
    const expirationDate = new Date(certificate.metadata.validUntil)
    const now = new Date()
    if (now > expirationDate) {
      return false
    }
  }

  // In a real implementation, check revocation list
  // For now, assume all certificates are valid
  return true
}

export async function POST(request: NextRequest) {
  try {
    const body: VerificationRequest = await request.json()

    if (!body.verificationId) {
      return Response.json({ success: false, message: "Verification ID is required" }, { status: 400 })
    }

    console.log("[v0] Verifying certificate:", body.verificationId)

    // Look up certificate in database
    const certificate = certificateDatabase.get(body.verificationId)

    if (!certificate) {
      return Response.json({
        success: true,
        result: {
          valid: false,
          error: "Certificate not found",
        },
      })
    }

    // Verify in blockchain
    const blockchainValid = await verifyInBlockchain(body.verificationId, certificate.blockchainHash)

    if (!blockchainValid) {
      return Response.json({
        success: true,
        result: {
          valid: false,
          error: "Certificate not found in blockchain",
        },
      })
    }

    // Check if certificate is still valid
    const isValid = isCertificateValid(certificate)

    if (!isValid) {
      return Response.json({
        success: true,
        result: {
          valid: false,
          error: "Certificate has expired",
        },
      })
    }

    console.log("[v0] Certificate verification successful:", body.verificationId)

    return Response.json({
      success: true,
      result: {
        valid: true,
        certificate,
      },
    })
  } catch (error) {
    console.error("Certificate verification error:", error)
    return Response.json(
      {
        success: false,
        message: "Failed to verify certificate",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const verificationId = searchParams.get("id")

  if (!verificationId) {
    return Response.json({ success: false, message: "Verification ID is required" }, { status: 400 })
  }

  // Redirect to POST handler for consistency
  return POST(request)
}
