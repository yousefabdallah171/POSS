/**
 * ContactSection Component Metadata
 */

import { z } from 'zod'
import {
  ComponentMetadata,
  ComponentType,
  ComponentCategory,
  IndustryType,
} from '../../registry/registry-types'

const ContactConfigSchema = z.object({
  title_en: z.string().optional(),
  title_ar: z.string().optional(),
  show_form: z.boolean().default(true),
  show_map: z.boolean().default(true),
})

export const ContactSectionMetadata: ComponentMetadata = {
  id: 'contact-section',
  name: 'Contact Section',
  type: ComponentType.CONTACT,
  version: '1.0.0',

  category: ComponentCategory.FORMS,
  tags: ['contact', 'form', 'inquiry', 'email', 'phone'],
  industries: [
    IndustryType.GENERIC,
    IndustryType.RESTAURANT,
    IndustryType.RETAIL,
    IndustryType.SERVICES,
  ],

  icon: '📧',
  description: 'Contact form with contact information and optional map embed',
  thumbnail: './preview.png',

  isDraggable: true,
  isEditable: true,
  isReorderable: true,
  isSingleton: false,
  isRequired: false,

  editorComponent: 'ContactEditor',
  defaultConfig: {
    title_en: 'Contact Us',
    title_ar: 'اتصل بنا',
    show_form: true,
    show_map: true,
  },
  configSchema: {
    type: 'zod',
    schema: ContactConfigSchema,
  },

  estimatedSize: 'medium',
  lazyLoadable: true,

  documentation: `
# Contact Section

Enable visitors to get in touch with a contact form, phone number, email, and address information.

## Features
- Contact inquiry form
- Phone number with tel link
- Email with mailto link
- Physical address display
- Optional map embed
- Bilingual support (English/Arabic)
- Form validation
- RTL support

## Best Practices
- Always show business contact information
- Make form fields clear and required
- Include phone number for immediate contact
- Test form submission on all devices
- Provide clear success/error messages

## Settings
- **Title**: Section heading (supports EN/AR)
- **Show Form**: Toggle contact form display
- **Show Map**: Toggle map embed display
  `,

  examples: [
    {
      name: 'Restaurant Contact',
      description: 'Contact section for a restaurant',
      config: {
        title_en: 'Get In Touch',
        title_ar: 'تواصل معنا',
        show_form: true,
        show_map: true,
      },
    },
  ],
}

export default ContactSectionMetadata
