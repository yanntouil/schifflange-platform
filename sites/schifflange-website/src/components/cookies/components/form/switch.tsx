import { FormItem, FormLabel, useFieldContext } from "@compo/form"
import { Primitives } from "@compo/primitives"
import { cn } from "@compo/utils"
import { switchThumbVariants, switchVariants } from "../ui/switch/variants"
import { badgeVariants } from "../variants"

/**
 * FormSwitch
 */
type Props = SelectInputProps & {
  label?: string
  name?: string
  info?: string | false
  className?: string
  badge?: React.ReactNode
}
export const FormSwitch = ({ label, name, badge, disabled, ...props }: Props) => {
  return (
    <FormItem name={name} className={"flex flex-wrap items-center gap-2"}>
      <FormLabel className='mt-1 grow text-sm font-semibold tracking-wide'>{label}</FormLabel>
      <div className='flex grow items-center justify-end gap-2'>
        {disabled && <span className={badgeVariants()}>{badge}</span>}
        <SwitchInput {...props} disabled={disabled} />
      </div>
    </FormItem>
  )
}

type SelectInputProps = {
  placeholder?: string

  disabled?: boolean
}
const SwitchInput = ({ disabled }: SelectInputProps) => {
  const { id, name, value, setFieldValue, disabled: ctxDisabled } = useFieldContext<boolean>()
  return (
    <Primitives.Switch.Root
      className={cn(switchVariants({ variant: "default", size: "sm" }))}
      id={id}
      name={name}
      checked={value}
      onCheckedChange={setFieldValue}
      disabled={disabled || ctxDisabled}
    >
      <Primitives.Switch.Thumb className={cn(switchThumbVariants({ variant: "default", size: "sm" }))} />
    </Primitives.Switch.Root>
  )
}
