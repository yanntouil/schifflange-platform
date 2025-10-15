import { Hn } from "@/components/hn"
import { cn } from "@/lib/utils"

/**
 * components
 */
export type QuoteProps = {
  title: string
  level: string | number
  content: string
  prose: string
}
export const Quote = ({ title, level, content, prose }: QuoteProps) => {
  return (
    <div className='rounded-lg bg-[#E0E1DC] p-6'>
      <Hn level={level} className='text-[#35374F] text-[24px] font-semibold leading-normal mb-3'>
        {title}
      </Hn>
      <div className={cn(prose, "-my-2")} dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
