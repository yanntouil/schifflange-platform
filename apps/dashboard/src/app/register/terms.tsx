import { FormItem, useFieldContext, useFormContext } from "@compo/form"
import { Interpolate, useTranslation } from "@compo/localize"
import { Ui, variants } from "@compo/ui"
import { G } from "@compo/utils"
import React from "react"
import { Link } from "wouter"
import privacyPolicyRoute from "../privacy-policy"
import termsOfUseRoute from "../terms-of-use"

/**
 * Form Terms
 */
export const FormTerms: React.FC<{ name: string }> = ({ name }) => {
  return (
    <FormItem name={name}>
      <Terms />
    </FormItem>
  )
}
export const Terms: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const { id, disabled, value, setFieldValue, error } = useFieldContext<boolean>()
  const { attemptedSubmit } = useFormContext<{ terms: boolean }>()
  const hasError = G.isNotNullable(error) && attemptedSubmit
  return (
    <div className="items-top flex space-x-2">
      <Ui.Checkbox
        id={id}
        checked={value}
        disabled={disabled}
        onCheckedChange={(checked) => setFieldValue(checked === true)}
        variant={hasError ? "destructive" : "default"}
      />
      <div className="-mt-0.5 grid gap-1.5 leading-none">
        <label
          htmlFor={id}
          className={cxm(
            "text-sm/relaxed font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            hasError && "text-destructive"
          )}
        >
          {_("terms-label")}
        </label>
        <p className="text-muted-foreground text-sm/relaxed">
          <Interpolate
            text={_("terms-description")}
            replacements={{
              terms: (replacement) => (
                <Link to={termsOfUseRoute()} className={variants.link({ variant: "underline" })}>
                  {replacement}
                </Link>
              ),
              privacy: (replacement) => (
                <Link to={privacyPolicyRoute()} className={variants.link({ variant: "underline" })}>
                  {replacement}
                </Link>
              ),
            }}
          />
        </p>
      </div>
    </div>
  )
}

const dictionary = {
  en: {
    "terms-label": "I accept the terms of use and the privacy policy",
    "terms-description": "By checking this box, you accept our {{terms:Terms of use}} and our {{privacy:Privacy policy}}.",
    "terms-required": "You must accept the terms of use and the privacy policy to create an account.",
  },
  fr: {
    "terms-label": "J'accepte les conditions d'utilisation et la politique de confidentialité",
    "terms-description":
      "En cochant cette case, vous acceptez nos {{terms:Conditions d'utilisation}} et notre {{privacy:Politique de confidentialité}}.",
    "terms-required": "Vous devez accepter les conditions d'utilisation et la politique de confidentialité pour créer un compte.",
  },
  de: {
    "terms-label": "Ich akzeptiere die Nutzungsbedingungen und die Datenschutzrichtlinie",
    "terms-description":
      "Durch das Ankreuzen dieses Kästchens akzeptieren Sie unsere {{terms:Nutzungsbedingungen}} und unsere {{privacy:Datenschutzrichtlinie}}.",
    "terms-required": "Sie müssen die Nutzungsbedingungen und die Datenschutzrichtlinie akzeptieren, um ein Konto zu erstellen.",
  },
}
