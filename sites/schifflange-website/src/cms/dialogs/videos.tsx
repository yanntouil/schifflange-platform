import { Hn } from '@/components/hn'
import { textVariants } from '@/components/variants'
import { prose } from '@compo/ui/src/variants'

export type VideosProps = {
  title: string
  level: string | number
  videos: {
    title: string
    description: string
    video: React.ReactNode
  }[]
}
export const Videos = ({ title, level, videos }: VideosProps) => {
  return (
    <div className='py-6'>
      <Hn level={level} className='text-[#35374F] text-[24px] font-semibold leading-normal mb-3'>
        {title}
      </Hn>
      <div className='grid grid-cols-3 gap-[40px]'>
        {videos.map(video => (
          <VideoCard
            key={video.title}
            title={video.title}
            description={video.description}
            video={video.video}
          />
        ))}
      </div>
    </div>
  )
}

const VideoCard = ({
  title,
  description,
  video,
}: {
  title: string
  description: string
  video: React.ReactNode
}) => {
  return (
    <article className='group'>
      <div className='relative'>{video}</div>
      <div className='mt-4 space-y-2'>
        <Hn level={4} className={textVariants({ variant: 'cardTitleSmall' })}>
          {title}
        </Hn>
        <div
          className={prose({ variant: 'card' })}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </article>
  )
}
