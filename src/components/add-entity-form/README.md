# Add Entity Form Component

A dynamic, reusable form component for creating and editing different entity types (Trips, Batches, Users, Coupons, and Leads) in the Barefoot Nomad admin panel. The form displays inline, replacing the table view when activated.

## Features

- **Dynamic Form Generation**: Single component handles all entity types
- **Inline Display**: Replaces table view instead of opening as a popup
- **Form Validation**: Comprehensive validation with error messages
- **File Upload Support**: Image and document uploads for trips
- **Responsive Design**: Mobile-friendly layout
- **Type-Safe**: Full TypeScript support with interfaces

## Entity Types Supported

### 1. Trips
- Trip name
- Itinerary file upload (PDF/DOC)
- Number of days (with quick selectors 1-5)
- Heading
- Description
- Multiple image uploads (up to 8 images)

### 2. Batches
- Batch name
- Assigned trip
- Start/End dates
- Pricing (Standard, Single, Double, Triple room)
- Tax
- Availability status

### 3. Users
- Name
- Email
- Phone number
- Role (User/Admin/Guide)
- Associated trips

### 4. Coupons
- Coupon code
- Deduction percentage
- Start/End dates

### 5. Leads
- Name, Location
- Trip date
- Number of people/days
- Approximate budget
- Email, Phone
- Message

## Usage

### Using as Inline Component

From any component (e.g., Admin Panel):

```typescript
// In your component.ts
showForm = false;
entityType: 'trips' | 'batches' | 'users' | 'coupons' | 'leads' = 'trips';

openForm(type: string) {
  this.entityType = type;
  this.showForm = true;
}

onFormSubmit(event: { action: string, data: any }) {
  if (event.action === 'save') {
    // Handle save
    console.log(event.data);
    this.showForm = false; // Hide form
  } else if (event.action === 'cancel') {
    this.showForm = false; // Hide form
  }
}
```

```html
<!-- In your template -->
<app-add-entity-form 
  *ngIf="showForm"
  [entityType]="entityType"
  [mode]="'add'"
  (formSubmit)="onFormSubmit($event)"
></app-add-entity-form>

<!-- Your table or other content -->
<div *ngIf="!showForm">
  <!-- Table goes here -->
</div>
```

### Integration in Admin Panel

The component is already integrated with the admin panel. Each tab toggles between form and table view:

```html
<button class="addActionBtn" (click)="openAddEntityForm('trips')">
  <mat-icon>add</mat-icon>
</button>
```

## Component API

### Inputs

- `entityType: 'trips' | 'batches' | 'users' | 'coupons' | 'leads'` - Type of entity to create/edit
- `mode: 'add' | 'edit'` - Form mode (default: 'add')
- `data?: any` - Existing data for edit mode

### Outputs

- `formSubmit: EventEmitter<{ action: string, data: any }>` - Emits form submission events
  - `action: 'save'` - When form is submitted successfully
  - `action: 'cancel'` - When user cancels the form

## Configuration

### EntityFormConfig Interface

\`\`\`typescript
export interface EntityFormConfig {
  entityType: 'trips' | 'batches' | 'users' | 'coupons' | 'leads';
  mode?: 'add' | 'edit';
  data?: any; // For edit mode, pass existing data
}
\`\`\`

## Form Data Structure

### For Trips (FormData)
Returns FormData object for file uploads:
- name: string
- heading: string
- description: string
- numberOfDays: number
- itinerary: File
- images: File[]

### For Other Entities (JSON)
Returns plain JavaScript object matching the entity interface

## Validation

All required fields are validated:
- Required field validation
- Email format validation
- Minimum value validation for numbers
- Real-time error display

## Styling

The component uses:
- Material Design principles
- Custom SCSS with BEM-like naming
- Responsive grid layout
- Smooth transitions between form and table views
- Consistent color scheme (#6c93d8 primary blue)

### CSS Classes

- `.entity-form-dialog` - Main container
- `.dialog-header` - Header with title and actions
- `.dialog-content` - Scrollable form content
- `.form-grid` - Two-column responsive grid
- `.form-group` - Individual form field container

## File Structure

\`\`\`
add-entity-form/
├── add-entity-form.component.ts      # Component logic
├── add-entity-form.component.html    # Template
├── add-entity-form.component.scss    # Styles
└── add-entity-form.component.spec.ts # Tests
\`\`\`

## Dependencies

- @angular/forms (ReactiveFormsModule)
- @angular/material/icon
- @angular/common (for *ngIf, *ngFor)

Note: MatDialog is NOT required as the component works inline.

## Customization

### Adding a New Entity Type

1. Add the type to the union in `EntityFormConfig`
2. Add a case in `initializeForm()` method
3. Add corresponding HTML section in template
4. Update `prepareFormData()` if needed

### Styling

Modify `add-entity-form.component.scss` to customize:
- Colors (change `#6c93d8` to your primary color)
- Spacing (adjust padding/margins)
- Typography (font sizes, weights)
- Layout (grid columns, breakpoints)

## Best Practices

1. **Always handle the form submission event**: Check for `action === 'save'` before processing data
2. **Toggle visibility properly**: Hide form after save/cancel to return to table view
3. **Validate on backend**: Client-side validation is not enough
4. **Handle errors**: Show appropriate error messages for failed operations
5. **Loading states**: Show loading indicator during save operations
6. **Success feedback**: Notify user when operation completes

## Future Enhancements

- [ ] Drag-and-drop file uploads
- [ ] Image preview before upload
- [ ] Auto-save drafts
- [ ] Multi-step forms for complex entities
- [ ] Field dependency management
- [ ] Conditional field visibility
- [ ] Bulk entity creation

## Notes

- The component is already registered in `app.module.ts`
- Displays inline within the tab, replacing the table view
- File uploads use FormData for proper multipart/form-data encoding
- The component is mobile-responsive with breakpoint at 768px
- Each entity type has its own visibility flag in the parent component
