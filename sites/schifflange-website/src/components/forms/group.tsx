import React from 'react'
import { Form } from 'use-a11y-form'

/**
 * FormGroup
 */

export type FormGroupProps = React.ComponentPropsWithoutRef<'div'> & {
  label: React.ReactNode
  required?: boolean
  name: string
}

export const FormGroup: React.FC<React.PropsWithChildren<FormGroupProps>> = props => {
  const { label, name, children: child, required, ...containerProps } = props

  return (
    <Form.Field name={name}>
      <div {...containerProps}>
        <Form.Label className='mb-2 flex'>
          {label}
          {required && <span className='text-firebrick mx-0.5'>*</span>}
        </Form.Label>

        {child}

        <Form.Error className='mt-2 text-tan' />
      </div>
    </Form.Field>
  )
}
