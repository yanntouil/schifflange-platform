import euMemberCountries from '@/components/forms/eu-member-countries.json'
import { inputVariants } from '@/components/forms/variants-input'
import { CheckIcon } from '@phosphor-icons/react/ssr'
import { cx } from 'class-variance-authority'
import { Select } from 'radix-ui'
import React from 'react'
import { CircleFlag } from 'react-circle-flags'
import { Form } from 'use-a11y-form'
import parsePhoneNumber from 'libphonenumber-js'
import { useTranslation } from '@/lib/localize'

/**
 * FieldInputPhone
 */

export type FieldInputPhoneProps = React.ComponentProps<typeof Form.Input>

export const FieldInputPhone = React.forwardRef<HTMLInputElement, FieldInputPhoneProps>(
  (props, ref) => {
    const { locale } = useTranslation()
    const translatedCountries = React.useMemo(() => {
      return euMemberCountries
        .map(country => {
          const translation =
            country.translations?.[locale.code as keyof typeof country.translations] ?? country.name

          return {
            code: country.code,
            phone: country.phone,
            name: translation,
          }
        })
        .toSorted((a, b) => a.name.localeCompare(b.name))
    }, [])

    return (
      <Form.FieldContext<string>>
        {field => {
          return (
            <InputPhone
              {...props}
              countries={translatedCountries}
              value={field.value}
              onValueChange={field.setFieldValue}
              id={field.id}
              ref={ref}
            />
          )
        }}
      </Form.FieldContext>
    )
  }
)

/**
 * InputPhone
 */

export type InputPhoneProps = React.ComponentProps<'div'> & {
  value?: string
  onValueChange?: (value: string) => void
  countries?: { code: string; phone: string; name: string }[]
  format?: (props: { country: string; number: string }) => string
}

export const InputPhone = React.forwardRef<HTMLInputElement, InputPhoneProps>((props, ref) => {
  const {
    format = defaultFormat,
    countries = euMemberCountries,
    value = '',
    onValueChange = () => {},
    ...containerProps
  } = props

  const [state, setState] = React.useState(() => {
    const parsed = parseNumber(value)
    const parsedCountry = countries.find(country => country.phone === parsed.code)

    return {
      country: parsedCountry ? parsedCountry.code : 'LU',
      national: parsed.number ? parsed.number : '',
    }
  })

  const setControlledState = (reduce: (current: typeof state) => typeof state) => {
    setState(reduce)
  }

  const currentCountry = React.useMemo(() => {
    return countries.find(country => country.code === state.country)
  }, [state.country])

  const formattedValue = React.useMemo(() => {
    return currentCountry
      ? format({ country: currentCountry.phone, number: state.national })
      : state.national
  }, [state, currentCountry])

  React.useEffect(() => {
    onValueChange?.(formattedValue)
  }, [formattedValue])

  const handleChange = (value: string) => {
    const parsed = parseNumber(value)

    if (parsed.code && parsed.number) {
      const country = countries.find(country => country.phone === parsed.code)
      const number = stripPrefix(value)

      if (country) {
        setControlledState(current => {
          // check if country has same prefix as current country
          const currentCountry = countries.find(country => country.code === current.country)
          const correctCountry = currentCountry && currentCountry.phone === country.phone

          return {
            country: correctCountry ? current.country : country.code,
            national: number,
          }
        })

        return
      }
    }

    setControlledState(current => ({
      ...current,
      national: value,
    }))
  }

  const handleCountryCodeChange = (code: string) => {
    const country = countries.find(country => country.code === code)
    if (!country) return

    setControlledState(current => ({
      ...current,
      country: country.code,
    }))
  }

  return (
    <div
      {...containerProps}
      className={cx(
        'flex items-center gap-x-0.5 bg-pampas rounded-full isolate',
        containerProps.className
      )}
    >
      <Select.Root value={currentCountry?.code} onValueChange={handleCountryCodeChange}>
        <Select.Trigger className='flex z-20 items-center gap-x-2 whitespace-nowrap px-3 h-11 rounded-full [&_.select-item-label]:hidden [&_.select-item-label-secondary]:flex'>
          <Select.Value className='shrink-0' />
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className='rounded-3xl bg-white shadow-lg overflow-hidden w-[200px] z-50'>
            <Select.Viewport className='flex flex-col items-stretch'>
              <Select.Group>
                <Select.Label className='text-xs font-semibold pt-3 pb-2.5 px-3.5 bg-neutral-100/90 sticky top-0'>
                  EU
                </Select.Label>

                <div className='p-2.5'>
                  {countries.map(country => {
                    return (
                      <SelectItem key={country.code} value={country.code}>
                        <span className='truncate min-w-0 select-item flex items-center gap-x-2.5 icon:size-5 shrink-0'>
                          <span data-icon aria-hidden='true' className='flex shrink-0'>
                            <CircleFlag countryCode={country.code.toLowerCase()} data-icon />
                          </span>

                          <span className='select-item-label min-w-0 truncate'>{country.name}</span>

                          <span className='select-item-label-secondary hidden'>
                            <span className='sr-only'>{country.name}</span>+{country.phone}
                          </span>
                        </span>
                      </SelectItem>
                    )
                  })}
                </div>
              </Select.Group>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      <Form.Input
        placeholder='123 456 789'
        autoComplete='tel-national'
        controlled
        value={state.national}
        onChange={e => handleChange(e.target.value)}
        ref={ref}
        type='text'
        className={cx(inputVariants({ variant: 'ghost' }), '-ml-2 !pl-3.5 z-10')}
      />
    </div>
  )
})

const SelectItem = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Select.Item>) => {
  return (
    <Select.Item
      className={cx(
        'flex items-center [&>span]:truncate gap-x-3 text-sm min-w-0 w-full busy:bg-pampas px-2 min-h-9 rounded-2xl cursor-pointer select-none whitespace-nowrap',
        className
      )}
      {...props}
    >
      <Select.ItemText className='min-w-0 flex-1'>{children}</Select.ItemText>

      <Select.ItemIndicator className='ml-auto shrink-0'>
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  )
}

/**
 * Utils
 */

const defaultFormat = (props: { country: string; number: string }) => {
  return `(+${props.country}) ${props.number}`
}

const parseNumber = (value: string) => {
  const parsed = parsePhoneNumber(value)

  return {
    code: parsed?.countryCallingCode?.toString(),
    number: parsed?.nationalNumber?.toString(),
  }
}

const stripPrefix = (value: string) => {
  const regex = /^\(\+\d{1,3}\)\s*|\+\d{1,3}\s*/
  return value.replace(regex, '')
}
