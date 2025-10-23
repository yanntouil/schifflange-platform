# Feature Library - Dashboard

Crée le dashboard Library en suivant EXACTEMENT le pattern Directory existant.

## Structure à reproduire

**Référence :** `packages/features/directory`
**Emplacement :** `packages/features/libraries`

### 1. Service Context

Créer `library.service.context.ts` basé sur `service.context.ts` de Directory

### 2. Collections à gérer

- **Libraries** (principale)
- **LibraryDocuments** (sous-collection)

### 3. Pour chaque collection, créer :

**Libraries :**

- `use-swr-libraries.ts` - Hook SWR data fetching and mutation
- `libraries.context.tsx` - Context
- `libraries.context.actions.ts` - Actions (create, edit, delete, publish, etc.)
- `libraries.context.provider.tsx` - Provider avec selection
- Composants : libraries et libraries. card, cards, table, create, edit, filters, header, menu, .tsx
- `library.child-libraries.tsx` - Hiérarchie (parentLibraryId) doit pouvoir réutilisé le composant libraries

**LibraryDocuments :**

- `library.documents.context.actions.ts`
- `library.documents.context.provider.tsx`
- `use-swr-library-documents.ts`
- Composants : card, cards, table, create, edit, .tsx
- Gestion files (ManyToMany avec locale)

## Checklist

- [ ] Service context avec routes
- [ ] SWR hook Libraries
- [ ] Actions Libraries
- [ ] Provider Libraries
- [ ] Composants Libraries (8 fichiers)
- [ ] SWR hook LibraryDocuments
- [ ] Actions LibraryDocuments
- [ ] Provider LibraryDocuments
- [ ] Composants LibraryDocuments (5 fichiers)
