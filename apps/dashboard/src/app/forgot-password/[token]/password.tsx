import { Form, useFormContext } from "@compo/form"
import { useTranslation } from "@compo/localize"
import { Ui } from "@compo/ui"
import { match } from "@compo/utils"
import { Check, X } from "lucide-react"
import React from "react"

/**
 * FormPassword
 * this component is used to display the password strength and the password input
 * in forgot password form and invitation register form
 */
export const FormPassword: React.FC = () => {
  const { _ } = useTranslation(dictionary)
  const form = useFormContext<{ password: string; confirmPassword: string }>()
  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, level: "none", color: "muted" }

    let score = 0

    // Length bonus
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (password.length >= 16) score += 1

    // Character variety
    if (/[a-z]/.test(password)) score += 1 // lowercase
    if (/[A-Z]/.test(password)) score += 1 // uppercase
    if (/[0-9]/.test(password)) score += 1 // numbers
    if (/[^A-Za-z0-9]/.test(password)) score += 1 // special chars

    // Patterns (reduce score)
    if (/(.)\1{2,}/.test(password)) score -= 1 // repeated chars
    if (/123|abc|qwe|asd/i.test(password)) score -= 1 // common patterns

    const level = score <= 2 ? "weak" : score <= 4 ? "medium" : score <= 6 ? "strong" : "very-strong"
    const color = score <= 2 ? "destructive" : score <= 4 ? "warning" : score <= 6 ? "success" : "success"

    return { score: Math.max(0, score), level, color }
  }

  const passwordStrength = getPasswordStrength(form.values.password)
  return (
    <>
      <div className="space-y-3">
        <Form.Password name="password" label={_("password-label")} placeholder={_("password-placeholder")} required />
        {form.values.password && (
          <Ui.AnimateHeight>
            <div className="space-y-2 rounded-md border p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{_("password-strength")}</span>
                <span
                  className={cxm(
                    "font-medium",
                    match(passwordStrength.color)
                      .with("destructive", () => "text-red-600")
                      .with("warning", () => "text-yellow-600")
                      .with("success", () => "text-green-600")
                      .otherwise(() => null)
                  )}
                >
                  {_(`strength-${passwordStrength.level}`)}
                </span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={cxm(
                      "h-1 flex-1 rounded-full",
                      i < Math.ceil((passwordStrength.score / 7) * 4)
                        ? match(passwordStrength.color)
                            .with("destructive", () => "bg-red-600")
                            .with("warning", () => "bg-yellow-600")
                            .with("success", () => "bg-green-600")
                            .otherwise(() => "")
                        : "bg-muted"
                    )}
                  />
                ))}
              </div>
              {passwordStrength.level === "weak" && <p className="text-muted-foreground text-xs">{_("password-tips")}</p>}
            </div>
          </Ui.AnimateHeight>
        )}
      </div>
      <div className="space-y-3">
        <Form.Password
          name="confirmPassword"
          label={_("confirm-password-label")}
          placeholder={_("confirm-password-placeholder")}
          required
        />
        {form.values.password && form.values.confirmPassword && (
          <p className="flex items-center gap-2 text-xs">
            {form.values.password === form.values.confirmPassword ? (
              <>
                <span className="bg-success/10 flex size-4 items-center justify-center rounded-full">
                  <Check className="text-success size-3" aria-hidden="true" />
                </span>
                <span className="text-success">{_("passwords-match")}</span>
              </>
            ) : (
              <>
                <span className="bg-destructive/10 flex size-4 items-center justify-center rounded-full">
                  <X className="text-destructive size-3" aria-hidden />
                </span>
                <span className="text-destructive">{_("passwords-dont-match")}</span>
              </>
            )}
          </p>
        )}
      </div>
    </>
  )
}
/**
 * translations
 */
const dictionary = {
  en: {
    "password-label": "New Password",
    "password-placeholder": "Enter your new password",
    "confirm-password-label": "Confirm Password",
    "confirm-password-placeholder": "Confirm your new password",
    "password-strength": "Password strength",
    "strength-none": "None",
    "strength-weak": "Weak",
    "strength-medium": "Medium",
    "strength-strong": "Strong",
    "strength-very-strong": "Very Strong",
    "password-tips": "Use a mix of uppercase, lowercase, numbers, and special characters for a stronger password.",
    "passwords-match": "Passwords match",
    "passwords-dont-match": "Passwords don't match",
  },
  fr: {
    "password-label": "Nouveau mot de passe",
    "password-placeholder": "Saisissez votre nouveau mot de passe",
    "confirm-password-label": "Confirmer le mot de passe",
    "confirm-password-placeholder": "Confirmez votre nouveau mot de passe",
    "password-strength": "Force du mot de passe",
    "strength-none": "Aucune",
    "strength-weak": "Faible",
    "strength-medium": "Moyenne",
    "strength-strong": "Forte",
    "strength-very-strong": "Très forte",
    "password-tips": "Utilisez un mélange de majuscules, minuscules, chiffres et caractères spéciaux pour un mot de passe plus fort.",
    "passwords-match": "Les mots de passe correspondent",
    "passwords-dont-match": "Les mots de passe ne correspondent pas",
  },
  de: {
    "password-label": "Neues Passwort",
    "password-placeholder": "Geben Sie Ihr neues Passwort ein",
    "confirm-password-label": "Passwort bestätigen",
    "confirm-password-placeholder": "Bestätigen Sie Ihr neues Passwort",
    "password-strength": "Passwort-Stärke",
    "strength-none": "Keine",
    "strength-weak": "Schwach",
    "strength-medium": "Mittel",
    "strength-strong": "Stark",
    "strength-very-strong": "Sehr stark",
    "password-tips": "Verwenden Sie eine Mischung aus Groß-, Kleinbuchstaben, Zahlen und Sonderzeichen für ein stärkeres Passwort.",
    "passwords-match": "Passwörter stimmen überein",
    "passwords-dont-match": "Passwörter stimmen nicht überein",
  },
}
