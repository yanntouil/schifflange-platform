import { cn, cva } from "@compo/utils"

export const proseVariants = cva(
  cn(
    "prose",
    // Headings
    "visual-h:font-semibold visual-h:leading-[1.5] visual-h:text-inherit",
    // Paragraphs
    "prose-p:my-2 prose-p:text-inherit prose-p:text-base/[1.8]",
    // Lists
    "prose-ul:list-image-[var(--lumiq-li-bullet)]"
  ),
  {
    variants: {
      visual: {
        true: [
          "visual-h1:text-3xl visual-h1:mt-6 visual-h1:mb-4",
          "visual-h2:text-2xl visual-h2:mt-6 visual-h2:mb-4",
          "visual-h3:text-xl visual-h3:mt-6 visual-h3:mb-4",
          "visual-h4:text-lg visual-h4:mt-5 visual-h4:mb-2",
          "visual-h5:text-base visual-h5:mt-5 visual-h5:mb-2",
          "visual-h6:text-base visual-h6:mt-4 visual-h6:mb-2",
        ],
        false: [
          "prose-h1:text-3xl prose-h1:mt-6 prose-h1:mb-4",
          "prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-4",
          "prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-4",
          "prose-h4:text-lg prose-h4:mt-5 prose-h4:mb-2",
          "prose-h5:text-base prose-h5:mt-5 prose-h5:mb-2",
          "prose-h6:text-base prose-h6:mt-4 prose-h6:mb-2",
        ],
      },
      theme: {
        default: "",
      },
    },
    defaultVariants: {
      visual: true,
      theme: "default",
    },
  }
)
