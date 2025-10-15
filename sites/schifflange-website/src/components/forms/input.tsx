import { inputVariants } from '@/components/forms/variants-input'
import { cx } from 'class-variance-authority'
import React from 'react'
import { Form } from 'use-a11y-form'

/**
 * FieldInputProps
 */
export type FieldInputProps = React.ComponentProps<typeof Form.Input> & {
  type?: FormInputType
}

export const FieldInput = React.forwardRef<HTMLInputElement, FieldInputProps>((props, ref) => {
  const { type = 'text', className, ...inputProps } = props

  return (
    <Form.Input {...inputProps} ref={ref} type={type} className={cx(inputVariants(), className)} />
  )
})

/**
 * FieldTextArea
 */

export type FieldTextAreaProps = React.ComponentProps<'textarea'>

export const FieldTextArea = React.forwardRef<HTMLTextAreaElement, FieldTextAreaProps>(
  (props, ref) => {
    const { className, ...textareaProps } = props

    return (
      <Form.FieldContext<string>>
        {field => (
          <textarea
            {...textareaProps}
            value={field.value}
            onChange={e => field.setFieldValue(e.target.value)}
            ref={ref}
            className={cx(inputVariants(), className)}
          />
        )}
      </Form.FieldContext>
    )
  }
)

/**
 * FormInputType
 */
export type FormInputType =
  | 'text'
  | 'email'
  | 'date'
  | 'datetime-local'
  | 'month'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'time'
  | 'week'
  | 'url'
