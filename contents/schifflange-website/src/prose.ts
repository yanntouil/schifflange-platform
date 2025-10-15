import { cn, cva } from '@compo/utils'

// export const proseVariants = cva(['prose'], {
//   variants: {
//     variant: {
//       default: cn(
//         // temp
//         'prose max-w-none',
//         // Titres
//         'prose-headings:font-semibold prose-headings:tracking-normal prose-headings:py-2',
//         'prose-h1:text-[34px] prose-h1:leading-[40px] prose-h1:font-semibold prose-h1:my-0 prose-h1:py-2',
//         'prose-h2:text-[24px] prose-h2:leading-[30px] prose-h2:font-semibold prose-h2:my-0 prose-h2:py-2',
//         'prose-h3:text-[20px] prose-h3:leading-[26px] prose-h3:font-semibold prose-h3:my-0 prose-h3:py-2',
//         'prose-h4:text-[18px] prose-h4:leading-normal prose-h4:font-semibold prose-h4:my-0 prose-h4:py-2',
//         'prose-h5:text-[18px] prose-h5:leading-normal prose-h5:font-semibold prose-h5:my-0 prose-h5:py-2',
//         'prose-h6:text-[16px] prose-h6:leading-normal prose-h6:font-semibold prose-h6:my-0 prose-h6:py-2',
//         // Paragraphes
//         'prose-p:text-[#35374F] prose-p:my-0 prose-p:py-2 prose-p:text-[14px] prose-p:leading-[20px]',
//         // Listes
//         'prose-ul:my-0 prose-ol:my-0 prose-ul:py-2 prose-ol:py-2 prose-ul:list-image-[var(--lumiq-li-bullet)] prose-ul:!pl-[1.2em] prose-ol:!pl-[1.2em]',
//         // Blockquotes
//         '',
//         // inline
//         'prose-strong:font-semibold prose-a:text-[#35374F] prose-a:underline-offset-4 hover:prose-a:underline'
//       ),
//       card: cn(
//         // temp
//         'prose max-w-none',
//         // Titres
//         'prose-headings:font-semibold prose-headings:tracking-normal prose-headings:py-2',
//         'prose-h1:text-[34px] prose-h1:leading-[40px] prose-h1:font-semibold prose-h1:my-0 prose-h1:py-2',
//         'prose-h2:text-[24px] prose-h2:leading-[30px] prose-h2:font-semibold prose-h2:my-0 prose-h2:py-2',
//         'prose-h3:text-[20px] prose-h3:leading-[26px] prose-h3:font-semibold prose-h3:my-0 prose-h3:py-2',
//         'prose-h4:text-[18px] prose-h4:leading-normal prose-h4:font-semibold prose-h4:my-0 prose-h4:py-2',
//         'prose-h5:text-[18px] prose-h5:leading-normal prose-h5:font-semibold prose-h5:my-0 prose-h5:py-2',
//         'prose-h6:text-[16px] prose-h6:leading-normal prose-h6:font-semibold prose-h6:my-0 prose-h6:py-2',
//         // Paragraphes
//         'prose-p:text-[#35374F] prose-p:my-0 prose-p:py-2 prose-p:text-[12px] prose-p:leading-[18px]',
//         // Listes
//         'prose-ul:my-0 prose-ol:my-0 prose-ul:py-2 prose-ol:py-2 prose-ul:list-image-[var(--lumiq-li-bullet)] prose-ul:!pl-[1.2em] prose-ol:!pl-[1.2em]',
//         // Blockquotes
//         '',
//         // inline
//         'prose-strong:font-semibold prose-a:text-[#35374F] prose-a:underline-offset-4 hover:prose-a:underline'
//       ),
//       heading: cn(
//         // temp
//         'prose max-w-none',
//         // Titres
//         'prose-headings:font-semibold prose-headings:tracking-normal prose-headings:py-2',
//         'prose-h1:text-[34px] prose-h1:leading-[40px] prose-h1:font-semibold prose-h1:my-0 prose-h1:py-2',
//         'prose-h2:text-[24px] prose-h2:leading-[30px] prose-h2:font-semibold prose-h2:my-0 prose-h2:py-2',
//         'prose-h3:text-[20px] prose-h3:leading-[26px] prose-h3:font-semibold prose-h3:my-0 prose-h3:py-2',
//         'prose-h4:text-[18px] prose-h4:leading-normal prose-h4:font-semibold prose-h4:my-0 prose-h4:py-2',
//         'prose-h5:text-[18px] prose-h5:leading-normal prose-h5:font-semibold prose-h5:my-0 prose-h5:py-2',
//         'prose-h6:text-[16px] prose-h6:leading-normal prose-h6:font-semibold prose-h6:my-0 prose-h6:py-2',
//         // Paragraphes
//         'prose-p:text-[#35374F] prose-p:my-0 prose-p:py-2 prose-p:text-[14px] prose-p:leading-[20px]',
//         // Listes
//         'prose-ul:my-0 prose-ol:my-0 prose-ul:py-2 prose-ol:py-2 prose-ul:list-image-[var(--lumiq-li-bullet)] prose-ul:!pl-[1.2em] prose-ol:!pl-[1.2em]',
//         // Blockquotes
//         '',
//         // inline
//         'prose-strong:font-semibold prose-a:text-[#35374F] prose-a:underline-offset-4 hover:prose-a:underline'
//       ),
//     },
//   },
//   defaultVariants: {
//     variant: 'default',
//   },
// })
