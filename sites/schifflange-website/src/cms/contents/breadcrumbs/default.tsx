import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/breadcrumb"
import { Container } from "@/components/container"
import { Link } from "@/components/link"
import { Wrapper } from "@/components/wrapper"
import React from "react"
import type { TemplateProps } from "./index"

/**
 * Template Default
 * Simple layout - breadcrumbs above, content below
 */
export function TemplateDefault({ props }: TemplateProps) {
  const { breadcrumbs } = props

  return (
    <Wrapper className='pt-12 -mb-6 relative z-[1]'>
      <Container>
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={index}>
                {!!breadcrumb.link?.href && (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild current={index === breadcrumbs.length - 1}>
                        {breadcrumb.link.isLink ? (
                          <Link href={breadcrumb.link.href}>{breadcrumb.link.text}</Link>
                        ) : (
                          <a href={breadcrumb.link.href} target='_blank' rel='noopener noreferrer nofollow'>
                            {breadcrumb.link.text}
                          </a>
                        )}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </>
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </Container>
    </Wrapper>
  )
}
