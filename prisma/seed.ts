import { PrismaClient } from "../app/generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg"
import { faker } from "@faker-js/faker"
import crypto from "crypto"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const categories = [
  { slug: "ai-chat", name: "AI Chat", icon: "💬", description: "Conversational AI assistants and chatbots" },
  { slug: "image-generation", name: "Image Generation", icon: "🎨", description: "AI-powered image creation and editing" },
  { slug: "video", name: "Video", icon: "🎬", description: "AI video generation, editing, and enhancement" },
  { slug: "audio", name: "Audio", icon: "🎵", description: "AI audio, music, and voice tools" },
  { slug: "writing", name: "Writing", icon: "✍️", description: "AI writing assistants and content tools" },
  { slug: "code", name: "Code", icon: "💻", description: "AI coding assistants and developer tools" },
  { slug: "productivity", name: "Productivity", icon: "⚡", description: "AI tools that supercharge your workflow" },
  { slug: "marketing", name: "Marketing", icon: "📣", description: "AI marketing and growth tools" },
  { slug: "design", name: "Design", icon: "🖌️", description: "AI design and creative tools" },
  { slug: "data", name: "Data", icon: "📊", description: "AI data analysis and visualization" },
  { slug: "education", name: "Education", icon: "📚", description: "AI learning and education tools" },
  { slug: "voice", name: "Voice", icon: "🎙️", description: "AI voice synthesis and cloning" },
  { slug: "research", name: "Research", icon: "🔬", description: "AI research and knowledge tools" },
  { slug: "automation", name: "Automation", icon: "🤖", description: "AI workflow and process automation" },
  { slug: "other", name: "Other", icon: "✨", description: "Other AI tools and utilities" },
]

const toolNames = [
  "Promptly", "PixelMind", "VoxAI", "CodeAssist", "WritePilot", "DataLens", "AudioForge",
  "VisionaryAI", "TextCraft", "AutomateIQ", "NeuralPen", "QuickSumm", "LogicFlow", "BrainWave",
  "SmartDraft", "ImageCraft", "SpeakEasy", "DeepSearch", "MindMap AI", "FlowBot", "GenArt",
  "DocuMind", "VoiceClone", "DataSift", "CreativeBot", "StudyAI", "MarketMind", "PitchPerfect",
  "CodeFlow", "ArtificialMuse", "Synthwave AI", "NarratorAI", "ResearchBot", "DesignAI",
  "SummarAI", "TranscribeAI", "InsightBot", "ClipMind", "AICopywriter", "VideoForge",
  "TaskAI", "NotesAI", "ChartBot", "PresentAI", "MeetingAI", "EmailAI", "SalesAI",
  "HRBot", "LegalAI", "FinanceAI", "HealthAI", "TravelAI", "FoodAI", "FitnessAI",
  "RealEstateAI", "ShoppingAI", "GamingAI", "MusicAI", "PodcastAI", "NewsAI", "SocialAI",
  "SecurityAI", "DevOpsAI", "TestingAI", "ReviewAI", "TranslateAI", "SentimentAI",
  "ChatForge", "PersonaAI", "KnowledgeAI", "SearchAI", "ContentAI", "StoryAI", "PoetryAI",
  "ScriptAI", "BrandAI", "SEOAI", "AdAI", "AnalyticsAI", "CustomerAI", "FeedbackAI",
]

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

async function main() {
  console.log("Seeding database...")

  // Create a seed user
  const seedUser = await prisma.user.upsert({
    where: { email: "seed@activeaitools.com" },
    update: {},
    create: {
      email: "seed@activeaitools.com",
      name: "ActiveAI Seed",
    },
  })

  // Create categories
  const createdCategories: Record<string, string> = {}
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    createdCategories[cat.slug] = created.id
  }
  console.log(`Created ${categories.length} categories`)

  const categoryIds = Object.values(createdCategories)
  const tiers = ["FREE", "FREE", "FREE", "FREE", "FREE", "FEATURED", "FEATURED", "SPONSOR"] as const
  const pricingModels = ["FREE", "FREEMIUM", "FREEMIUM", "PAID"] as const
  const statuses = ["APPROVED", "APPROVED", "APPROVED", "APPROVED", "PENDING"] as const

  let toolCount = 0
  for (const name of toolNames.slice(0, 80)) {
    const slug = generateSlug(name)
    const tier = faker.helpers.arrayElement(tiers)
    const pricingModel = faker.helpers.arrayElement(pricingModels)
    const status = faker.helpers.arrayElement(statuses)
    const numCategories = faker.number.int({ min: 1, max: 3 })
    const toolCategories = faker.helpers.arrayElements(categoryIds, numCategories)
    const publishedAt = status === "APPROVED" ? faker.date.between({ from: "2024-01-01", to: new Date() }) : null

    const exists = await prisma.tool.findUnique({ where: { slug } })
    if (exists) continue

    try {
      await prisma.tool.create({
        data: {
          slug,
          name,
          tagline: faker.helpers.arrayElement([
            `AI-powered ${name.replace("AI", "").trim().toLowerCase()} for modern teams`,
            `The smartest way to ${faker.word.verb()} your ${faker.word.noun()}`,
            `${faker.word.adjective()} AI that transforms how you work`,
            `Automate your workflow with the power of AI`,
            `The future of ${faker.word.noun()} is here`,
          ]).slice(0, 140),
          description: [
            faker.lorem.paragraph(2),
            "",
            "## Key Features",
            "",
            `- ${faker.lorem.sentence()}`,
            `- ${faker.lorem.sentence()}`,
            `- ${faker.lorem.sentence()}`,
            `- ${faker.lorem.sentence()}`,
            "",
            faker.lorem.paragraph(),
          ].join("\n"),
          websiteUrl: `https://${slug}.com`,
          logoUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${slug}`,
          screenshotUrl: null,
          pricingModel,
          status,
          tier,
          featured: tier !== "FREE",
          badgeCode: crypto.randomBytes(16).toString("hex"),
          upvotes: faker.number.int({ min: 0, max: 500 }),
          views: faker.number.int({ min: 50, max: 10000 }),
          clicks: faker.number.int({ min: 10, max: 5000 }),
          publishedAt,
          submittedById: seedUser.id,
          categories: {
            create: toolCategories.map((categoryId) => ({ categoryId })),
          },
        },
      })
      toolCount++
    } catch {
      // Skip duplicates
    }
  }

  console.log(`Created ${toolCount} tools`)
  console.log("Seeding complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
