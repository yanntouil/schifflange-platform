import { Hn } from "@/components/hn"
import { cn } from "@/lib/utils"

export type RichtextProps = {
  title: string
  level: string | number
  content: string
  prose: string
}
export const Richtext = ({ title, level, content, prose }: RichtextProps) => {
  return (
    <div className='py-6'>
      <Hn level={level} className='text-[#35374F] text-[24px] font-semibold leading-normal mb-3'>
        {title}
      </Hn>
      <div className={cn(prose, "-my-2")} dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
