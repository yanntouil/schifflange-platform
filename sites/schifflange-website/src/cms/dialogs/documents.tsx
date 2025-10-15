import { Hn } from "@/components/hn"
import { cn } from "@/lib/utils"
import { service } from "@/service"
import { match } from "@compo/utils"
import { Api } from "@services/site"
import saveAs from "file-saver"

export type DocumentsProps = {
  title: string
  level: string | number
  files: Api.MediaFile[]
  variant?: "consultation" | "incubation" | "scaling"
}
export const Documents = ({ title, level, files, variant = "consultation" }: DocumentsProps) => {
  return (
    <div
      className={cn(
        "rounded-lg bg-[#E0E1DC] p-6",
        match(variant)
          .with("consultation", () => "bg-finch-20")
          .with("incubation", () => "bg-moss-20")
          .with("scaling", () => "bg-glacier-20")
          .exhaustive()
      )}
    >
      <Hn level={level} className='text-[#35374F] text-[24px] font-semibold leading-normal mb-3'>
        {title}
      </Hn>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            <button
              onClick={() => saveAs(service.makePath(file.url, true), makeFullName(file))}
              className='inline-flex gap-2 text-[14px] font-normal leading-normal text-[#35374F]'
            >
              <DownloadIcon className='size-[18px]' />
              {file.translations?.name || "Document"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
const makeFullName = (file: Api.MediaFile) => {
  const name = file.translations?.name || "document"
  return name + (file.extension ? "." + file.extension : "")
}
const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <g clipPath='url(#clip0_2514_2639)'>
      <path
        d='M7.5 9.74997C7.82209 10.1806 8.23302 10.5369 8.70491 10.7947C9.17681 11.0525 9.69863 11.2058 10.235 11.2442C10.7713 11.2826 11.3097 11.2052 11.8135 11.0173C12.3173 10.8294 12.7748 10.5353 13.155 10.155L15.405 7.90497C16.0881 7.19772 16.4661 6.25046 16.4575 5.26722C16.449 4.28398 16.0546 3.34343 15.3593 2.64815C14.664 1.95287 13.7235 1.55849 12.7403 1.54995C11.757 1.5414 10.8098 1.91938 10.1025 2.60247L8.8125 3.88497'
        stroke='#35374F'
        strokeWidth='1.25'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M10.5001 8.25005C10.1781 7.81945 9.76713 7.46316 9.29524 7.20534C8.82334 6.94752 8.30152 6.79421 7.76516 6.7558C7.2288 6.71738 6.69046 6.79477 6.18664 6.98271C5.68282 7.17065 5.22531 7.46474 4.84515 7.84505L2.59515 10.095C1.91206 10.8023 1.53408 11.7496 1.54262 12.7328C1.55117 13.716 1.94555 14.6566 2.64083 15.3519C3.33611 16.0471 4.27666 16.4415 5.2599 16.4501C6.24313 16.4586 7.19039 16.0806 7.89765 15.3975L9.18015 14.115'
        stroke='#35374F'
        strokeWidth='1.25'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </g>
    <defs>
      <clipPath id='clip0_2514_2639'>
        <rect width='18' height='18' fill='white' />
      </clipPath>
    </defs>
  </svg>
)
