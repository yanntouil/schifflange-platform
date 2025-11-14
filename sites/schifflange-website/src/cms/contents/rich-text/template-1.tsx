import { Container } from "@/components/layout/container"
import { Wrapper } from "@/components/layout/wrapper"
import { Hn } from "@/components/ui/hn/components"
import { rebaseHeadings } from "@/utils/html"
import { S, stripHtml } from "@compo/utils"
import type { TemplateProps } from "./index"

/**
 * Template 1
 * Simple layout - heading above, content below
 */
export function Template1({ props }: TemplateProps) {
  const { title, level, subtitle, description, displayHeading, content } = props
  const hasDescription = S.isNotEmpty(S.trim(stripHtml(description)))
  const hasContent = S.isNotEmpty(S.trim(stripHtml(content)))

  // rebase content to h2, components likley to follow component header h1
  const rebasedContent = rebaseHeadings(content, 2)

  return (
    <Wrapper paddingY>
      <Container padding='default'>
        {displayHeading && (
          <div className='grid grid-cols-1 gap-8 pb-[24px]'>
            <div className='flex flex-col justify-center'>
              {title && (
                <Hn level={level} className=''>
                  {title}
                </Hn>
              )}
              {subtitle && <p className=''>{subtitle}</p>}
              {hasDescription && <div className='' dangerouslySetInnerHTML={{ __html: description }} />}
            </div>
          </div>
        )}

        {hasContent && <div className='' dangerouslySetInnerHTML={{ __html: rebasedContent }} />}
      </Container>
    </Wrapper>
  )
}
