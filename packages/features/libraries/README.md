# Libraries Feature

This package provides a complete dashboard implementation for managing Libraries and Library Documents.

## Structure

### Collections

- **Libraries** - Main library entities with hierarchical structure (parent/child relationships)
- **LibraryDocuments** - Documents belonging to libraries with file attachments support

### Features

- Full CRUD operations for both Libraries and LibraryDocuments
- SWR-based data fetching and mutation
- Context providers with selection support
- Hierarchical library structure (parent/child libraries)
- Multi-language support via translatable fields
- Card and table view modes
- File attachments for library documents (ManyToMany with locale support)

## Usage

### Libraries

```tsx
import { LibrariesProvider, Libraries, useSwrLibraries } from "@features/libraries"

// In your component
const swr = useSwrLibraries()

<LibrariesProvider swr={swr}>
  <Libraries />
</LibrariesProvider>
```

### Library Documents

```tsx
import { LibraryDocumentsProvider, useSwrLibraryDocuments } from "@features/libraries"

const swr = useSwrLibraryDocuments(libraryId)

<LibraryDocumentsProvider libraryId={libraryId} swr={swr}>
  {/* Your components */}
</LibraryDocumentsProvider>
```

### Child Libraries (Hierarchical)

```tsx
import { LibraryChildLibraries, useSwrLibrary } from "@features/libraries"

const { library, swrChildLibraries } = useSwrLibrary(libraryId)

<LibraryChildLibraries swr={swrChildLibraries} />
```

## Components

### Libraries
- `Libraries` - Main collection component with toolbar and pagination
- `LibrariesCards` / `LibrariesCard` - Card view components
- `LibrariesTable` - Table view component
- `LibrariesForm` - Form fields component
- `LibrariesCreateDialog` / `LibrariesEditDialog` - CRUD dialogs
- `LibrariesMenu` - Context menu component
- `LibraryChildLibraries` - Hierarchical child libraries component

### Library Documents
- `LibraryDocumentsCards` / `LibraryDocumentsCard` - Card view components
- `LibraryDocumentsTable` - Table view component
- `LibraryDocumentsForm` - Form fields component
- `LibraryDocumentsCreateDialog` / `LibraryDocumentsEditDialog` - CRUD dialogs

## API Integration

This feature integrates with the backend API through `@services/dashboard`:

- `workspaces/:wid/libraries` - Libraries CRUD endpoints
- `workspaces/:wid/libraries/:lid/documents` - Library Documents CRUD endpoints

## Translations

All components include translations for:
- English (en)
- French (fr)
- German (de)
